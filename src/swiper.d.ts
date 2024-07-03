// 为swiper模块添加一个类型声明文件，以避免类型错误

declare module "swiper/vue" {
    import { DefineComponent } from "vue";
    export const Swiper: DefineComponent<any, any, any>;
    export const SwiperSlide: DefineComponent<any, any, any>;
  }
  