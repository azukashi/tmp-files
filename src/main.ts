import { createApp } from 'vue';
import VueCookies from 'vue-cookies';
import './style.css';
import App from './App.vue';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

createApp(App).use(VueCookies, { expires: '1h' }).mount('#app');
