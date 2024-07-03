import { createRouter, createWebHistory } from "vue-router";
 
let routes= [
    {
        //首页
        path: '/',
        name: 'index',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/index.vue')
    },
    {
        //个人信息
        path: '/personal_Information',
        name: 'personal_Information',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/personal_Information.vue')
    },
    {
        //医生助理查看的页面
        path: '/assistant',
        name: 'assistant',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/assistant.vue')
    },
    {
        //管理员查看的页面
        path: '/admin',
        name: 'admin',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/admin.vue')
    },
    {
        //名医堂
        path: '/famous_doctor_hall',
        name: 'famous_doctor_hall',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/famous_doctor_hall.vue')
    },
    {
        //所有公告
        path: '/announcement_home',
        name: 'announcement_home',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/announcement_home.vue')
    },
    {
        //医生详细页面
        path: '/doctor_detail',
        name: 'doctor_detail',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/doctor_detail.vue')
    },
    {
        //当前用户id的就诊卡
        path: '/patient_card_management',
        name: 'patient_card_management',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/personal_Information/patient_card_management.vue')
    },
    {
        //用户id添加就诊卡
        path: '/add_patient_card',
        name: 'add_patient_card',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/personal_Information/add_patient_card.vue')
    },
    {
        //用户id的预约信息
        path: '/reservation',
        name: 'reservation',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/personal_Information/reservation.vue')
    },
    {
        //用户id的关注医生列表
        path: '/my_attention',
        name: 'my_attention',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/personal_Information/my_attention.vue')
    },
    {
        //用户的等待评价的订单
        path: '/waiting_evaluation',
        name: 'waiting_evaluation',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/personal_Information/waiting_evaluation.vue')
    },
    {
        //用户id的挂号页面
        path: '/user_register',
        name: 'user_register',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/user_register.vue')
    },
    
    {
        //错误页面
        path: '/undefined',
        name: 'undefined',
        //使用import可以路由懒加载，如果不使用，太多组件一起加载会造成白屏
        component: () => import('../view/undefined.vue')
    },
]
// 路由
const router = createRouter({
    history: createWebHistory(),
    routes
})
// 导出
export default router 