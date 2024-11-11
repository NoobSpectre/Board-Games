import type { Config } from "tailwindcss";

const getColorVariants = (variableName: string, separator = 5) =>
  Array.from({ length: 100 / separator + 1 })
    .map((_, idx) => idx * separator)
    .reduce(
      (pv, val) => ({
        ...pv,
        [val]: `color-mix(in oklch, var(${variableName}) ${val}%, transparent)`,
      }),
      {}
    );

export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        heading: "var(--font-heading)",
        body: "var(--font-body)",
      },
      colors: {
        primary: {
          DEFAULT: "var(--clr-primary)",
          ...getColorVariants("--clr-primary"),
        },
        secondary: {
          DEFAULT: "var(--clr-secondary)",
          ...getColorVariants("--clr-secondary"),
        },
        accent: {
          DEFAULT: "var(--clr-accent)",
          ...getColorVariants("--clr-accent"),
        },
        background: {
          DEFAULT: "var(--clr-background)",
          ...getColorVariants("--clr-background"),
        },
        text: {
          DEFAULT: "var(--clr-text)",
          ...getColorVariants("--clr-text"),
        },
      },
      borderRadius: {
        sm: "calc(var(--radius) - 0.2rem)",
        md: "calc(var(--radius) - 0.1rem)",
        DEFAULT: "var(--radius)",
        lg: "calc(var(--radius) + 0.1rem)",
        xl: "calc(var(--radius) + 0.2rem)",
      },
    },
  },
  plugins: [require("@tailwindcss/container-queries")],
} satisfies Config;
