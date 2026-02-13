/**
 * Integration tests for CSS testing infrastructure
 * 
 * These tests verify that the CSS testing utilities work correctly
 * with real CSS files from the project.
 */

import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { existsSync } from 'fs';
import {
  parseCSSFile,
  findCSSFiles,
  parseAllCSSFiles,
  findDuplicateTokens,
  findHighSpecificitySelectors,
  findImportantDeclarations,
} from './parser';
import {
  calculateBundleSize,
  collectCurrentMetrics,
  loadBaselineMetrics,
} from './metrics';

const CSS_DIR = join(process.cwd(), 'src', 'styles');

describe('CSS Testing Infrastructure Integration', () => {
  describe('CSS File Discovery', () => {
    it('should find CSS files in styles directory', () => {
      const cssFiles = findCSSFiles(CSS_DIR);
      
      expect(cssFiles.length).toBeGreaterThan(0);
    });

    it('should parse all CSS files without errors', () => {
      const cssFiles = findCSSFiles(CSS_DIR);
      
      expect(() => {
        cssFiles.forEach(file => parseCSSFile(file));
      }).not.toThrow();
    });
  });

  describe('Token Analysis', () => {
    it('should extract tokens from CSS files', () => {
      const cssFiles = parseAllCSSFiles(CSS_DIR);
      const allTokens = cssFiles.flatMap(file => file.tokens);
      
      expect(allTokens.length).toBeGreaterThan(0);
    });

    it('should identify duplicate tokens', () => {
      const cssFiles = parseAllCSSFiles(CSS_DIR);
      const duplicates = findDuplicateTokens(cssFiles);
      
      // This test documents current state - duplicates exist before refactoring
      // After refactoring, this should be 0
      console.log(`Found ${duplicates.size} duplicate tokens (expected before refactoring)`);
    });
  });

  describe('Specificity Analysis', () => {
    it('should calculate specificity for all selectors', () => {
      const cssFiles = parseAllCSSFiles(CSS_DIR);
      const allSelectors = cssFiles.flatMap(file => file.selectors);
      
      expect(allSelectors.length).toBeGreaterThan(0);
      
      // All selectors should have specificity calculated
      allSelectors.forEach(selector => {
        expect(selector.specificity).toBeDefined();
        expect(typeof selector.specificity.classes).toBe('number');
      });
    });

    it('should identify high-specificity selectors', () => {
      const cssFiles = parseAllCSSFiles(CSS_DIR);
      const highSpecificity = findHighSpecificitySelectors(cssFiles);
      
      // This test documents current state - high specificity exists before refactoring
      console.log(`Found ${highSpecificity.length} high-specificity selectors (expected before refactoring)`);
    });
  });

  describe('Important Declarations', () => {
    it('should identify !important declarations', () => {
      const cssFiles = parseAllCSSFiles(CSS_DIR);
      const importantDecls = findImportantDeclarations(cssFiles);
      
      // This test documents current state
      console.log(`Found ${importantDecls.length} !important declarations (expected before refactoring)`);
    });
  });

  describe('Metrics Collection', () => {
    it('should calculate bundle size', () => {
      const bundleSize = calculateBundleSize(CSS_DIR);
      
      expect(bundleSize.totalSize).toBeGreaterThan(0);
      expect(bundleSize.gzippedSize).toBeGreaterThan(0);
      expect(bundleSize.gzippedSize).toBeLessThan(bundleSize.totalSize);
      expect(bundleSize.fileCount).toBeGreaterThan(0);
      expect(bundleSize.files.length).toBe(bundleSize.fileCount);
    });

    it('should collect current metrics', () => {
      const metrics = collectCurrentMetrics(CSS_DIR);
      
      expect(metrics.bundleSize).toBeDefined();
      expect(metrics.cssParsingTime).toBeGreaterThan(0);
      expect(metrics.timestamp).toBeGreaterThan(0);
    });

    it('should load baseline metrics', () => {
      const baseline = loadBaselineMetrics();
      
      // Baseline should exist after running collect-baseline script
      if (baseline) {
        expect(baseline.version).toBe('1.0.0-baseline');
        expect(baseline.bundleSize).toBeDefined();
        expect(baseline.timestamp).toBeGreaterThan(0);
      } else {
        console.log('⚠️  No baseline found - run: npm run css:baseline');
      }
    });
  });

  describe('File Structure Verification (Post-Refactor)', () => {
    it('should verify configurator.css exists in features directory', () => {
      const configPath = join(CSS_DIR, 'features', 'configurator.css');
      expect(existsSync(configPath)).toBe(true);
    });

    it('should verify mouse-trail.css exists in features directory', () => {
      const mousePath = join(CSS_DIR, 'features', 'mouse-trail.css');
      expect(existsSync(mousePath)).toBe(true);
    });
  });
});
