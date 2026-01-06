import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock localStorage for tests
beforeAll(() => {
  const localStorageMock = {
    getItem: (key: string) => {
      return localStorageMock.store[key] || null;
    },
    setItem: (key: string, value: string) => {
      localStorageMock.store[key] = value;
    },
    removeItem: (key: string) => {
      delete localStorageMock.store[key];
    },
    clear: () => {
      localStorageMock.store = {};
    },
    store: {} as Record<string, string>
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});