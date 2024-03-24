import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/restaurant/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
    plugins: [
        plugin(function ({addUtilities}) {
            const newUtilities = {
                '.scrollbar-thin': {
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgb(31 41 55)'
                },
                '.scrollbar-hidden': {
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                    '&::-webkit-scrollbar': {
                        'display': 'none'
                    },
                },
                '.scrollbar-webkit': {
                    '&::-webkit-scrollbar':{
                        width: '8px'
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'white'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgb(31 41 55)',
                        borderRadius: '20px',
                        border: '1px solid white'
                    }
                },
            };
            addUtilities(newUtilities);
        },),
    ],
};
export default config;
