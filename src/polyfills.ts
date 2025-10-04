// Browser polyfills for Node.js modules
import { Buffer } from 'buffer';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.Buffer = Buffer;
  // @ts-ignore
  window.global = window.global || window;
  // @ts-ignore
  window.process = window.process || {
    env: {},
    nextTick: (fn: () => void) => setTimeout(fn, 0),
    version: '16.0.0',
    platform: 'browser'
  };
}

export {};