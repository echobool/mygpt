import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { name: "home", path: "/", component: () => import("../views/HomePage.vue") },
        { name: "login", path: "/login", component: () => import("../views/Login.vue"), props: route => ({ query: route.query.openid }) },
        { name: "userHome", path: "/user", component: () => import("../views/UserHome.vue") },
        {name: "ai", path: "/ai", component: () => import("../views/Aiapp.vue")},
        {name: "s", path: "/s/:id", component: () => import("../views/Invite.vue"), meta:{hidenfater: true} },
        {name: "app", path: "/ai/:id", component: () => import("../views/Aiapp.vue")},
        {
            name: "agentHome", path: "/agent",
            component: () => import("../views/agent/Home.vue"),
            children: [
                {
                    name: "revenue", path: "/agent/home", component: () => import("../views/agent/TotalRevenue.vue"),
                },
                {
                    name: "setting", path: "/agent/setting", component: () => import("../views/agent/Setting.vue"),
                },
                {
                    name: "extract", path: "/agent/extract", component: () => import("../views/agent/ExtractSetting.vue"),
                },

                {
                    name: "extlist", path: "/agent/extlist", component: () => import("../views/agent/ExtractList.vue"),
                },
            ]
        },

    ]
})

export default router