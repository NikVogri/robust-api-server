import { defineConfig } from 'vite';

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
