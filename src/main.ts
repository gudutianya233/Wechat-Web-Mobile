import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
 //routes
 import router from "./routes/index"; 
/* 引入 ElementPlus */
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import "@splidejs/splide/dist/css/splide.min.css";
  // 创建 Vue 应用
  const app = createApp(App);
  // 使用路由
  app.use(router);
  // 使用 ElementPlus
  app.use(ElementPlus);
  app.component('Splide', Splide)
  app.component('SplideSlide', SplideSlide)
  // 挂载 Vue 应用
  app.mount('#app');

