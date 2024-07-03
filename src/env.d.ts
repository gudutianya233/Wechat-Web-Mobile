//vue3加ts出现 --找不到模块“@/views/HomeView.vue”或其相应的类型声明。加上下面2组代码任意一个
// declare module '*.vue' {
//    import type { DefineComponent } from 'vue'
//    const component: DefineComponent<{}, {}, any>
//    export default component
// }
// TypeScript就可以识别.vue文件和@splidejs/vue-splide模块
declare module '*.vue' {
   import type { DefineComponent } from 'vue'
   const component: ComponentOptions | ComponentOptions['setup']
   export default component
}

declare module '@splidejs/vue-splide' {
   import { Splide, SplideSlide } from '@splidejs/vue-splide';
   export { Splide, SplideSlide };

 }

 declare module 'weixin-js-sdk'
 declare module 'weixin-jsapi'