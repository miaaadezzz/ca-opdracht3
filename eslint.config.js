export default {
  parserOptions: {
    ecmaVersion: 2020, // Or a higher version depending on your project needs
    sourceType: 'module', // Enables ES Modules (import/export) support
  },
  env: {
    browser: true, // Or node: true if you're targeting Node.js
  },
  extends: ['eslint:recommended'], // You can add more extensions if needed
};