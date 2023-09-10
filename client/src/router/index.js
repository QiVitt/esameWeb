import {createRouter, createWebHashHistory} from 'vue-router'
import {whoAmI} from "@/plugins/api";
import {useAppStore} from "@/store/app";
const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    beforeEnter: async (to,from,next)=>{
      let state = useAppStore();
      if (to.path==="/") return next("/home")
      if (state.logged===false){
        let user = await whoAmI();
        if (user!==false){
          state.user = user;
          state.logged=true;
        }
      }
      next();
    },
    children: [
      {
        path: 'login',
        beforeEnter: async (to,from, next)=>{
          let state = useAppStore();
          if (state.logged===true){
            return next("/home")
          }
          next()
        },
        children: [
          {
            path: 'signin',
            name: 'SignIn',
            component: () => import('@/views/Login.vue'),
          },
          {
            path: 'signup',
            name: 'SignUp',
            component: () => import('@/views/SignUp.vue'),
          },
        ],
      },
      {
        beforeEnter: async (to,from, next)=>{
          let state = useAppStore();
          if (state.logged===false){
            return next("/login/signin")
          }
          next()
        },
        path: 'home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),

      },
      {
        path: 'search',
        name: 'Search',
        component: () => import('@/views/Search.vue'),
      },
      {
        path: 'user/:id',
        name: 'User',
        component: () => import('@/views/User.vue'),
      },
      {
        path: 'message/:user/:id',
        name: 'Message',
        component: () => import('@/views/MessageStatic.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})
export default router
