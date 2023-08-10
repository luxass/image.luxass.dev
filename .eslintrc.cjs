module.exports = {
  // extends: ["next/core-web-vitals", "@luxass/eslint-config-react"],
  extends: ["@luxass/eslint-config-react"],
  rules: {
    "react/no-unknown-property": ["error", { ignore: ["tw"] }]
  }
};
