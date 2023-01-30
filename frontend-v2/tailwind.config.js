module.exports = {
    content: [
        "./index.html",
        "./**/*.vue",
        "node_modules/tailvue/dist/tailvue.es.js",
        "./node_modules/@formkit/themes/dist/tailwindcss/genesis/index.cjs"
    ],
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: ['Barlow', 'sans-serif'],
            serif: ['Barlow', 'serif'],
        },
        extend: {},
    },
    plugins: [],
}