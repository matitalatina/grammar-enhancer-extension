/// <reference types="chrome" />

interface ChromeStorageResult {
  [key: string]: any;
}

// Fix for "Cannot use namespace 'chrome' as a value"
declare global {
  const chrome: typeof import('chrome');
}

declare namespace chrome.storage {
  interface StorageArea {
    get(keys: string | string[] | null, callback: (items: ChromeStorageResult) => void): void;
    set(items: object, callback?: () => void): void;
  }
} 