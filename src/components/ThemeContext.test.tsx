/**
 * Property-Based Tests for Theme Persistence Across Routes
 * 
 * This file contains property-based tests to verify that theme settings
 * persist correctly when navigating between different routes in the application.
 * 
 * Requirements: 4.5
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import * as fc from 'fast-check';

// Simple test component that displays theme information
function ThemeTestComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button data-testid="theme-toggle" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}

// Test wrapper that provides theme context
function TestWrapper({ initialTheme, children }: { initialTheme?: string; children: React.ReactNode }) {
  // Set localStorage before rendering if initialTheme is provided
  if (initialTheme) {
    localStorage.setItem('theme', initialTheme);
  }
  
  return (
    <MemoryRouter>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe('Theme Persistence Property-Based Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    (localStorage as any).clear();
    // Reset document theme
    document.documentElement.removeAttribute('data-theme');
    // Cleanup any existing renders
    cleanup();
  });

  afterEach(() => {
    // Clean up after each test
    (localStorage as any).clear();
    document.documentElement.removeAttribute('data-theme');
    cleanup();
  });

  /**
   * Feature: blog-routing, Property 5: Theme Persistence Across Routes
   * Validates: Requirements 4.5
   * 
   * For any theme setting (light or dark), the theme should be correctly
   * initialized from localStorage and persist in the document.
   */
  it('should maintain theme consistency from localStorage initialization', () => {
    fc.assert(
      fc.property(
        // Generate random theme setting (light or dark)
        fc.constantFrom('light', 'dark'),
        (initialTheme) => {
          // Clean up before each property test iteration
          cleanup();
          (localStorage as any).clear();
          document.documentElement.removeAttribute('data-theme');
          
          // Render component with initial theme
          render(
            <TestWrapper initialTheme={initialTheme}>
              <ThemeTestComponent />
            </TestWrapper>
          );
          
          // Verify theme is loaded from localStorage
          expect(screen.getByTestId('current-theme')).toHaveTextContent(initialTheme);
          
          // Verify document theme attribute is set correctly
          expect(document.documentElement.getAttribute('data-theme')).toBe(initialTheme);
          
          // Verify localStorage contains the correct theme
          expect(localStorage.getItem('theme')).toBe(initialTheme);
          
          // Clean up after this iteration
          cleanup();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property test: Theme toggle persistence
   * Tests that theme changes are properly saved to localStorage and document
   */
  it('should persist theme changes to localStorage and document', async () => {
    fc.assert(
      await fc.asyncProperty(
        // Generate random initial theme
        fc.constantFrom('light', 'dark'),
        async (initialTheme) => {
          // Clean up before each property test iteration
          cleanup();
          (localStorage as any).clear();
          document.documentElement.removeAttribute('data-theme');
          
          // Set up user event
          const user = userEvent.setup();
          
          // Render component with initial theme
          render(
            <TestWrapper initialTheme={initialTheme}>
              <ThemeTestComponent />
            </TestWrapper>
          );
          
          // Verify initial state
          expect(screen.getByTestId('current-theme')).toHaveTextContent(initialTheme);
          expect(document.documentElement.getAttribute('data-theme')).toBe(initialTheme);
          
          // Toggle theme using user event
          const expectedTheme = initialTheme === 'light' ? 'dark' : 'light';
          await user.click(screen.getByTestId('theme-toggle'));
          
          // Verify theme was toggled in all places
          expect(screen.getByTestId('current-theme')).toHaveTextContent(expectedTheme);
          expect(document.documentElement.getAttribute('data-theme')).toBe(expectedTheme);
          expect(localStorage.getItem('theme')).toBe(expectedTheme);
          
          // Clean up after this iteration
          cleanup();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property test: Theme initialization without localStorage
   * Tests that theme defaults to 'light' when no localStorage value exists
   */
  it('should default to light theme when localStorage is empty', () => {
    fc.assert(
      fc.property(
        // Generate random number of times to render (to test consistency)
        fc.integer({ min: 1, max: 5 }),
        (renderCount) => {
          for (let i = 0; i < renderCount; i++) {
            // Clean up before each iteration
            cleanup();
            (localStorage as any).clear();
            document.documentElement.removeAttribute('data-theme');
            
            // Render component without setting localStorage
            render(
              <TestWrapper>
                <ThemeTestComponent />
              </TestWrapper>
            );
            
            // Verify default theme is 'light'
            expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
            expect(document.documentElement.getAttribute('data-theme')).toBe('light');
            expect(localStorage.getItem('theme')).toBe('light');
            
            // Clean up after this iteration
            cleanup();
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property test: Multiple theme provider instances
   * Tests that multiple instances of ThemeProvider don't interfere with each other
   */
  it('should handle multiple theme provider instances consistently', () => {
    fc.assert(
      fc.property(
        // Generate random theme
        fc.constantFrom('light', 'dark'),
        (theme) => {
          // Clean up before each property test iteration
          cleanup();
          (localStorage as any).clear();
          document.documentElement.removeAttribute('data-theme');
          
          // Set initial theme
          localStorage.setItem('theme', theme);
          
          // Render first instance
          const { unmount: unmount1 } = render(
            <TestWrapper>
              <ThemeTestComponent />
            </TestWrapper>
          );
          
          // Verify first instance
          expect(screen.getByTestId('current-theme')).toHaveTextContent(theme);
          expect(document.documentElement.getAttribute('data-theme')).toBe(theme);
          
          // Unmount first instance
          unmount1();
          
          // Render second instance
          const { unmount: unmount2 } = render(
            <TestWrapper>
              <ThemeTestComponent />
            </TestWrapper>
          );
          
          // Verify second instance has same theme
          expect(screen.getByTestId('current-theme')).toHaveTextContent(theme);
          expect(document.documentElement.getAttribute('data-theme')).toBe(theme);
          
          // Clean up
          unmount2();
          cleanup();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property test: Theme persistence across re-renders
   * Tests that theme persists when component re-renders
   */
  it('should maintain theme consistency across component re-renders', () => {
    fc.assert(
      fc.property(
        // Generate random theme and number of re-renders
        fc.constantFrom('light', 'dark'),
        fc.integer({ min: 1, max: 3 }),
        (initialTheme, reRenderCount) => {
          // Clean up before each property test iteration
          cleanup();
          (localStorage as any).clear();
          document.documentElement.removeAttribute('data-theme');
          
          // Render initial component
          const { rerender } = render(
            <TestWrapper initialTheme={initialTheme}>
              <ThemeTestComponent />
            </TestWrapper>
          );
          
          // Verify initial theme
          expect(screen.getByTestId('current-theme')).toHaveTextContent(initialTheme);
          expect(document.documentElement.getAttribute('data-theme')).toBe(initialTheme);
          
          // Perform multiple re-renders
          for (let i = 0; i < reRenderCount; i++) {
            rerender(
              <TestWrapper>
                <ThemeTestComponent />
              </TestWrapper>
            );
            
            // Verify theme persists after re-render
            expect(screen.getByTestId('current-theme')).toHaveTextContent(initialTheme);
            expect(document.documentElement.getAttribute('data-theme')).toBe(initialTheme);
            expect(localStorage.getItem('theme')).toBe(initialTheme);
          }
          
          // Clean up after this iteration
          cleanup();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});