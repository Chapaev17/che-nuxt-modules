import type { Config } from "prettier"

const config: Config = {
  bracketSameLine: false,
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
  printWidth: 79,
  semi: false,
  singleAttributePerLine: false,
  tabWidth: 2,
}

export default config
