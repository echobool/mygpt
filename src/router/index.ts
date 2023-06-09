import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { name: "home", path: "/", component: () => import("../views/HomePage.vue") },
        { name: "userHome", path: "/user", component: () => import("../views/UserHome.vue") },
        {
            name: "agentHome", path: "/agent/:id",
            component: () => import("../views/agent/Home.vue"),
            children: [
                {
                    name: "revenue", path: "/agent/home", component:  () => import("../views/agent/totalRevenue.vue"),
                },
                {
                    name: "setting", path: "/agent/setting", component:  () => import("../views/agent/Setting.vue"),
                },
                {
                    name: "extract", path: "/agent/extract", component:  () => import("../views/agent/ExtractSetting.vue"),
                },
            ]
        },

    ]
})

export default router