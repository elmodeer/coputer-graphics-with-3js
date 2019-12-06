module.exports = {
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 8
  },
  "rules": {
    // "no-magic-numbers": "warn",
    "semi": ["warn", "always"],
    "no-constant-condition": ["error", { "checkLoops": false }],
    "no-console": "error",
    "no-var": "error",
    "guard-for-in": "error",
    "prefer-const": "warn"
  },
  "env": {
    "browser": true,
    "qunit": true,
    "es6": true
  },
  "globals": {
    "THREE": false
  }
};
