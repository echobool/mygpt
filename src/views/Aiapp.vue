<template >
    <el-aside width="291px" class="aside hidden-xs-only" :class="{ 'aside-show': showAside }">

        <div class="el-scrollbar">

            <div style="display: block; height: 40px;padding: 15px;line-height: 40px; text-align: center;">
                历史应用
            </div>

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
                                        :sm="8" :md="6" :lg="3" :xl="3">
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
                            </template>
                        
                            <el-empty description="即将开放" />
                        </el-tab-pane>

                    </el-tabs>
                </el-col>

            </el-row>



            <el-row :gutter="10" justify="center" style="margin: 0;" v-if="!showApp">
                <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="16">
                    <div style="display: block; text-align: center;">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" width="80" style="border-radius: 15px;" />
                        <p>{{ rulePreview.desc }}</p>
                    </div>

                    <div class="examples" v-if="rulePreview.examples.length > 0">
                        <h4>不知道怎么写，参考一下右侧案例：
                            <span v-for="(example, index) in rulePreview.examples" :key="index"
                                @click="viewExample(index)">{{ example.title }}</span>

                        </h4>
                    </div>
                    <el-form ref="form" label-width="auto" label-position="top" style="padding:0 15px;">
                        <el-form-item v-for="(field, index) in rulePreview.fields" :key="index" :label="field.label">

                            <el-input v-if="field.type == 'text'" type="text" v-model="field.demo_val" size="large"
                                :placeholder="field.placeholder" />
                            <el-input v-if="field.type == 'textarea'" type="textarea" v-model="field.demo_val" rows="4"
                                size="large" :placeholder="field.placeholder" />
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
                            <el-button style="width: 600px;" type="primary" :disabled="chatOngoing" @click="onSubmit"
                                size="large">生成</el-button>
                        </el-form-item>
                    </el-form>

                </el-col>
            </el-row>

            <el-row class="chat-session-list" justify="center" v-for="item in messageData" :key="item.id" >
                <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="16" :class="{ 'home-msg-item-bot': item.who === 'bot' }">

                    <AiMessage :data="item" />

                </el-col>


            </el-row>

            <el-button v-show="chatOngoing" @click="abortChat" size="large" type="primary" plain class="abort-chat-btn">
                停止接收 </el-button>
        </el-main>



    </el-container>
</template>


<script lang="ts" setup>
import { StandardTime } from '../utils/DateTime'
import { InfoFilled } from '@element-plus/icons-vue'
import { useGlobalStore } from '../store'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import type { FormInstance } from 'element-plus'
import { reactive, ref, onMounted, computed } from 'vue';
import type { Msg } from '../class/Msg'
import AiMessage from '../components/AiMessage.vue';
import { getList, delChat, getChatLog, getAllApp, getAppInfo, createChat } from '../http/api'
import { TabsPaneContext, } from 'element-plus';
import router from '../router';
import { useRoute } from 'vue-router';

const Global = useGlobalStore()
const model = ref('gpt-3.5-turbo')
const chatList: { today: any[], oneWeekAgo: any[], oneMonthAgo: any[], oneYearAgo: any[] } = reactive({
    today: [],
    oneWeekAgo: [],
    oneMonthAgo: [],
    oneYearAgo: []
})


const showAside = ref(false)
const chatOngoing = ref(false)
const showApp = ref(true)
const page = ref(1)
const chatCount = ref(0)
const chatLoadCount = ref(0)
const loading = ref(false)
const noMore = computed(() => chatLoadCount.value >= chatCount.value)
const disabled = computed(() => loading.value || noMore.value)
const data = ref('');   // 接收到的临时消息
const activeName = ref('all')
const cates: any = reactive([])
const imageUrl = ref('')
const baseURL = import.meta.env.APP_BASE_URL;
const staticUrl = baseURL.replace('v1', '')
const message = ref('')     // 发送的对象
const messageData: Msg[] = reactive([])
const curModelName = ref('')

let chatId: string = ""

const props = defineProps<{
    openLoginFrom: Function
}>();
const route = useRoute();


const rulePreview = reactive({
    id: '',
    desc: '',
    dialog_mode: 0,
    fields: [] as any,
    examples: [] as any,
})

const setShowApp = () => {
    showApp.value = true
    // 加载应用列表
    requestAllApp()
}


function highlightBlock(str: string, lang: string, _code: string) {
    return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制代码</span></div><code class="hljs code-block-body language-${lang}">${str}</code></pre>`
}

const mdi = new MarkdownIt({
    html: true,
    linkify: true,
    highlight(code: string, language: string) {
        const validLang = !!(language && hljs.getLanguage(language))
        if (validLang) {
            const lang = language ?? ''
            return highlightBlock(hljs.highlight(code, { language: lang }).value, lang, code)
        }
        return highlightBlock(hljs.highlightAuto(code).value, '', code)
    }
})

mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
mdi.use(mdKatex, { blockClass: 'katex-block', errorColor: ' #cc0000', output: 'mathml' })

onMounted(() => {
    let id: string = route.params.id as string

    if (id) {
        showApp.value = false
        requestAppInfo(id)
    } else {
        // 加载应用列表
        requestAllApp()
    }
    loadChatList()
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
        "chat_type": "ai"
    }).then(res => {
        loading.value = false
        // console.log(res)
        if (res.data) {
            if (page.value == 1) {
                chatList.today.splice(0, chatList.today.length)
                chatList.oneWeekAgo.splice(0, chatList.oneWeekAgo.length)
                chatList.oneMonthAgo.splice(0, chatList.oneMonthAgo.length)
                chatList.oneYearAgo.splice(0, chatList.oneYearAgo.length)
            }
            handleChatList(res.data)
            page.value++
        }
        chatCount.value = res.ext.count
        //  console.log(chatList)

    }).catch(error => {
        console.error(error);
    });
}



//处理加载的会话按一天 7天 30 天 365天
const handleChatList = (data: any) => {
    const today = new Date().getTime();
    const oneWeekAgo = today - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = today - 30 * 24 * 60 * 60 * 1000;
    const oneYearAgo = today - 365 * 24 * 60 * 60 * 1000;

    data.forEach((item: any) => {
        chatLoadCount.value++
        const createdAt = new Date(item.created_at).getTime();
        // console.log(createdAt)
        // console.log(oneWeekAgo)
        // console.log(createdAt > oneWeekAgo)

        if (createdAt < oneYearAgo) {
            chatList.oneYearAgo.push(item)
        } else if (createdAt < oneMonthAgo) {
            chatList.oneMonthAgo.push(item)
        } else if (createdAt < oneWeekAgo) {
            chatList.oneWeekAgo.push(item)
        } else {
            chatList.today.push(item)
        }
    });
    //console.log(chatList)
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

        removeById(chatList, d)
        console.log(res, chatList)

    }).catch(error => {
        console.error(error);
    });
}

const removeById = (obj: any, id: string) => {
    for (let key in obj) {
        obj[key] = obj[key].filter((item: { _id: string; }) => item._id !== id);
    }
}



// 请求应用列表事件
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
    rulePreview.fields = [] as any
    rulePreview.examples = [] as any
    rulePreview.id = ''
    rulePreview.desc = ''
    rulePreview.dialog_mode = 0
    imageUrl.value = ''

    getAppInfo({
        id: id
    }).then(res => {
        // console.log(res);
        if (res.data) {
          //  console.log(res.data.fields);

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
            rulePreview.dialog_mode = res.data.dialog_mode
            imageUrl.value = res.data.logo_path ? staticUrl + res.data.logo_path + '?' + Math.random() : ""
        }
        console.log(rulePreview);

    }).catch(err => {
        console.log(err);
    })
}

const viewExample = (index: number) => {
    const example = rulePreview.examples[index];
    rulePreview.fields.forEach((field: any) => {
        const foundItem = example.item.find((v: any) => v.name === field.name);
        field.demo_val = foundItem?.value;
    });
};


const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    const arg: any = {}
    let title = ""      // 写入到聊天记录的标题

    rulePreview.fields.forEach((field: any) => {
        if (field.demo_val) {
            arg[field.name] = field.demo_val
            title += field.label + " " + field.demo_val + "\n"
        }
    });

    if (title == "") {
        ElMessage({
            message: '至少填写表单中的一项，填写参数越多生成越精准.',
            type: 'warning',
        })
        return
    }

    // 清空接收的暂存消息 防止下次叠加到消息中
    data.value = ""

    // 不是新会话的情况
    if (chatId !== "") {
        // 只有对话模式才写入用户记录
        if (rulePreview.dialog_mode == 3) {
            messageData.push({
                id: Math.round(1000000).toString(),
                chat_id: chatId,
                who: "user",
                content: message.value,
                chat_type: 'chat',
                created_time: StandardTime() // 给个当前时间
            })
        }
        loadData({
            "id": chatId,
            "app_id": rulePreview.id,
            "ai_arg": JSON.stringify(arg)
        })

        message.value = ""

        return
    }

    // 提交参数
    curModelName.value = modelName(model.value)
    await createChat({
        "model": model.value,
        "chat_type": 'ai',
        "content": title,
    }).then(res => {
        chatId = res.data?.chat_id

        // 只有对话模式才写入用户记录
        if (rulePreview.dialog_mode == 3) {
            messageData.push({
                id: chatId,
                chat_id: chatId,
                chat_type: 'ai',
                who: "user",
                content: message.value,
                created_time: StandardTime(res.data?.created_at)
            })
        }


        loadData({
            "id": chatId,
            "app_id": rulePreview.id,
            "ai_arg": JSON.stringify(arg)
        })


        // 重新载入历史聊天数据
        page.value = 1
        loading.value = true
        loadChatList()
    }).catch(error => {
        console.error(error);
    });

}

let controller = new AbortController()
const abortChat = () => {
    controller.abort()
    chatOngoing.value = false
}


const loadData = async (postData: any) => {
    try {

        let dataValue: string = ""
        //显示停止接收按钮
        chatOngoing.value = true
        controller = new AbortController()
        // 先插入聊天框
        messageData.push({
            id: Math.random.toString(),
            chat_id: Math.random.toString(),
            chat_type: 'ai',
            who: "bot",
            content: data.value,
            created_time: StandardTime() // 给个当前时间
        })

        // 移动滚动条
        mainScroll()

        const baseUrl = import.meta.env.APP_BASE_URL
        const response = await fetch(baseUrl + '/chat/ai', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': Global.getToken
            },
            body: JSON.stringify(postData),
            signal: controller.signal
        })

        const reader = (response as any).body.getReader()


        while (true) {
            const { done, value } = await reader.read()
            if (done) {
                // setLoading(false)
                break
            }
            dataValue = new TextDecoder().decode(value)
            data.value += dataValue
            messageData[messageData.length - 1].content = mdi.render(data.value)

            // 移动滚动条
            mainScroll()
        }
        // 隐藏停止接收
        chatOngoing.value = false

    } catch {
        console.log('请求失败')
    }
}


const mainScroll = () => {
    var chatMain = document.getElementById("chatMain");
    chatMain && (chatMain.scrollTop = chatMain.scrollHeight);
}


const modelName = (model_name: string) => {
    if (model_name == "gpt-4") {
        return "GPT-4"
    } else if (model_name == "gpt-3.5-turbo") {
        return "Default (GPT-3.5)"
    }
    return ""
}
//在setup里边的数据是私有的, 需要通过defineExpose暴露给父组件, 父组件才可以使用
defineExpose({
    setShowApp

})
</script>


<style lang="scss" scoped>
@media only screen and (max-width: 576px) {
    .el-container {

        ::v-deep .abort-chat-btn {
            position: absolute;
            left: 36%;
            bottom: 20px;
            z-index: 2;
            border-radius: 10px;
        }

        .el-select {
            width: 100%;
        }
    }

}



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
    height: calc(100vh - 130px);
}


.el-footer {
    height: 80px;
    background-color: var(--el-bg-chat-color);
    // border-top: 1px solid var(--el-border-color);
}

.el-aside {
    background-color: var(--el-color-info-light-9);
}

.el-aside .el-menu {
    background-color: transparent;
}

.el-menu-item {
    margin: 0 10px;
    margin-bottom: 5px;
    border-radius: 5px;
    height: 45px;

}

.el-menu-item .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 95%;
    display: block;
}

.el-menu-item .el-icon {
    position: absolute;
    right: 5px;
    display: none;
}

.el-menu-item:hover .el-icon {
    display: block;
}

.el-menu-item.is-active {
    background-color: var(--el-menu-item-hover-fill-bg);
    color: var(--el-menu-item-hover-color);
}

.el-menu-item:hover {
    background-color: var(--el-menu-item-hover-fill-bg);
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

.app-button ::v-deep .el-form-item__content {
    justify-content: center !important;
}

.examples {
    display: block;
}

.examples h4 {
    font-size: 14px;
    font-weight: normal;
    color: var(--el-text-color-regular);
    padding-left: 15px;
}

.examples h4 span {
    display: inline-block;
    margin-left: 15px;
    color: var(--el-color-primary);
    cursor: pointer;
    font-weight: bold;
}


.abort-chat-btn {
    position: absolute;
    left: 48%;
    bottom: 20px;
    z-index: 2;
    border-radius: 10px;
}




.chat-session-list {
    justify-content: center;
    align-items: end;
    padding: 15px;

}

.home-msg-item-bot {
    padding: 15px;
    padding-top: 25px;
    border-radius: 15px;
    background-color: var(--el-msg-item-bot-color);
    border-top: 1px solid var(--el-msg-item-bot-border-color);
    border-bottom: 1px solid var(--el-msg-item-bot-border-color);
}
</style>