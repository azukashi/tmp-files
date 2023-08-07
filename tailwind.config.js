/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                lexend: ['Lexend', 'sans-serif'],
                vt_323: ['VT323', 'sans-serif'],
                fira_code: ['Fira Code', 'monospace'],
            },
        },
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['black'],
    },
};
