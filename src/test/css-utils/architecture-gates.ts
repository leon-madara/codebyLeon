/**
 * CSS Architecture Gates
 *
 * Enforces:
 * 1) No duplicate token keys in the same file
 * 2) No undeclared token references (with a small runtime allowlist)
 * 3) No known selector leakage patterns in feature CSS
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import * as csstree from 'css-tree';
import { parseAllCSSFiles, findUndeclaredTokenReferences, type CSSFileInfo } from './parser';

interface DuplicateTokenInFile {
  file: string;
  scope: string;
  token: string;
  lines: number[];
}

interface SelectorLeakage {
  file: string;
  line: number;
  selector: string;
}

const RUNTIME_TOKEN_ALLOWLIST = new Set<string>([
  '--animation-delay',
  '--hs-tab-bg',
  '--hs-wave-transform',
  '--parallax-translate',
  '--x',
  '--y',
]);

function findDuplicateTokenKeysInSameFile(cssFiles: CSSFileInfo[]): DuplicateTokenInFile[] {
  const duplicates: DuplicateTokenInFile[] = [];

  cssFiles.forEach((fileInfo) => {
    const scopes = new Map<string, Map<string, number[]>>();

    csstree.walk(fileInfo.ast, {
      visit: 'Rule',
      enter(node: any) {
        if (!node.block || !node.prelude) return;
        const scope = csstree.generate(node.prelude);
        const scopeMap = scopes.get(scope) ?? new Map<string, number[]>();

        node.block.children.forEach((child: any) => {
          if (child.type !== 'Declaration') return;
          if (!child.property || !child.property.startsWith('--')) return;

          const token = child.property;
          const existing = scopeMap.get(token) ?? [];
          existing.push(child.loc?.start.line ?? 0);
          scopeMap.set(token, existing);
        });

        scopes.set(scope, scopeMap);
      },
    });

    scopes.forEach((scopeMap, scope) => {
      scopeMap.forEach((lineNumbers, token) => {
        if (lineNumbers.length > 1) {
          duplicates.push({
            file: fileInfo.path,
            scope,
            token,
            lines: lineNumbers,
          });
        }
      });
    });
  });

  return duplicates;
}

function findSelectorLeakageInConfigurator(configuratorPath: string): SelectorLeakage[] {
  const lines = readFileSync(configuratorPath, 'utf-8').split('\n');
  const leakage: SelectorLeakage[] = [];
  const leakagePatterns = [
    /^\s*\.form-group\b/,
    /^\s*\.cta-primary\b/,
    /^\s*\.cta-secondary\b/,
    /^\s*\.btn-continue\b/,
    /^\s*\.modal-backdrop\b/,
    /^\s*\.modal-dialog\b/,
    /^\s*\.modal-title\b/,
    /^\s*\.modal-message\b/,
    /^\s*\.modal-actions\b/,
    /^\s*\.modal-btn\b/,
    /^\s*\.modal-btn-primary\b/,
    /^\s*\.modal-btn-secondary\b/,
    /^\s*\.modal-btn-cancel\b/,
    /^\s*\[data-theme="dark"\]\s+\.modal-dialog\b/,
    /^\s*\[data-theme="dark"\]\s+\.modal-backdrop\b/,
  ];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('/*') || trimmed.includes('.configurator-page')) return;

    for (const pattern of leakagePatterns) {
      if (pattern.test(line)) {
        leakage.push({
          file: configuratorPath,
          line: index + 1,
          selector: trimmed,
        });
        break;
      }
    }
  });

  return leakage;
}

export function runArchitectureGates(stylesDir: string): number {
  const cssFiles = parseAllCSSFiles(stylesDir);

  const duplicateTokens = findDuplicateTokenKeysInSameFile(cssFiles);
  const undeclaredTokenReferences = findUndeclaredTokenReferences(cssFiles).filter(
    (ref) => !RUNTIME_TOKEN_ALLOWLIST.has(ref.tokenName)
  );

  const configuratorPath = join(stylesDir, 'features', 'configurator.css');
  const selectorLeakage = findSelectorLeakageInConfigurator(configuratorPath);

  const hasFailures =
    duplicateTokens.length > 0 ||
    undeclaredTokenReferences.length > 0 ||
    selectorLeakage.length > 0;

  if (!hasFailures) {
    console.log('CSS architecture gates passed.');
    return 0;
  }

  console.error('CSS architecture gates failed.');

  if (duplicateTokens.length > 0) {
    console.error('\nDuplicate token keys found in the same file:');
    duplicateTokens.forEach((item) => {
      console.error(`- ${item.token} in ${item.file} (scope: ${item.scope}) at lines: ${item.lines.join(', ')}`);
    });
  }

  if (undeclaredTokenReferences.length > 0) {
    console.error('\nUndeclared token references found:');
    undeclaredTokenReferences.slice(0, 100).forEach((ref) => {
      console.error(`- ${ref.tokenName} at ${ref.file}:${ref.line} (${ref.property})`);
    });
    if (undeclaredTokenReferences.length > 100) {
      console.error(`...and ${undeclaredTokenReferences.length - 100} more`);
    }
  }

  if (selectorLeakage.length > 0) {
    console.error('\nSelector leakage detected in configurator feature styles:');
    selectorLeakage.forEach((item) => {
      console.error(`- ${item.file}:${item.line} -> ${item.selector}`);
    });
  }

  return 1;
}
