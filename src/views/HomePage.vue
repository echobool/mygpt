<template>
    <el-aside width="261px" class="aside hidden-xs-only">

        <el-scrollbar>

            <el-affix :offset="60">
                <el-button class="new-chat" @click="newChat" :icon="Plus" size="large">新建聊天</el-button>
            </el-affix>


            <el-menu :default-openeds="['1', '3']"  text-color="#333" @select="chatShow"
                active-text-color="#111">

                <el-menu-item-group v-for="(item, index) in chatList" :key="index" v-show="item.length > 0"
                    :title="getMenuTitle(index)">
                    <el-menu-item v-for="(menu, index1) in item" :key="index1" :index="menu._id">
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
            </el-menu>
        </el-scrollbar>

        <el-card shadow="never" body-style="padding:10px">
            <el-tooltip class="box-item" effect="dark" content="AI模型选择" placement="top-end">
                <el-select v-model="model" @change="saveModel" class="m-2" placeholder="Select" size="large">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-tooltip>

            <div class="account-set">
                <span>
                    ljy518338@163.com
                </span>
                <el-tooltip class="box-item" effect="dark" content="对话参数设置" placement="top-start">
                    <el-icon :size="20" @click="openSetDialog">
                        <Setting />
                    </el-icon>
                </el-tooltip>

            </div>
        </el-card>

    </el-aside>
    <el-container class="right-container">
        <el-main id="chatMain">

            <el-row>
                <el-col>
                    <div style="display: flex; justify-content: center;">

                    </div>
                </el-col>
            </el-row>
            <el-row class="chat-session-list">
                <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="17">

                    <Message v-for="item in messageData" :key="item.id" :data="item" />

                </el-col>
            </el-row>
        </el-main>


        <el-footer id="chatFooter">
            <el-row style="justify-content:center; ">
                <el-col :xs="24" :sm="24" :md="20" :lg="16" :xl="15" style="display: flex; margin-top: 10px; align-items: flex-end;">

                    <el-input id="myTextarea" class="inputQuestion" v-model="message" :autosize="{ minRows: 2, maxRows: 8 }"
                        type="textarea" placeholder="请输入问题" @input="inputChange" :autofocus="true" resize="none"
                        @keyup.enter="handleEnterKey" />

                    <el-button @click="handleEnterKey" :disabled="!message"
                        style="display: flex; height: 52px; margin-left: 5px; " size="large">发送</el-button>
                </el-col>
            </el-row>


        </el-footer>





        <el-dialog v-model="dialogFormVisible" style="border-radius: 10px;" title="Chat 配置">
            <el-card shadow="never" body-style="padding:0 10px;">
                <div class="text-item">
                    <h5>GPT模型</h5>
                    <span>设置默认聊天使用的GPT模型</span>
                    <div class="slider-handler" style="width: 200px;">
                        <el-select v-model="model" class="m-2" placeholder="Select" size="large">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </div>
                </div>
                <el-divider />
                <div class="text-item">
                    <h5>随机性</h5>
                    <span>值越大，回复越随机，大于 1 的值可能会导致乱码</span>
                    <div class="slider-handler">
                        <el-slider v-model="sliderRandom" :min="-2" :max="2" :step="0.1" />
                    </div>

                </div>
                <el-divider />

                <div class="text-item">
                    <h5>话题新鲜度</h5>
                    <span>值越大，越有可能扩展到新话题</span>
                    <div class="slider-handler">
                        <el-slider v-model="sliderFresh" :min="-2" :max="2" :step="0.1" />
                    </div>
                </div>
                <el-divider />
                <div class="text-item">
                    <h5>重复性</h5>
                    <span>文本中重复单词和短语的频率，越大越不流畅</span>
                    <div class="slider-handler">
                        <el-slider v-model="sliderRepeat" :min="-2" :max="2" :step="0.1" />
                    </div>
                </div>
                <el-divider />
                <div class="text-item">
                    <h5>单次回复限制</h5>
                    <span>单次交互所用的最大 Token 数</span>
                    <div class="slider-handler">
                        <el-slider v-model="sliderLimit" :min="200" :max="3500" :step="10" />
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
import { storeToRefs } from 'pinia'
import { useGlobalStore } from '../store'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'

import { reactive, ref, computed, watch, onMounted } from 'vue';
import type { Msg } from '../class/Msg'
import Message from '../components/Message.vue';
import { createChat, getList, delChat, getChatLog } from '../http/api'

const Global = useGlobalStore()
const { user, token } = storeToRefs(Global)
const model = ref('gpt-3.5-turbo')
// 展示设置框状态
const dialogFormVisible = ref(false)
const sliderRandom = ref(0)
const sliderFresh = ref(0)
const sliderRepeat = ref(0)
const sliderLimit = ref(2000)
const message = ref('')
const data = ref('');
const messageData: Msg[] = reactive([])
const options = [
    {
        value: 'gpt-3.5-turbo',
        label: '  GPT-3.5',
    },
    {
        value: 'gpt-4',
        label: '  GPT-4',
    },
]
const chatList = reactive({
    today: [],
    oneWeekAgo: [],
    oneMonthAgo: [],
    oneYearAgo: []
})
let controller = new AbortController()
let chatId: string = ""

// 模型保存
const saveModel = (modelV: string) => {
    localStorage.setItem('model', modelV)
}

// 打开设置项
const openSetDialog = () => {
    let random = localStorage.getItem('sliderRandom')
    let freash = localStorage.getItem('sliderFresh')
    let repeat = localStorage.getItem('sliderRepeat')
    let limit = localStorage.getItem('sliderLimit')
    let _model = localStorage.getItem('model')
    model.value = _model ? _model : 'gpt-3.5-turbo'
    sliderRandom.value = random ? parseFloat(random) : 0
    sliderFresh.value = freash ? parseFloat(freash) : 0
    sliderRepeat.value = repeat ? parseFloat(repeat) : 0
    sliderLimit.value = limit ? parseFloat(limit) : 2000
    dialogFormVisible.value = true
}

// 恢复默认设置
const setDefault = () => {
    model.value = 'gpt-3.5-turbo'
    sliderRandom.value = 0
    sliderFresh.value = 0
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



function highlightBlock(str: string, lang: string, code: string) {
    return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制代码</span></div><code class="hljs code-block-body language-${lang}">${str}</code></pre>`
}

const mdi = new MarkdownIt({
    html: true,
    linkify: true,
    highlight(code, language) {
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

});


// 加载聊天列表
const loadChatList = async () => {
    await getList({
        "page_size": 20,
        "page": 1,
    }).then(res => {

        // console.log(res)
        if (res.data) {
            handleChatList(res.data)
        }
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

    data.forEach(item => {
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


        messageData.push({
            id: Math.random.toString(),
            chat_id: Math.random.toString(),
            who: "bot",
            content: data.value,
            created_time: StandardTime() // 给个当前时间
        })

        let dataValue: string = ""
        var chatMain = document.getElementById("chatMain");

        while (true) {
            const { done, value } = await reader.read()
            if (done) {
                // setLoading(false)
                break
            }
            dataValue = new TextDecoder().decode(value)
            data.value += dataValue
            messageData[messageData.length - 1].content = mdi.render(data.value)

            chatMain.scrollTop = chatMain.scrollHeight;
            // console.log(data)
        }
    } catch {
        console.log('请求失败')
    }
}



const handleEnterKey = async (event: KeyboardEvent) => {

    if (message.value.trim() === '') {
        message.value = ''
        event.preventDefault(); // Prevent line break if textarea is empty
        return
    }
    // 提交事件
    if (!event.shiftKey && message.value.trim() !== '') {
        // 清空接收的暂存消息 防止下次叠加到消息中
        data.value = ""

        // 发消息时将滚动条置底
        var chatMain = document.getElementById("chatMain");
        chatMain.scrollTop = chatMain.scrollHeight;

        if (chatId !== "") {
            messageData.push({
                id: Math.round(1000000).toString(),
                chat_id: chatId,
                who: "user",
                content: message.value,
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


        await createChat({
            "model": model.value,
            "content": message.value
        }).then(res => {
            chatId = res.data?.chat_id
            messageData.push({
                id: chatId,
                chat_id: chatId,
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
        }).catch(error => {
            console.error(error);
        });
    }
}

// 动态处理输入框高度
const inputChange = () => {
    setTimeout(() => {
        let windowHeight = window.innerHeight;
        console.log(windowHeight);

        const textarea = document.querySelector('#myTextarea');
        const chatMain = document.querySelector('#chatMain');
        const chatFooter = document.querySelector('#chatFooter');

        // console.log(textarea?.clientHeight)

        if (textarea?.clientHeight) {
            let inputH = textarea.clientHeight + 21
            let mainH = windowHeight - inputH - 80

            chatFooter.style.height = inputH + 'px';
            chatMain.style.height = mainH + 'px';
        }
    }, 10);
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
    // 将当前会话id 置空
    chatId = ""
    // 将当前会话日志清空
    messageData.splice(0, messageData.length);
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
    console.log(d);
}

// 点击展示聊天日志
const chatShow = async (id: string) => {
    messageData.splice(0, messageData.length);

    await getChatLog({
        "chat_id": id,
    }).then(res => {
        if (res.data) {
            let data = res.data
            // 给当前chatId赋值，可以继续在这个会话下聊天
            chatId = id

            data.forEach(item => {
                messageData.push({
                    id: item._id,
                    chat_id: item.chat_id,
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
        obj[key] = obj[key].filter(item => item._id !== id);
    }
}

//在setup里边的数据是私有的，需要通过defineExpose暴露给父组件，父组件才可以使用
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

        ::v-deep .slider-handler {
            position: relative;
            display: block;
            width: 100% !important;
            text-align: center;
        }

        .el-select {
            width: 100%;
        }
    }

}

.el-container {
    ::v-deep .el-dialog {
        width: 600px;
    }

    ::v-deep .el-dialog__body {
        padding: 5px 15px;
    }
}

.aside .el-scrollbar {
    
    height: calc(100vh - 160px);
    background-color: #fff;
}

.aside .el-menu {
    border-right: 0;
}

.aside .el-card {
    border-radius: 0;
    border: 0;
    border-top: 1px solid #dedede;
    border-right: 1px solid #dedede;
    height: 99px;
    background-color: #ffffff;
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
    background-color: rgb(242 244 246);
}

.el-footer {
    height: 72px;
    background-color: #ffffff;
}

.el-scrollbar {
    height: calc(100vh - 60px);
    border-right: 1px solid #dedede;
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
    background-color: rgba(169, 175, 195, 0.5);
}

.el-menu-item:hover {
    background-color: rgba(169, 175, 195, 0.3);
}

.new-chat {
    width: 230px;
    margin: 15px;
    justify-content: start;
    background-color: rgb(241, 245, 249);
    border: 1px solid #c2c2c2;
    color: #2b2c33;
}

.new-chat:hover {
    background-color: rgb(255, 255, 255);
    color: #333;
}


.chat-session-list {
    justify-content: center;
    align-items: end;
    padding: 15px 0;
}
</style>