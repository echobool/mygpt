<template >
    <el-aside width="291px" class="aside hidden-xs-only" :class="{ 'aside-show': showAside }">

        <div class="el-scrollbar">

            <el-menu v-infinite-scroll="loadChatList" :infinite-scroll-disabled="disabled" infinite-scroll-distance="50"
                style="overflow: auto;" :default-openeds="['1', '3']" @select="chatShow" class="menu-scroll">

                <el-menu-item-group v-for="(item, index) in chatList" :key="index" v-show="item.length > 0"
                    :title="getMenuTitle(index)">
                    <el-menu-item v-for="(menu, index1) in item" :key="index1" :index-path="menu.config.model_name"
                        :index="menu._id">
                        <span class="title">{{ menu.title }}</span>


                        <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled"
                            icon-color="#626AEF" title="确定要删除吗?" @confirm="chatDelete(menu._id)">
                            <template #reference>
                                <el-icon @click.stop="void">
                                    <Delete />
                                </el-icon>
                            </template>
                        </el-popconfirm>


                    </el-menu-item>
                </el-menu-item-group>
                <p class="loading" v-if="loading">Loading...</p>
                <p class="no-more" v-if="noMore">No more</p>
            </el-menu>

        </div>

    </el-aside>

    <el-container @click="showAside = false" class="right-container">
        <el-main id="chatMain">

            <el-row :gutter="10" justify="center" style="margin: 0;" v-if="showApp">
                <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="16">
                    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                        <el-tab-pane name="all">
                            <template #label>
                                <span class="custom-tabs-label">
                                    <img class="logo" width="20" style="margin-right: 10px;margin-bottom: -5px;"
                                        src="/img/aiapp.svg" />
                                    <span>全部应用</span>
                                </span>
                            </template>

                            <!-- 展示应用 -->
                            <div v-for="(cate, index) in cates" :key="index" class="app-item">
                                <h4>{{ cate.cate_name }}</h4>
                                <el-row>
                                    <el-col style="text-align: center;" v-for="(app, k) in cate.app" :key="k" :xs="8"
                                        :sm="8" :md="6" :lg="3" :xl="2">
                                        <div style="display: inline-block; width: 80px; cursor: pointer;"
                                            @click="goToApp(app.id)">
                                            <el-image style="width: 80px; height: 80px" :src="staticUrl + app.logo_path"
                                                fit="cover" />
                                            <span class="app-name">{{ app.name }}</span>
                                        </div>

                                    </el-col>
                                </el-row>
                            </div>

                        </el-tab-pane>
                        <el-tab-pane name="collect">
                            <template #label>
                                <span class="custom-tabs-label">
                                    <img class="logo" width="27" style="margin-right: 10px;margin-bottom: -5px;"
                                        src="/img/aicollect2.svg" />
                                    <span>我的收藏</span>
                                </span>
                            </template>我的应用</el-tab-pane>

                    </el-tabs>
                </el-col>

            </el-row>



            <el-row :gutter="10" justify="center" style="margin: 0;" v-if="!showApp">
                <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="16">
                    <div style="display: block; text-align: center;">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" width="80" style="border-radius: 15px;" />
                        <p>{{ rulePreview.desc }}</p>
                    </div>


                    <el-form ref="form" label-width="auto" label-position="top"  style="padding:0 15px;">
                        <el-form-item v-for="(field, index) in rulePreview.fields" :key="index" :label="field.label">

                            <el-input v-if="field.type == 'text'" type="text" v-model="field.demo_val" size="large"
                                :placeholder="field.placeholder" />
                            <el-input v-if="field.type == 'textarea'" type="textarea" v-model="field.demo_val" rows="4" size="large"
                                :placeholder="field.placeholder" />
                            <el-select v-if="field.type == 'select'" v-model="field.demo_val" class="m-2"
                                :placeholder="field.placeholder">
                                <el-option v-for="(option, i) in field.options" :key="i" :label="option" :value="option" />
                            </el-select>
                            <el-checkbox-group v-if="field.type == 'checkbox'" v-model.array="field.demo_val">
                                <el-checkbox v-for="(option, i) in field.options" :key="i" :label="option" border />
                            </el-checkbox-group>
                            <el-radio-group v-if="field.type == 'radio'" v-model="field.demo_val">
                                <el-radio v-for="(option, i) in field.options" :key="i" :label="option" border />
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item class="app-button">
                            <el-button style="width: 500px;" type="primary" @click="onSubmit" size="large">生成</el-button>
                        </el-form-item>
                    </el-form>

                </el-col>



            </el-row>




        </el-main>



    </el-container>
</template>


<script lang="ts" setup>
import { InfoFilled } from '@element-plus/icons-vue'
import { useGlobalStore } from '../store'


import { reactive, ref, onMounted, computed } from 'vue';

import { getList, delChat, getChatLog, getAllApp, getAppInfo } from '../http/api'
import { TabsPaneContext } from 'element-plus';
import router from '../router';
import { useRoute } from 'vue-router';

const Global = useGlobalStore()

const chatList: { today: any[], oneWeekAgo: any[], oneMonthAgo: any[], oneYearAgo: any[] } = reactive({
    today: [],
    oneWeekAgo: [],
    oneMonthAgo: [],
    oneYearAgo: []
})


const showAside = ref(false)
const showApp = ref(true)
const page = ref(1)
const chatCount = ref(0)
const chatLoadCount = ref(0)
const loading = ref(false)
const noMore = computed(() => chatLoadCount.value >= chatCount.value)
const disabled = computed(() => loading.value || noMore.value)

const activeName = ref('all')
const cates: any = reactive([])

const imageUrl = ref('')
const baseURL = import.meta.env.APP_BASE_URL;
const staticUrl = baseURL.replace('v1', '')

const props = defineProps<{
    openLoginFrom: Function
}>();
const route = useRoute();


const rulePreview = reactive({
    id: '',
    desc: '',
    fields: [] as any,
    examples: [] as any,
})






const setShowApp = () => {
    showApp.value = true
    // 加载应用列表
    requestAllApp()
}

//在setup里边的数据是私有的, 需要通过defineExpose暴露给父组件, 父组件才可以使用
defineExpose({
    setShowApp
})

onMounted(() => {
    let id: string = route.params.id as string

    if (id) {
        showApp.value = false
        requestAppInfo(id)
    } else {
        // 加载应用列表
        requestAllApp()
    }

});


// 加载聊天列表
const loadChatList = async () => {
    if (Global.token == "") {
        return
    }
    loading.value = true
    await getList({
        "page_size": 20,
        "page": page.value,
    }).then(res => {
        loading.value = false
        // console.log(res)
        if (res.data) {
            if (page.value == 1) {

            }

            page.value++
        }
        chatCount.value = res.ext.count
        //  console.log(chatList)

    }).catch(error => {
        console.error(error);
    });
}

// 点击展示聊天日志
const chatShow = async (id: string) => {

    await getChatLog({
        "chat_id": id,
    }).then(res => {
        if (res.data) {
            let data = res.data


        }
        // 将聊天日志渲染至页面

        console.log(res)
    }).catch(err => {
        console.log(err)
    })

}


const getMenuTitle = (index: string) => {
    if (index == "today") {
        return "最近"
    } else if (index == "oneWeekAgo") {
        return "7天前"
    }
    else if (index == "oneMonthAgo") {
        return "1月前"
    }
    else if (index == "oneYearAgo") {
        return "1年前"
    }
}


// 删除聊天记录
const chatDelete = async (d: string) => {
    await delChat({
        "id": d,
    }).then(res => {

        // removeById(chatList, d)
        console.log(res, chatList)

    }).catch(error => {
        console.error(error);
    });
    console.log(d);
}


// 
const handleClick = (tab: TabsPaneContext, _event: Event) => {

    if (tab.paneName == "all") {
        requestAllApp()
    }

}



// 默认获取所有应用
const requestAllApp = async () => {
    await getAllApp({}).then(res => {
        console.log(res);
        if (res.ext.cates) {
            // 清空
            cates.splice(0, cates.length)
            for (let index = 0; index < res.ext.cates.length; index++) {
                const item = res.ext.cates[index];

                if (!res.data) return

                let apps: any = []
                res.data.forEach((app: any) => {
                    if (app.cate_id == item.id) {
                        apps.push(app)
                    }
                });

                if (apps.length == 0) continue
                // 按 sort 排序
                apps.sort(function (a: any, b: any) {
                    return a.sort - b.sort;
                });

                cates.push({
                    cate_id: item.id,
                    cate_name: item.name,
                    sort: item.sort,
                    app: apps
                })
            }

        }
        console.log(cates);


    }).catch(err => {
        console.log(err);

    })
}


const goToApp = (id: string) => {

    if (Global.token == "") {
        //弹出登录界面
        props.openLoginFrom()
        return
    }

    // 这里使用的同一个页面 不会跳走
    router.replace({ name: 'app', params: { id: id } })
    showApp.value = false

    console.log(id);

    requestAppInfo(id)

}


const requestAppInfo = (id: string) => {
    getAppInfo({
        id: id
    }).then(res => {
        // console.log(res);
        if (res.data) {
            console.log(res.data.fields);
            rulePreview.fields = [] as any
            rulePreview.examples = [] as any

            rulePreview.id = id

            if (res.data.fields) {
                res.data.fields.forEach((item: any) => {
                    let _item = JSON.parse(item)
                    rulePreview.fields.push(_item)
                });
            }


            if (res.data.examples) {
                res.data.examples.forEach((item: any) => {
                    let _item = JSON.parse(item)
                    rulePreview.examples.push(_item)
                });
            }



            rulePreview.desc = res.data.desc
            imageUrl.value = res.data.logo_path ? staticUrl + res.data.logo_path + '?' + Math.random() : ""
        }
        console.log(rulePreview);


    }).catch(err => {
        console.log(err);
    })
}

</script>


<style lang="scss" scoped>
.aside .el-scrollbar {
    height: calc(100vh - 60px);
    border-right: 1px solid var(--el-border-aside-color);
}

.aside .no-more {

    color: var(--el-color-info-dark-2);
    font-size: 12px;
    text-align: center;
}

.aside .loading {

    color: var(--el-color-warning);
    font-size: 12px;
    text-align: center;
}

.aside .menu-scroll {
    border-right: 0;
    height: calc(100vh - 190px);
}




.el-main {
    height: calc(100vh - 60px);
    background-color: var(--el-bg-ai-color);
    padding: 30px 0 20px 0;
}



.el-main ::v-deep .el-tabs__nav-wrap::after {
    display: none;
}

.el-main ::v-deep .el-tabs__item {
    font-size: 16px !important;
    height: 50px;
    font-weight: normal;
    padding: 0 20px !important;
    margin: 0 5px;
}

.el-main ::v-deep .el-tabs__item.is-active {
    background-color: var(--el-msg-item-bot-color);
    border-radius: 15px;
}

.el-main ::v-deep .el-tabs__active-bar {
    background-color: var(--el-border-tab-pane-color);
    height: 0;
}


.el-main ::v-deep .el-tabs__content {
    padding: 40px 15px 20px;
}



.app-item {
    margin-top: 20px;
}

.app-item h4 {
    font-size: 14px;
    font-weight: normal;
}

.app-item ul {
    margin: 0;
    padding: 0;
}

.app-item ul li {
    list-style: none;
    display: inline-block;
    text-align: center;
    padding: 15px;
    margin-right: 15px;


}


.app-item .el-image {
    display: block;
    background-color: var(--el-apps-bg-color);
    border-radius: 15px;

}

.app-item .app-name {
    height: 40px;
    line-height: 40px;
    display: block;
    font-size: 14px;
    color: var(--el-text-color-regular);
}


.app-button {
    margin-top: 40px;
}
.app-button ::v-deep  .el-form-item__content{
    justify-content: center !important;
}
</style>