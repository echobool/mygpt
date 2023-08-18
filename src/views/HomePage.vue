<template>
    <el-aside width="291px" class="aside hidden-xs-only" :class="{ 'aside-show': showAside }">

        <div class="el-scrollbar">
            <el-affix :offset="60" class="hidden-sm-and-down">
                <el-button class="new-chat" @click="newChat" :icon="Plus" size="large">新建聊天</el-button>
            </el-affix>


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

        <el-card shadow="never" body-style="padding:10px">
            <!-- <el-tooltip class="box-item" effect="dark" content="AI模型选择" placement="top-end">
                <el-select v-model="model" @change="saveModel" class="m-2" placeholder="Select" size="large">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-tooltip> -->

            <div class="account-set">
                <span>
                    聊天设置
                </span>
                <el-tooltip class="box-item" effect="dark" content="对话参数设置" placement="top-start">
                    <el-icon :size="20" @click="openSetDialog">
                        <Setting />
                    </el-icon>
                </el-tooltip>

            </div>
        </el-card>

    </el-aside>
    <el-container @click="showAside = false" class="right-container">
        <el-main id="chatMain">

            <div v-show="promptVisible" :class="{ 'padding-top-50' : user.id && (user.subscribe != 1 || (user.subscribe == 1 && user.un_subscribe == 1))}" style="justify-content: center; display: flex; padding: 20px;">
                <el-radio-group v-model="model" size="large">
                    <el-radio-button v-for="item in options" :label="item.value">
                        <template #default>
                            <component :is="item.icon"></component>{{ item.label }}
                        </template>
                    </el-radio-button>
                </el-radio-group>
                    <br>
                
                <!-- <el-button style="height: 48px; margin-top: 2px; margin-left: 10px; border-radius: 15px;" type="success" round> 
                    <span style="font-size: 12px; line-height: 16px; height: 32px; display: block;">关注<br>公众号</span> 
                </el-button> -->
            </div>
            <div v-show="!promptVisible" style="justify-content: center; display: flex; padding: 20px;"
                class="home-msg-item-bot">
                Model: {{ curModelName }}
            </div>



            <el-row v-show="promptVisible" style="justify-content: center;" class="main-center">
                <el-col :xs="18" :sm="18" :md="20" :lg="12" :xl="12">
                    <el-row :gutter="0">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <div style="display: block; width: 100%;">
                                <p style="text-align: center;">大家都在用</p>
                                <el-carousel height="150px" style="margin-bottom: 30px;" direction="vertical" :autoplay="true" v-if="!isMobile()">
                                    <el-carousel-item v-for="(apps, i) in recommendPc" :key="i" class="app-item">
                                        <el-row>
                                            <el-col style="text-align: center;" v-for="(app, k) in apps" :key="k" :xs="6"
                                                :sm="6" :md="6" :lg="6" :xl="6">
                                                <div class="app-item-div" @click="router.replace({ name: 'ai' })">
                                                    <el-image :src="staticUrl + app.logo_path" fit="cover" />
                                                    <span class="app-name">{{ app.name }}</span>
                                                </div>

                                            </el-col>
                                        </el-row>
                                    </el-carousel-item>
                                </el-carousel>

                                <el-carousel height="120px" direction="vertical" :autoplay="true" v-if="isMobile()">
                                    <el-carousel-item v-for="(apps, i) in recommendMobile" :key="i" class="app-item">
                                        <el-row>
                                            <el-col style="text-align: center;" v-for="(app, k) in apps" :key="k" :xs="8"
                                                :sm="8" :md="8" :lg="8" :xl="8">
                                                <div class="app-item-div" @click="router.replace({ name: 'ai' })">
                                                    <el-image :src="staticUrl + app.logo_path" fit="cover" />
                                                    <span class="app-name">{{ app.name }}</span>
                                                </div>

                                            </el-col>
                                        </el-row>
                                    </el-carousel-item>
                                </el-carousel>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16">

                    <el-row :gutter="0">
                        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">

                            <el-card shadow="never">
                                <div class="prompt">
                                    <img class="logo hidden-sm-and-down hidden-md-and-up" width="80"
                                        src="../assets/img/bot3.svg" />
                                    <h3>方案生成</h3>
                                    <div @click="selectPrompt" class="item">
                                        我需要一份健身教程，向读者介绍如何进行某种运动或训练，提供详细的动作和姿势讲解，以及讲解健身原理和营养调配方法。为我撰写这份健身教程。</div>
                                    <div @click="selectPrompt" class="item">请探讨人类对火星殖民的可能性，分析火星环境和资源条件，并讨论人类如何解决生存和发展的挑战。
                                    </div>
                                    <div @click="selectPrompt" class="item">我需要一篇个人陈述，向读者展示我的人生经历、个人成长和未来的规划。</div>
                                    <div @click="selectPrompt" class="item">
                                        我希望你能充当一个花哨的标题生成器。我会通过逗号输入关键词，然后你会回复我花哨的标题。我的第一个关键词是API，测试，自动化。</div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                            <el-card shadow="never">
                                <div class="prompt">
                                    <img class="logo hidden-md-and-up" width="80" src="../assets/img/keyan.svg" />
                                    <h3>科研帮助</h3>
                                    <div @click="selectPrompt" class="item">
                                        我希望你能充当学术论文改进者的角色。请为以下结论提供改进建议，以使其更有说服力、更具深度和逻辑性：{结论}。</div>
                                    <div @click="selectPrompt" class="item">我希望你能帮助我提升论点清晰度，针对以下观点：{论点}。请提供更清晰、准确和更简洁的表达方式.
                                    </div>
                                    <div @click="selectPrompt" class="item">
                                        我需要一篇调研报告，要求有详细的采集数据、准确的数据分析、深入的市场洞察和有价值的建议。您能够为我撰写这篇调研报告吗？</div>
                                    <div @click="selectPrompt" class="item">
                                        我需要一篇实验报告，要求有详细的实验设计、准确的实验数据、客观的实验分析和科学的实验结论。您能够为我撰写这篇实验报告吗？</div>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
                            <el-card shadow="never">
                                <div class="prompt">
                                    <img class="logo hidden-md-and-up" width="100" src="../assets/img/yule2.svg" />
                                    <h3>休闲娱乐</h3>
                                    <div @click="selectPrompt" class="item">
                                        请你扮演我妈，用我妈的口气来教育我。骂我，批评我，催我结婚，让我回家。给我讲七大姑八大姨家的孩子都结婚了，为啥就我单身，再给我安排几个相亲对象。</div>
                                    <div @click="selectPrompt" class="item">请扮演一个酒店前台接待员，帮我办理入住手续。</div>
                                    <div @click="selectPrompt" class="item">你现在是[公司]的[职位]面试官，请分享在[职位]面试时最常会问的[数字]个问题。</div>
                                    <div @click="selectPrompt" class="item">
                                        作为一名营养师，我想为两个人设计一道素食菜谱，每份大约含有500卡路里，并且具有低升糖指数。请提供一些建议好吗？</div>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>



            <el-row class="chat-session-list" v-for="item in messageData" :key="item.id"
                :class="{ 'home-msg-item-bot': item.who === 'bot' }">
                <el-col :xs="24" :sm="24" :md="20" :lg="15" :xl="14">

                    <Message :data="item" />

                </el-col>
            </el-row>


        </el-main>


        <el-footer id="chatFooter" style="position: relative;">
            <el-button v-show="messageData.length > 0" @click="newChat" size="large" type="primary" icon="Plus" circle
                class="new-chat-btn hidden-sm-and-up">
            </el-button>
            <el-button v-show="chatOngoing" @click="abortChat" size="large" type="primary" plain class="abort-chat-btn">
                停止接收 </el-button>
            <el-row style="justify-content:center; ">
                <el-col :xs="24" :sm="24" :md="20" :lg="14" :xl="13"
                    style="display: flex; position: relative; margin-top: 10px; align-items: flex-end;">

                    <button @click="openLeftMenu" class="reset-btn menu-hamburger hamburger hidden-sm-and-up"
                        aria-label="移动端导航">
                        <span class="hamburger-1"></span>
                        <span class="hamburger-2"></span>
                        <span class="hamburger-3"></span>
                    </button>

                    <el-input id="myTextarea" class="inputQuestion" v-model="message" :autosize="{ minRows: 2, maxRows: 8 }"
                        type="textarea" placeholder="请输入问题，Shift + Enter换行，Enter发送" @input="inputChange" :autofocus="true"
                        resize="none" @keyup.enter="handleEnterKey">
                    </el-input>
                    <el-button @click="handleEnterKey" :disabled="!message || chatOngoing"
                        style=" position: absolute; right: 10px; bottom: 7px; height: 40px; padding: 0; border: 0; color: rgb(116, 152, 218); background-color: transparent;"
                        size="large"><el-icon size="30">
                            <Promotion />
                        </el-icon></el-button>

                </el-col>
            </el-row>


        </el-footer>





        <el-dialog v-model="dialogFormVisible" style="border-radius: 10px;" title="Chat 配置">
            <el-card shadow="never" body-style="padding:0 10px;">

                <el-divider />
                <div class="text-item">
                    <!-- Temperature -->
                    <h5>随机性</h5>
                    <span>值越大, 回复越随机, 大于 1 的值可能会导致乱码</span>
                    <div class="slider-handler">
                        <el-slider v-model="sliderRandom" :min="0" :max="2" :step="0.1" />
                    </div>

                </div>
                <el-divider />

                <div class="text-item">
                    <h5>话题新鲜度</h5>
                    <span>值越大, 越有可能扩展到新话题</span>
                    <div class="slider-handler">
                        <el-slider v-model="sliderFresh" :min="-2" :max="2" :step="0.1" />
                    </div>
                </div>
                <el-divider />
                <div class="text-item">
                    <h5>重复性</h5>
                    <span>文本中重复单词和短语的频率, 越大越不流畅</span>
                    <div class="slider-handler">
                        <el-slider v-model="sliderRepeat" :min="-2" :max="2" :step="0.1" />
                    </div>
                </div>
                <el-divider />
                <div class="text-item">
                    <h5>单次回复限制</h5>
                    <span>单次交互所用的最大 Token 数</span>
                    <div class="slider-handler">
                        <el-slider v-model="sliderLimit" :min="500" :max="4000" :step="10" />
                    </div>
                </div>
                <el-divider />

            </el-card>
            <template #footer>
                <span class="dialog-footer">
                    <el-button style="float: left;" @click="setDefault">恢复默认</el-button>
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveConfig">
                        保存
                    </el-button>
                </span>
            </template>
        </el-dialog>


    </el-container>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue';
import { InfoFilled } from '@element-plus/icons-vue'
import { StandardTime } from '../utils/DateTime'
import { useGlobalStore } from '../store'
import { storeToRefs } from 'pinia'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import router from '../router';

import { reactive, ref, onMounted, computed } from 'vue';
import type { Msg } from '../class/Msg'
import Message from '../components/Message.vue';
import { createChat, getList, delChat, getChatLog, getAppRecommend } from '../http/api'


const Global = useGlobalStore()
const { user} = storeToRefs(Global)
const model = ref('gpt-3.5-turbo')
// 展示设置框状态
const dialogFormVisible = ref(false)
const promptVisible = ref(true)
const showAside = ref(false)
const chatOngoing = ref(false)
const sliderRandom = ref(0.8)
const sliderFresh = ref(0.8)
const sliderRepeat = ref(0)
const sliderLimit = ref(2000)
const message = ref('')
const data = ref('');
const messageData: Msg[] = reactive([])
const curModelName = ref('')
const baseURL = import.meta.env.APP_BASE_URL;
const staticUrl = baseURL.replace('v1', '')

const chatCount = ref(0)
const chatLoadCount = ref(0)
const loading = ref(false)
const noMore = computed(() => chatLoadCount.value >= chatCount.value)
const disabled = computed(() => loading.value || noMore.value)

const recommendPc: any = ref([])
const recommendMobile: any = ref([])

const options = [
    {
        value: 'gpt-3.5-turbo',
        label: '  GPT-3.5',
        icon: 'Lightning'
    },
    {
        value: 'gpt-4',
        label: '  GPT-4',
        icon: 'ChromeFilled'
    },
]
const chatList: { today: any[], oneWeekAgo: any[], oneMonthAgo: any[], oneYearAgo: any[] } = reactive({
    today: [],
    oneWeekAgo: [],
    oneMonthAgo: [],
    oneYearAgo: []
})
const page = ref(1)
const props = defineProps<{
    openLoginFrom: Function
    openUpgradePop: Function
}>();



let chatId: string = ""

// 模型保存
// const saveModel = (modelV: string) => {
//     localStorage.setItem('model', modelV)
// }

// 打开左侧side
const openLeftMenu = (event: any) => {
    event.stopPropagation();
    showAside.value = true
}

// 打开设置项
const openSetDialog = () => {
    let random = localStorage.getItem('sliderRandom')
    let freash = localStorage.getItem('sliderFresh')
    let repeat = localStorage.getItem('sliderRepeat')
    let limit = localStorage.getItem('sliderLimit')
    let _model = localStorage.getItem('model')
    model.value = _model ? _model : 'gpt-3.5-turbo'
    sliderRandom.value = random ? parseFloat(random) : 0.8
    sliderFresh.value = freash ? parseFloat(freash) : 0.8
    sliderRepeat.value = repeat ? parseFloat(repeat) : 0
    sliderLimit.value = limit ? parseFloat(limit) : 2000
    dialogFormVisible.value = true
}

// 恢复默认设置
const setDefault = () => {
    model.value = 'gpt-3.5-turbo'
    sliderRandom.value = 0.8
    sliderFresh.value = 0.8
    sliderRepeat.value = 0
    sliderLimit.value = 2000
}
// 保存配置
const saveConfig = () => {
    localStorage.setItem('model', model.value)
    localStorage.setItem('sliderRandom', sliderRandom.value.toString())
    localStorage.setItem('sliderFresh', sliderFresh.value.toString())
    localStorage.setItem('sliderRepeat', sliderRepeat.value.toString())
    localStorage.setItem('sliderLimit', sliderLimit.value.toString())

    dialogFormVisible.value = false
}

const selectPrompt = (event: any) => {
    message.value = ''
    message.value = event.target.textContent
    inputChange()
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
    let _model = localStorage.getItem('model')
    model.value = _model ? _model : 'gpt-3.5-turbo'

    // 加载聊天列表
    loadChatList()
    loadAppRecommend()
});


// 加载推荐应用列表
const loadAppRecommend = async () => {
    recommendPc.value.splice(0, recommendPc.length)
    recommendMobile.value.splice(0, recommendMobile.length)
    await getAppRecommend().then((res:any) => {
        if (res.data) {
            let apps = res.data
            // console.log(res.data);
            recommendPc.value = [...groupArray(apps, 4)]
            recommendMobile.value = [...groupArray(apps, 3)]

            console.log(recommendPc, recommendMobile);

        }

    }).catch(error => {
        console.error(error);
    });
}


function groupArray(array: any, groupSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
    return result;
}


// 判断是pc 微信浏览器 还是手机微信浏览器
function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'iphone', 'ipad', 'windows phone'];
  
  for (let keyword of mobileKeywords) {
    if (userAgent.includes(keyword)) {
      return true;
    }
  }

  return false;
}


// 加载聊天列表
const loadChatList = async () => {
    if (Global.token == "") {
        return
    }
    loading.value = true
    await getList({
        "page_size": 20,
        "page": page.value,
    }).then((res:any) => {
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

let controller = new AbortController()
const abortChat = () => {
    controller.abort()
    chatOngoing.value = false
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
            chat_type: 'chat',
            who: "bot",
            content: data.value,
            created_time: StandardTime() // 给个当前时间
        })
        // 移动滚动条
        mainScroll()

        const baseUrl = import.meta.env.APP_BASE_URL
        const response = await fetch(baseUrl + '/chat/log', {
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
                checkExpire(dataValue)
                break
            }
            dataValue = new TextDecoder().decode(value)
            data.value += dataValue
            messageData[messageData.length - 1].content = mdi.render(data.value)

            mainScroll()
            // console.log(data)
        }
        // 隐藏停止接收
        chatOngoing.value = false

    } catch {
        console.log('请求失败')
    }
}


const checkExpire = (jsonStr: string) => {
    try {
        let obj = JSON.parse(jsonStr)
        if (typeof obj === 'object' && obj.code == 2020) {
            props.openUpgradePop()
        }
    } catch {

    }
}


// 发送消息
const handleEnterKey = async (event: KeyboardEvent) => {
    if (Global.token == "") {
        //弹出登录界面
        props.openLoginFrom()
        return
    }

    if (message.value.trim() === '') {
        message.value = ''
        event.preventDefault(); // Prevent line break if textarea is empty
        return
    }
    // 提交事件
    if (!event.shiftKey && message.value.trim() !== '') {
        // 隐藏提示词
        promptVisible.value = false

        // 清空接收的暂存消息 防止下次叠加到消息中
        data.value = ""

        // 发消息时将滚动条置底
        mainScroll()

        // 不是新会话的情况
        if (chatId !== "") {
            messageData.push({
                id: Math.round(1000000).toString(),
                chat_id: chatId,
                who: "user",
                content: message.value,
                chat_type: 'chat',
                created_time: StandardTime() // 给个当前时间
            })
            loadData({
                "id": chatId,
                "content": message.value
            })

            message.value = ""
            // 发消息后处理下排版
            inputChange()
            return
        }

        curModelName.value = modelName(model.value)
        await createChat({
            "model": model.value,
            "chat_type": 'chat',
            "content": message.value,
            "slider_random": sliderRandom.value,
            "slider_fresh": sliderFresh.value,
            "slider_repeat": sliderRepeat.value,
            "slider_limit": sliderLimit.value,
        }).then((res:any) => {
            // 如果没有额度或到期了则弹出充值界面
            if (res.code == 2020) {
                props.openUpgradePop()
                return
            }


            chatId = res.data?.chat_id
            messageData.push({
                id: chatId,
                chat_id: chatId,
                chat_type: 'chat',
                who: "user",
                content: message.value,
                created_time: StandardTime(res.data?.created_at)
            })

            loadData({
                "id": chatId,
                "content": message.value
            })

            message.value = ""
            // 发消息后处理下排版
            inputChange()
            // 重新载入历史聊天数据
            page.value = 1
            loading.value = true
            loadChatList()
        }).catch(error => {
            console.error(error);
        });
    }
}

const mainScroll = () => {
    var chatMain = document.getElementById("chatMain");
    chatMain && (chatMain.scrollTop = chatMain.scrollHeight);
}

let windowHeight = window.innerHeight;
// 动态处理输入框高度
const inputChange = () => {

    setTimeout(() => {
        const textarea = document.getElementById('myTextarea');
        const chatMain = document.getElementById('chatMain');
        const chatFooter = document.getElementById('chatFooter');

        if (textarea?.clientHeight) {
            let inputH = textarea.clientHeight
            let mainH = windowHeight - inputH - 88

            chatFooter && (chatFooter.style.height = inputH + 28 + 'px');
            chatMain && (chatMain.style.height = mainH + 'px');
        }
    }, 100);
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

// 创建新的聊天
const newChat = () => {
    model.value = 'gpt-3.5-turbo'
    // 将当前会话id 置空
    chatId = ""
    message.value = ''
    // 将当前会话日志清空
    messageData.splice(0, messageData.length);
    // 展示提示区块
    promptVisible.value = true
    //在移动端时关闭左侧菜单
    showAside.value = false
}

// 删除聊天记录
const chatDelete = async (d: string) => {
    await delChat({
        "id": d,
    }).then((res:any) => {

        removeById(chatList, d)
        console.log(res, chatList)

    }).catch(error => {
        console.error(error);
    });
    console.log(d);
}

// 点击展示聊天日志
const chatShow = async (id: string) => {
    curModelName.value = getModelNameById(chatList, id)
    messageData.splice(0, messageData.length);
    // 隐藏提示区块
    promptVisible.value = false
    //在移动端时关闭左侧菜单
    showAside.value = false
    // 清空输入框
    message.value = ''
    await getChatLog({
        "chat_id": id,
    }).then((res:any) => {
        if (res.data) {
            let data = res.data
            // 给当前chatId赋值, 可以继续在这个会话下聊天
            chatId = id

            data.forEach((item: any) => {
                messageData.push({
                    id: item._id,
                    chat_id: item.chat_id,
                    chat_type: item.chat_type,
                    who: item.who,
                    content: item.who == 'bot' ? mdi.render(item.content) : item.content,
                    created_time: StandardTime(item.created_at)
                })
            })

        }
        // 将聊天日志渲染至页面

        console.log(res)
    }).catch(err => {
        console.log(err)
    })

}

const removeById = (obj: any, id: string) => {
    for (let key in obj) {
        obj[key] = obj[key].filter((item: { _id: string; }) => item._id !== id);
    }
}

const getModelNameById = (obj: any, id: string) => {
    let model_name = ""
    for (let key in obj) {
        let it: any = obj[key].filter((item: { _id: string; }) => item._id === id);
        if (it.length > 0) {
            model_name = it[0].config.model_name
            break
        }
    }
    return modelName(model_name)
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
    loadChatList
})


</script>

<style lang="scss" scoped>
@media only screen and (max-width: 576px) {
    .el-container {
        ::v-deep .el-dialog {
            max-width: calc(100vw - 32px);
            width: 500px;
            margin-top: 60px;
        }

        .menu-scroll {
            border-right: 0;
            height: calc(100vh - 120px) !important;
        }

        ::v-deep .slider-handler {
            position: relative;
            display: block;
            width: 100% !important;
            text-align: center;
        }

        ::v-deep .new-chat-btn {
            position: absolute;
            left: 3%;
            top: -80px;
            z-index: 1;
        }

        ::v-deep .abort-chat-btn {
            position: absolute;
            left: 36%;
            top: -50px;
            z-index: 2;
            border-radius: 10px;
        }

        .el-select {
            width: 100%;
        }

        .app-item .app-item-div {
            display: inline-block;
            width: 60px;
            cursor: pointer;
        }

        .app-item .app-name {
            font-size: 12px;
        }
    }

}


.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 100px;
    margin: 0;
    text-align: center;
}


.abort-chat-btn {
    position: absolute;
    left: 48%;
    top: -50px;
    z-index: 2;
    border-radius: 10px;
}

.el-container {
    ::v-deep .el-dialog {
        width: 600px;
    }

    ::v-deep .el-dialog__body {
        padding: 5px 15px;
    }

    ::v-deep .el-textarea__inner {
        padding-right: 40px !important;
        background-color: var(--el-textarea-inner-color);
        border-radius: 10px;
    }

    ::v-deep .el-radio-button .el-radio-button__inner {
        color: var(--el-text-color-primary);
        background-color: var(--el-border-aside-color);
    }

    ::v-deep .el-radio-button:first-child .el-radio-button__inner {
        border-radius: 10px !important;
        border: 0;
    }

    ::v-deep .el-radio-button:last-child .el-radio-button__inner {
        border-radius: 10px !important;
        margin-left: 15px;
        border: 0;
    }

    ::v-deep .el-radio-button__original-radio:checked+.el-radio-button__inner {
        background-color: var(--el-msg-item-bot-color);
        box-shadow: none;
    }
}



.el-radio-group {
    background-color: var(--el-border-aside-color);
    padding: 5px 5px;
    border-radius: 15px;
}


.el-radio-group svg {
    height: 16px;
}




.aside .el-scrollbar {

    height: calc(100vh - 120px);
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

.aside .el-card {
    border-radius: 0;
    border: 0;
    border-top: 1px solid var(--el-border-color);
    border-right: 1px solid var(--el-border-aside-color);
    height: 59px;
    // background-color: var(--el-bg-color);
}



.aside .el-card .el-select {
    width: 100%;
}

.account-set {
    display: block;
    padding: 10px;
    padding-top: 15px;
    font-size: 14px;
    position: relative;
}

.account-set span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 85%;
    display: inline-block;
    font-weight: bold;
}

.account-set i {
    display: inline-block;
    right: 5px;
    position: absolute;
    cursor: pointer;
}

.el-dialog .el-card {
    border: 0;
}

.el-dialog .el-divider {
    margin: 12px 0;
}

.text-item {
    position: relative;
}

.text-item h5 {
    font-size: 1rem;
    margin-block-start: 0.3em;
    margin-block-end: 0.3em;
}

.text-item span {
    color: #888;
    font-size: 14px;
}

.slider-handler {
    position: absolute;
    right: 0;
    top: 10px;
    display: inline-block;
    width: 150px;
}

.dark .right-container .el-main,
.dark .right-container .el-footer {}

.el-main {
    height: calc(100vh - 140px);
    background-color: var(--el-bg-chat-color);
    padding: 0 0 20px 0;
}


.app-item {
    margin-top: 20px;
}

.app-item h4 {
    font-size: 14px;
    font-weight: normal;
    text-align: center;
    color: var(--el-color-info-dark-2);
}

.app-item h4 span {
    border-radius: 15px;
    padding: 5px 15px;
    background-color: var(--el-msg-item-bot-color);
    font-size: 12px;
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

.app-item .app-item-div {
    display: inline-block;
    width: 100px;
    cursor: pointer;
}

.el-container ::v-deep .el-carousel__indicator {
    display: none;
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

.new-chat {
    width: 260px;
    margin: 15px;
    justify-content: start;


}

.new-chat:hover {}


.chat-session-list {
    justify-content: center;
    align-items: end;
    padding: 15px;

}

.home-msg-item-bot {
    background-color: var(--el-msg-item-bot-color);
    border-top: 1px solid var(--el-msg-item-bot-border-color);
    border-bottom: 1px solid var(--el-msg-item-bot-border-color);
}

button.reset-btn {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    z-index: 1;
    display: inline-flex;
}

.menu-hamburger {
    width: 30px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    justify-content: center;
    height: 50px;
    margin-right: 10px !important;
}

.menu-hamburger>span {
    background-color: #707070;
    border-radius: 10px;
    height: 3px;
    margin: 2px 0;
    transition: var(--el-transition-all);
    width: 100%;
}

.menu-hamburger>span.hamburger-1 {
    width: 50%;
}

.menu-hamburger>span.hamburger-3 {
    width: 75%;
}

.el-main .main-center {
    margin-top: 25px;
}

.el-main .main-center .el-card {
    border: 0;
    background-color: transparent;
    padding: 0;
}

.prompt {
    text-align: center;
}

.prompt .item {
    padding: 15px;
    text-align: left;
    background-color: var(--el-prompt-item-color);
    margin-bottom: 15px;
    border-radius: 15px;
    font-size: 14px;
    cursor: pointer;
    line-height: 160%;
}

.prompt .item:hover {
    background-color: var(--el-color-info-light-9);

}

.padding-top-50 {
    padding-top: 60px !important;
}
.aside-show {
    display: block !important;
    position: absolute;
    z-index: 2;
}
</style>