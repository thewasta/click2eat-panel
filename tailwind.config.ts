import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    //https://colors.muz.li/palette/41584f/2d3e37/414e58/455841/313e2d
    extend: {
      colors: {
        background: '#fff',
        primary: '#5d7e62',
        secondary: '#415849',
        foreground: '#495841',
        neutral: '#697e5d',
        colorText: '#5d757e',
        secondaryColorText: '#4B5563',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('daisyui')
  ],
};
export default config;
