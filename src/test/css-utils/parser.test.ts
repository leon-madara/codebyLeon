/**
 * Unit tests for CSS parser utilities
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import {
  calculateSpecificity,
  exceedsMaxSpecificity,
  parseCSSFile,
  extractAllSelectors,
  extractTokenDefinitions,
  findDuplicateTokens,
  extractTokenReferences,
  findUndefinedTokenReferences,
  type SpecificityScore,
} from './parser';

describe('CSS Parser Utilities', () => {
  describe('calculateSpecificity', () => {
    it('should calculate specificity for single class selector', () => {
      const specificity = calculateSpecificity('.button');
      expect(specificity).toEqual({
        inline: 0,
        ids: 0,
        classes: 1,
        elements: 0,
      });
    });

    it('should calculate specificity for element selector', () => {
      const specificity = calculateSpecificity('div');
      expect(specificity).toEqual({
        inline: 0,
        ids: 0,
        classes: 0,
        elements: 1,
      });
    });

    it('should calculate specificity for ID selector', () => {
      const specificity = calculateSpecificity('#header');
      expect(specificity).toEqual({
        inline: 0,
        ids: 1,
        classes: 0,
        elements: 0,
      });
    });

    it('should calculate specificity for compound selector', () => {
      const specificity = calculateSpecificity('.button.is-active');
      expect(specificity).toEqual({
        inline: 0,
        ids: 0,
        classes: 2,
        elements: 0,
      });
    });

    it('should calculate specificity for descendant selector', () => {
      const specificity = calculateSpecificity('.navigation .link');
      expect(specificity).toEqual({
        inline: 0,
        ids: 0,
        classes: 2,
        elements: 0,
      });
    });

    it('should calculate specificity for attribute selector', () => {
      const specificity = calculateSpecificity('[data-theme="dark"]');
      expect(specificity).toEqual({
        inline: 0,
        ids: 0,
        classes: 1,
        elements: 0,
      });
    });

    it('should calculate specificity for theme override pattern', () => {
      const specificity = calculateSpecificity('[data-theme="dark"] .button');
      expect(specificity).toEqual({
        inline: 0,
        ids: 0,
        classes: 2,
        elements: 0,
      });
    });

    it('should calculate specificity for pseudo-class', () => {
      const specificity = calculateSpecificity('.button:hover');
      expect(specificity).toEqual({
        inline: 0,
        ids: 0,
        classes: 2,
        elements: 0,
      });
    });

    it('should calculate specificity for element with class', () => {
      const specificity = calculateSpecificity('nav.navbar');
      expect(specificity).toEqual({
        inline: 0,
        ids: 0,
        classes: 1,
        elements: 1,
      });
    });

    it('should calculate specificity for complex selector', () => {
      const specificity = calculateSpecificity('nav.navbar .cta-button');
      expect(specificity).toEqual({
        inline: 0,
        ids: 0,
        classes: 2,
        elements: 1,
      });
    });
  });

  describe('exceedsMaxSpecificity', () => {
    it('should return false for single class (0,0,1,0)', () => {
      const specificity: SpecificityScore = {
        inline: 0,
        ids: 0,
        classes: 1,
        elements: 0,
      };
      expect(exceedsMaxSpecificity(specificity)).toBe(false);
    });

    it('should return false for two classes (0,0,2,0)', () => {
      const specificity: SpecificityScore = {
        inline: 0,
        ids: 0,
        classes: 2,
        elements: 0,
      };
      expect(exceedsMaxSpecificity(specificity)).toBe(false);
    });

    it('should return true for three classes (0,0,3,0)', () => {
      const specificity: SpecificityScore = {
        inline: 0,
        ids: 0,
        classes: 3,
        elements: 0,
      };
      expect(exceedsMaxSpecificity(specificity)).toBe(true);
    });

    it('should return true for ID selector (0,1,0,0)', () => {
      const specificity: SpecificityScore = {
        inline: 0,
        ids: 1,
        classes: 0,
        elements: 0,
      };
      expect(exceedsMaxSpecificity(specificity)).toBe(true);
    });

    it('should return true for inline style (1,0,0,0)', () => {
      const specificity: SpecificityScore = {
        inline: 1,
        ids: 0,
        classes: 0,
        elements: 0,
      };
      expect(exceedsMaxSpecificity(specificity)).toBe(true);
    });

    it('should return false for element with class (0,0,1,1)', () => {
      const specificity: SpecificityScore = {
        inline: 0,
        ids: 0,
        classes: 1,
        elements: 1,
      };
      expect(exceedsMaxSpecificity(specificity)).toBe(false);
    });

    it('should return false for two classes with elements (0,0,2,2)', () => {
      const specificity: SpecificityScore = {
        inline: 0,
        ids: 0,
        classes: 2,
        elements: 2,
      };
      expect(exceedsMaxSpecificity(specificity)).toBe(false);
    });
  });

  describe('parseCSSFile', () => {
    const testDir = join(process.cwd(), 'src/test/css-utils/__test-files__');
    
    beforeAll(() => {
      // Create test directory
      mkdirSync(testDir, { recursive: true });
      
      // Create test CSS file
      const testCSS = `
:root {
  --color-primary: #cd340f;
  --spacing-md: 1rem;
}

.button {
  padding: var(--spacing-md);
  background: var(--color-primary);
}

.button--primary {
  color: white;
}

.navigation__link {
  text-decoration: none;
}

#header {
  position: fixed;
}
`;
      writeFileSync(join(testDir, 'test.css'), testCSS, 'utf-8');
    });

    it('should parse CSS file and extract selectors', () => {
      const fileInfo = parseCSSFile(join(testDir, 'test.css'));
      
      expect(fileInfo.selectors.length).toBeGreaterThan(0);
      expect(fileInfo.selectors.some(s => s.selector === '.button')).toBe(true);
      expect(fileInfo.selectors.some(s => s.selector === '.button--primary')).toBe(true);
      expect(fileInfo.selectors.some(s => s.selector === '.navigation__link')).toBe(true);
    });

    it('should parse CSS file and extract tokens', () => {
      const fileInfo = parseCSSFile(join(testDir, 'test.css'));
      
      expect(fileInfo.tokens.length).toBe(2);
      expect(fileInfo.tokens.some(t => t.name === '--color-primary')).toBe(true);
      expect(fileInfo.tokens.some(t => t.name === '--spacing-md')).toBe(true);
    });

    it('should calculate line count', () => {
      const fileInfo = parseCSSFile(join(testDir, 'test.css'));
      expect(fileInfo.lineCount).toBeGreaterThan(0);
    });

    it('should detect ID selectors', () => {
      const fileInfo = parseCSSFile(join(testDir, 'test.css'));
      const idSelector = fileInfo.selectors.find(s => s.selector === '#header');
      
      expect(idSelector).toBeDefined();
      expect(idSelector?.specificity.ids).toBe(1);
    });
  });

  describe('extractAllSelectors', () => {
    const testDir = join(process.cwd(), 'src/test/css-utils/__test-files__');
    
    it('should extract selectors from multiple files', () => {
      const file1CSS = `.button { color: red; }`;
      const file2CSS = `.card { padding: 1rem; }`;
      
      writeFileSync(join(testDir, 'file1.css'), file1CSS, 'utf-8');
      writeFileSync(join(testDir, 'file2.css'), file2CSS, 'utf-8');
      
      const fileInfo1 = parseCSSFile(join(testDir, 'file1.css'));
      const fileInfo2 = parseCSSFile(join(testDir, 'file2.css'));
      
      const allSelectors = extractAllSelectors([fileInfo1, fileInfo2]);
      
      expect(allSelectors.length).toBe(2);
      expect(allSelectors.some(s => s.selector === '.button')).toBe(true);
      expect(allSelectors.some(s => s.selector === '.card')).toBe(true);
    });
  });

  describe('extractTokenDefinitions', () => {
    const testDir = join(process.cwd(), 'src/test/css-utils/__test-files__');
    
    it('should extract token definitions from multiple files', () => {
      const tokensCSS = `:root { --color-primary: red; --spacing-md: 1rem; }`;
      const componentCSS = `:root { --button-bg: blue; }`;
      
      writeFileSync(join(testDir, 'tokens.css'), tokensCSS, 'utf-8');
      writeFileSync(join(testDir, 'component.css'), componentCSS, 'utf-8');
      
      const fileInfo1 = parseCSSFile(join(testDir, 'tokens.css'));
      const fileInfo2 = parseCSSFile(join(testDir, 'component.css'));
      
      const tokenMap = extractTokenDefinitions([fileInfo1, fileInfo2]);
      
      expect(tokenMap.size).toBe(3);
      expect(tokenMap.has('--color-primary')).toBe(true);
      expect(tokenMap.has('--spacing-md')).toBe(true);
      expect(tokenMap.has('--button-bg')).toBe(true);
    });
  });

  describe('findDuplicateTokens', () => {
    const testDir = join(process.cwd(), 'src/test/css-utils/__test-files__');
    
    it('should find duplicate token definitions', () => {
      const file1CSS = `:root { --color-primary: red; }`;
      const file2CSS = `:root { --color-primary: blue; }`;
      
      writeFileSync(join(testDir, 'dup1.css'), file1CSS, 'utf-8');
      writeFileSync(join(testDir, 'dup2.css'), file2CSS, 'utf-8');
      
      const fileInfo1 = parseCSSFile(join(testDir, 'dup1.css'));
      const fileInfo2 = parseCSSFile(join(testDir, 'dup2.css'));
      
      const duplicates = findDuplicateTokens([fileInfo1, fileInfo2]);
      
      expect(duplicates.size).toBe(1);
      expect(duplicates.has('--color-primary')).toBe(true);
      expect(duplicates.get('--color-primary')?.length).toBe(2);
    });

    it('should not report tokens defined once', () => {
      const file1CSS = `:root { --color-primary: red; }`;
      const file2CSS = `:root { --color-secondary: blue; }`;
      
      writeFileSync(join(testDir, 'unique1.css'), file1CSS, 'utf-8');
      writeFileSync(join(testDir, 'unique2.css'), file2CSS, 'utf-8');
      
      const fileInfo1 = parseCSSFile(join(testDir, 'unique1.css'));
      const fileInfo2 = parseCSSFile(join(testDir, 'unique2.css'));
      
      const duplicates = findDuplicateTokens([fileInfo1, fileInfo2]);
      
      expect(duplicates.size).toBe(0);
    });
  });

  describe('extractTokenReferences', () => {
    const testDir = join(process.cwd(), 'src/test/css-utils/__test-files__');
    
    it('should extract token references from CSS', () => {
      const cssContent = `
.button {
  padding: var(--spacing-md);
  background: var(--color-primary);
  color: var(--color-text);
}
`;
      writeFileSync(join(testDir, 'refs.css'), cssContent, 'utf-8');
      
      const fileInfo = parseCSSFile(join(testDir, 'refs.css'));
      const references = extractTokenReferences([fileInfo]);
      
      expect(references.length).toBe(3);
      expect(references.some(r => r.tokenName === '--spacing-md')).toBe(true);
      expect(references.some(r => r.tokenName === '--color-primary')).toBe(true);
      expect(references.some(r => r.tokenName === '--color-text')).toBe(true);
    });
  });

  describe('findUndefinedTokenReferences', () => {
    const testDir = join(process.cwd(), 'src/test/css-utils/__test-files__');
    const tokensDir = 'tokens';
    
    it('should find undefined token references', () => {
      // Create tokens directory structure
      mkdirSync(join(testDir, tokensDir), { recursive: true });
      
      const tokensCSS = `:root { --color-primary: red; }`;
      const componentCSS = `.button { background: var(--color-primary); color: var(--undefined-token); }`;
      
      writeFileSync(join(testDir, tokensDir, 'colors.css'), tokensCSS, 'utf-8');
      writeFileSync(join(testDir, 'button.css'), componentCSS, 'utf-8');
      
      const tokenFile = parseCSSFile(join(testDir, tokensDir, 'colors.css'));
      const componentFile = parseCSSFile(join(testDir, 'button.css'));
      
      const undefined = findUndefinedTokenReferences([tokenFile, componentFile], tokensDir);
      
      expect(undefined.length).toBe(1);
      expect(undefined[0].tokenName).toBe('--undefined-token');
    });

    it('should not report defined tokens as undefined', () => {
      const tokensCSS = `:root { --color-primary: red; --spacing-md: 1rem; }`;
      const componentCSS = `.button { background: var(--color-primary); padding: var(--spacing-md); }`;
      
      writeFileSync(join(testDir, tokensDir, 'tokens.css'), tokensCSS, 'utf-8');
      writeFileSync(join(testDir, 'component2.css'), componentCSS, 'utf-8');
      
      const tokenFile = parseCSSFile(join(testDir, tokensDir, 'tokens.css'));
      const componentFile = parseCSSFile(join(testDir, 'component2.css'));
      
      const undefined = findUndefinedTokenReferences([tokenFile, componentFile], tokensDir);
      
      expect(undefined.length).toBe(0);
    });
  });
});
