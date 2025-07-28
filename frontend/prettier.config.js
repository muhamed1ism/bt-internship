/** @type {import("prettier").Config} */

export default {
  singleQuote: true,
  overrides: [
    {
      files: ['*.css'],
      options: {
        singleQuote: false,
      },
    },
  ],
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindConfig: './tailwind.config.js',
  printWidth: 100,
};

