// @ts-check
import {
  luxass,
} from "@luxass/eslint-config";

import pluginTailwindCSS from "eslint-plugin-tailwindcss";

export default luxass({
  nextjs: true,
  formatters: true,
}, {
  plugins: {
    tailwindcss: pluginTailwindCSS,
  },
  rules: {
    "tailwindcss/classnames-order": ["error"],
    "tailwindcss/enforces-negative-arbitrary-values": ["warn"],
    "tailwindcss/enforces-shorthand": ["warn"],
    "tailwindcss/migration-from-tailwind-2": ["warn"],
    "tailwindcss/no-arbitrary-value": ["off"],
    "tailwindcss/no-contradicting-classname": ["error"],
    "tailwindcss/no-custom-classname": ["warn"],
  },
  settings: {
    tailwindcss: {
      classRegex: "^(class(Name)?|tw)$",
    },
  },
});
