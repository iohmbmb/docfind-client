import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Ignore late background framework cleanups so it doesn't crash the pipeline
    onUnhandledError(error, type) {
      if (error.message?.includes('NG0205') || error.message?.includes('Injector has already been destroyed')) {
        return;
      }
      console.error(`Unhandled ${type}:`, error);
    },
  },
});
