import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';


export default defineConfig({
<<<<<<< HEAD

  server: {
    proxy: {
      '/api': {
        target:'http://localhost:3000',
=======
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
>>>>>>> 92d1cbbc918ddd094e021e09daf73b74daa33672
        secure: false,
      },
    },
  },

<<<<<<< HEAD
  plugins: [
    tailwindcss(),
    react()
  ],
})
=======
  plugins: [react()],
});
>>>>>>> 92d1cbbc918ddd094e021e09daf73b74daa33672
