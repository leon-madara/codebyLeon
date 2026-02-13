/**
 * Unit tests for CSS metrics utilities
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import {
  formatBytes,
  compareMetrics,
  calculateBundleSize,
  measureCSSParsingTime,
  calculateTotalParsingTime,
  collectCurrentMetrics,
  generateMetricsReport,
  type PerformanceMetrics,
  type BaselineMetrics,
} from './metrics';

describe('CSS Metrics Utilities', () => {
  describe('formatBytes', () => {
    it('should format 0 bytes', () => {
      expect(formatBytes(0)).toBe('0 Bytes');
    });

    it('should format bytes', () => {
      expect(formatBytes(500)).toBe('500 Bytes');
    });

    it('should format kilobytes', () => {
      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(2048)).toBe('2 KB');
    });

    it('should format megabytes', () => {
      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(2097152)).toBe('2 MB');
    });

    it('should format with decimals', () => {
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(1572864)).toBe('1.5 MB');
    });
  });

  describe('compareMetrics', () => {
    it('should calculate bundle size reduction', () => {
      const baseline: BaselineMetrics = {
        bundleSize: {
          totalSize: 100000,
          gzippedSize: 30000,
          fileCount: 5,
          files: [],
        },
        timestamp: Date.now(),
        version: '1.0.0',
        description: 'Baseline',
      };

      const current: PerformanceMetrics = {
        bundleSize: {
          totalSize: 70000,
          gzippedSize: 21000,
          fileCount: 5,
          files: [],
        },
        timestamp: Date.now(),
      };

      const comparison = compareMetrics(current, baseline);

      expect(comparison.bundleSizeReduction).toBe(30000);
      expect(comparison.bundleSizeReductionPercent).toBe(30);
      expect(comparison.gzippedSizeReduction).toBe(9000);
      expect(comparison.gzippedSizeReductionPercent).toBe(30);
    });

    it('should calculate parsing time improvement', () => {
      const baseline: BaselineMetrics = {
        bundleSize: {
          totalSize: 100000,
          gzippedSize: 30000,
          fileCount: 5,
          files: [],
        },
        cssParsingTime: 100,
        timestamp: Date.now(),
        version: '1.0.0',
        description: 'Baseline',
      };

      const current: PerformanceMetrics = {
        bundleSize: {
          totalSize: 70000,
          gzippedSize: 21000,
          fileCount: 5,
          files: [],
        },
        cssParsingTime: 70,
        timestamp: Date.now(),
      };

      const comparison = compareMetrics(current, baseline);

      expect(comparison.parsingTimeChange).toBe(30);
      expect(comparison.parsingTimeChangePercent).toBe(30);
    });

    it('should handle negative changes (size increase)', () => {
      const baseline: BaselineMetrics = {
        bundleSize: {
          totalSize: 70000,
          gzippedSize: 21000,
          fileCount: 5,
          files: [],
        },
        timestamp: Date.now(),
        version: '1.0.0',
        description: 'Baseline',
      };

      const current: PerformanceMetrics = {
        bundleSize: {
          totalSize: 100000,
          gzippedSize: 30000,
          fileCount: 5,
          files: [],
        },
        timestamp: Date.now(),
      };

      const comparison = compareMetrics(current, baseline);

      expect(comparison.bundleSizeReduction).toBe(-30000);
      expect(comparison.bundleSizeReductionPercent).toBeCloseTo(-42.86, 1);
    });

    it('should verify 30-40% reduction target', () => {
      const baseline: BaselineMetrics = {
        bundleSize: {
          totalSize: 100000,
          gzippedSize: 30000,
          fileCount: 5,
          files: [],
        },
        timestamp: Date.now(),
        version: '1.0.0',
        description: 'Baseline',
      };

      // 35% reduction
      const current: PerformanceMetrics = {
        bundleSize: {
          totalSize: 65000,
          gzippedSize: 19500,
          fileCount: 5,
          files: [],
        },
        timestamp: Date.now(),
      };

      const comparison = compareMetrics(current, baseline);

      expect(comparison.bundleSizeReductionPercent).toBe(35);
      expect(comparison.bundleSizeReductionPercent).toBeGreaterThanOrEqual(30);
      expect(comparison.bundleSizeReductionPercent).toBeLessThanOrEqual(40);
    });
  });

  describe('calculateBundleSize', () => {
    const testDir = join(process.cwd(), 'src/test/css-utils/__test-metrics__');
    
    beforeAll(() => {
      mkdirSync(testDir, { recursive: true });
      
      // Create test CSS files
      writeFileSync(join(testDir, 'file1.css'), '.button { color: red; }', 'utf-8');
      writeFileSync(join(testDir, 'file2.css'), '.card { padding: 1rem; }', 'utf-8');
    });

    it('should calculate bundle size for directory', () => {
      const bundleSize = calculateBundleSize(testDir);
      
      expect(bundleSize.fileCount).toBe(2);
      expect(bundleSize.totalSize).toBeGreaterThan(0);
      expect(bundleSize.gzippedSize).toBeGreaterThan(0);
      // Note: For very small files, gzipped size can be larger due to compression overhead
    });

    it('should include file details', () => {
      const bundleSize = calculateBundleSize(testDir);
      
      expect(bundleSize.files.length).toBe(2);
      expect(bundleSize.files[0].path).toBeDefined();
      expect(bundleSize.files[0].size).toBeGreaterThan(0);
      expect(bundleSize.files[0].gzippedSize).toBeGreaterThan(0);
    });
  });

  describe('measureCSSParsingTime', () => {
    it('should measure parsing time for CSS content', () => {
      const cssContent = `
.button { color: red; }
.card { padding: 1rem; }
.navigation { display: flex; }
`;
      const time = measureCSSParsingTime(cssContent);
      
      expect(time).toBeGreaterThanOrEqual(0);
      expect(typeof time).toBe('number');
    });

    it('should handle empty CSS', () => {
      const time = measureCSSParsingTime('');
      expect(time).toBeGreaterThanOrEqual(0);
    });

    it('should handle large CSS', () => {
      const largeCSS = Array(1000).fill('.class { color: red; }').join('\n');
      const time = measureCSSParsingTime(largeCSS);
      
      expect(time).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateTotalParsingTime', () => {
    const testDir = join(process.cwd(), 'src/test/css-utils/__test-metrics__');
    
    it('should calculate total parsing time for directory', () => {
      const totalTime = calculateTotalParsingTime(testDir);
      
      expect(totalTime).toBeGreaterThanOrEqual(0);
      expect(typeof totalTime).toBe('number');
    });
  });

  describe('collectCurrentMetrics', () => {
    const testDir = join(process.cwd(), 'src/test/css-utils/__test-metrics__');
    
    it('should collect all current metrics', () => {
      const metrics = collectCurrentMetrics(testDir);
      
      expect(metrics.bundleSize).toBeDefined();
      expect(metrics.bundleSize.totalSize).toBeGreaterThan(0);
      expect(metrics.cssParsingTime).toBeDefined();
      expect(metrics.cssParsingTime).toBeGreaterThanOrEqual(0);
      expect(metrics.timestamp).toBeDefined();
      expect(metrics.timestamp).toBeGreaterThan(0);
    });
  });

  describe('generateMetricsReport', () => {
    it('should generate report without baseline', () => {
      const current: PerformanceMetrics = {
        bundleSize: {
          totalSize: 100000,
          gzippedSize: 30000,
          fileCount: 5,
          files: [
            { path: 'test.css', size: 100000, gzippedSize: 30000 }
          ],
        },
        cssParsingTime: 50,
        timestamp: Date.now(),
      };

      const report = generateMetricsReport(current);
      
      expect(report).toContain('CSS Metrics Report');
      expect(report).toContain('Bundle Size');
      expect(report).toContain('Performance');
      expect(report).toContain('97.66 KB'); // 100000 bytes
      expect(report).toContain('29.3 KB'); // 30000 bytes
    });

    it('should generate report with baseline comparison', () => {
      const baseline: BaselineMetrics = {
        bundleSize: {
          totalSize: 100000,
          gzippedSize: 30000,
          fileCount: 5,
          files: [],
        },
        cssParsingTime: 100,
        timestamp: Date.now(),
        version: '1.0.0',
        description: 'Baseline',
      };

      const current: PerformanceMetrics = {
        bundleSize: {
          totalSize: 65000,
          gzippedSize: 19500,
          fileCount: 5,
          files: [],
        },
        cssParsingTime: 70,
        timestamp: Date.now(),
      };

      const report = generateMetricsReport(current, baseline);
      
      expect(report).toContain('Comparison with Baseline');
      expect(report).toContain('35.00%'); // 35% reduction
      expect(report).toContain('Bundle Size Reduction');
      expect(report).toContain('Parsing Time Change');
    });

    it('should format file list', () => {
      const current: PerformanceMetrics = {
        bundleSize: {
          totalSize: 100000,
          gzippedSize: 30000,
          fileCount: 2,
          files: [
            { path: 'file1.css', size: 50000, gzippedSize: 15000 },
            { path: 'file2.css', size: 50000, gzippedSize: 15000 },
          ],
        },
        timestamp: Date.now(),
      };

      const report = generateMetricsReport(current);
      
      expect(report).toContain('Files');
      expect(report).toContain('file1.css');
      expect(report).toContain('file2.css');
    });
  });
});
