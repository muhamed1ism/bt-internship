import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  // Set NODE_ENV based on the mode
  process.env.NODE_ENV = mode === 'test' ? 'test' : 'development';

  return defineConfig({
    plugins: [react(), tsconfigPaths(), tailwindcss(),],
    server: {
      host: process.env.VITE_HOST,
      port: parseInt(process.env.VITE_PORT || ''),
      open: process.env.VITE_OPEN_BROWSER === `true`,
    },
    test: {
      ...configDefaults,
      globals: true,
      root: __dirname,
      testTimeout: 10000,
      env: loadEnv('', process.cwd(), ''),
      setupFiles: ['./vitest.setup.ts'],
      environment: 'jsdom',
      reporters: ['default', 'json', 'junit'],
      outputFile: {
        json: './reports/unit-test-results.json',
        junit: './reports/unit-test-results.xml',
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary'],
        enabled: false,
        exclude: [
          '**/*.ts',
          '**/*.js',
          '**/*.jsx',
          'node_modules/**',
          'coverage/**',
          'dist/**',
          '**/[.]**',
          'packages/*/test?(s)/**',
          '**/*.d.ts',
          '**/virtual:*',
          '**/__x00__*',
          '**/\x00*',
          'cypress/**',
          'test?(s)/**',
          'test?(-*).?(c|m)[jt]s?(x)',
          '**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)',
          '**/__tests__/**',
          '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
          '**/vitest.{workspace,projects}.[jt]s?(on)',
          '**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}',
        ],
        include: ['app/components', 'app/pages'],
      },
    },
  });
};
