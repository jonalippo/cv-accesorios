/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'crema-fondo': '#FDFAF7',
				'rosa-principal': '#F2A7A0',
				'rosa-claro': '#FAD4D0',
				'verde-hoja': '#6B8F5E',
				'texto-p': '#3D3D3D',
				'texto-s': '#888888',
				'borde-suave': '#E8DDD8',
			},
			fontFamily: {
				'playfair': ['"Playfair Display"', 'serif'],
				'nunito': ['"Nunito"', 'sans-serif'],
			},
		},
	},
	plugins: [],
}