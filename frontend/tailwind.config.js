

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
    extend: {
        colors: {
        // Nuestra paleta personalizada "Refugio Zen" 🌿
        sage: {
          50: '#f6f7f6',  // Fondo muy claro
            100: '#e3e8e3',
          500: '#84a98c', // Verde Salvia Principal
          600: '#52796f', // Verde Oscuro (Hover)
        },
        cream: '#fdfbf7', // Color Hueso/Crema para el fondo general
        },
    },
    },
    plugins: [],
}