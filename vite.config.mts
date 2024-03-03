import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        includeSource: ['src/**/*.test.ts'],
        setupFiles: ['./vitest.setup.ts'],
        mockReset: true,
    },
    define: {
        'import.meta.vitest': false,
    },
});
