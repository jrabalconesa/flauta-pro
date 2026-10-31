import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:'/flauta-pro/',server:{allowedHosts:['terminal.local']},plugins:[{name:'pages-font-paths',enforce:'pre',transform(code,id){if(id.endsWith('/app/globals.css'))return code.replaceAll("url('/fonts/","url('../public/fonts/");}},react()]});
