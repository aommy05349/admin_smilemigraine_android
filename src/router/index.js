import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/vuex'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'hash',
    base: '/',
    routes: [
        {
            path: '/',
            name: 'HomeLayout',
            component: () => import('@/layouts/HomeLayout.vue'),
            children: [
                {
                    path: 'chats',
                    name: 'chats',
                    component: () => import('@/pages/Chats/index.vue'),
                },
                {
                    path: '/chats/:roomId',
                    name: 'chatId',
                    component: () => import('@/pages/Chats/_id.vue'),
                },
                {
                    path: '/members',
                    name: 'members',
                    component: () => import('@/pages/Members/index.vue'),
                },
                {
                    path: '/members/:memberId',
                    name: 'member',
                    component: () => import('@/pages/Members/_id.vue'),
                },
                {
                    path: '/admins',
                    name: 'admins',
                    component: () => import('@/pages/Admins/index.vue'),
                },
                {
                    path: '/admins/:adminId',
                    name: 'admin',
                    component: () => import('@/pages/Admins/_id.vue'),
                },
                // Community 
                {
                    path: '/communities',
                    name: 'communities',
                    component: () => import('@/pages/Communities/index.vue'),
                },
                {
                    path: '/postcommunitys',
                    name: 'postcommunitys',
                    component: () => import('@/pages/Communities/postcommunitys.vue'),
                },
                {
                    path: '/detailcommunity/:postID',
                    name: 'detailcommunity',
                    component: () => import('@/pages/Communities/detailcommunity.vue'),
                },
                // medicines
                {
                    path: '/medicines',
                    name: 'medicines',
                    component: () => import('@/pages/Medicines/index.vue'),
                },
                {
                    path: '/medicines/:medicineID',
                    name: 'medicines',
                    component: () => import('@/pages/Medicines/detailmedicine.vue'),
                },
                // medicines
                {
                    path: '/dailynews',
                    name: 'dailynews',
                    component: () => import('@/pages/Dailynews/index.vue'),
                },
                {
                    path: '/dailynews/:dailynewID',
                    name: 'dailynew',
                    component: () => import('@/pages/Dailynews/detaildailynews.vue'),
                },
                
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/pages/Login/index.vue'),
            meta: {
                authNotRequired: true
            }
        },
        { path: '*', redirect: '/members' }
    ]
})

router.beforeEach((to, from, next) => {
    if (!(to.meta && to.meta.authNotRequired) && !store.state.user.token) {
      return next(`/login?redirectUrl=${to.path}`)
    }
    next()
  })

export default router