<template>
  <div class="msg-item " :class="{ 'msg-item-bot': (dialogMode == 3 && isBot) || dialogMode != 3 }" ref="markdownBodyRef">

    <span class="chat-time" :class="{ 'chat-time-fix': dialogMode !== 3 }">{{ msg.created_time }}</span>
    <span v-if="isBot" class="copy-btn"><el-icon><CopyDocument /></el-icon> 复制内容 </span>
    <!-- 只有3 对话模式才显示头像 -->
    <el-avatar v-if="dialogMode == 3" :size="35" :src="avatar" />
    <div v-if="isBot" class="msg-content markdown-body" :class="{ 'chat-item': dialogMode == 3}" v-html="msg.content"></div>
    <div v-if="!isBot" class="msg-content markdown-body nobot"  :class="{ 'chat-item-nobot': dialogMode == 3}">{{ msg.content }}</div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, Ref, computed, watch, onMounted, onUnmounted, onUpdated } from 'vue';
import { useGlobalStore } from '../store'
import { copyToClipboard } from '../utils/string'
const Global = useGlobalStore()
import type { Msg } from '../class/Msg';
import '../assets/css/md.css'


const markdownBodyRef: any = ref(null)

const addCopyEvents = () => {
  if (markdownBodyRef.value) {
    const copyBtns = markdownBodyRef.value.querySelectorAll('.code-block-header__copy')
    copyBtns.forEach((btn: any) => {
      btn.addEventListener('click', handleClick)
    })
  }
}

const removeCopyEvents = () => {
  if (markdownBodyRef.value) {
    const copyBtns = markdownBodyRef.value.querySelectorAll('.code-block-header__copy')
    copyBtns.forEach((btn: any) => {
      btn.removeEventListener('click', ()=>{})
    })
  }
}

const handleClick = (event: any) => {
  const code = event.target.parentElement?.nextElementSibling?.textContent
  if (code) {
    copyToClipboard(code)
      .then(() => {
        ElMessage({
          message: '复制成功.',
          type: 'success',
        })

      })
      .catch(() => {
        ElMessage({
          message: '复制失败.',
          type: 'warning',
        })
      })
  }
}



const addCopyBodyEvents = () => {
  if (markdownBodyRef.value) {
    const copyBtns = markdownBodyRef.value.querySelectorAll('.copy-btn')
    
    copyBtns.forEach((btn: any) => {
      btn.addEventListener('click', handleBodyClick)
    })
  }
}

const removeCopyBodyEvents = () => {
  if (markdownBodyRef.value) {
    const copyBtns = markdownBodyRef.value.querySelectorAll('.copy-btn')
    copyBtns.forEach((btn: any) => {
      btn.removeEventListener('click', ()=>{})
    })
  }
}

const handleBodyClick = (event: any) => {
  console.log('copy');

  const code = event.target.parentElement?.querySelector('.markdown-body').textContent
  if (code) {
    copyToClipboard(code)
      .then(() => {
        ElMessage({
          message: '复制成功.',
          type: 'success',
        })

      })
      .catch(() => {
        ElMessage({
          message: '复制失败.',
          type: 'warning',
        })
      })
  }
}


onMounted(() => {
  addCopyEvents()
  addCopyBodyEvents()
})

onUnmounted(() => {
  removeCopyEvents()
  removeCopyBodyEvents()
})

onUpdated(() => {
  addCopyEvents()
  addCopyBodyEvents()
})



const props = defineProps<{
  data: Msg,
  dialog_mode: number,
  app_logo: string
}>();

const isBot = computed(() => props.data?.who === 'bot');
const dialogMode = computed(() => props.dialog_mode);
const appLogo = computed(() => props.app_logo);
const avatar = computed(() => {  
  if (props.data?.who === 'bot') {
    if (props.dialog_mode == 3){
      return appLogo.value
    }
    return "/img/ailogo.png"
  } else {
    return Global.user.avatar ? Global.user.avatar : "/img/avatar1.png"
  }

});

const msg: Ref<Msg> = ref({
  id: '',
  chat_id: '',
  chat_type: '',
  who: '',
  content: '',
  created_time: ''
});

watch(() => props.data, (newData: Msg) => {
  if (newData) {
    msg.value = newData;
  }
},
  { immediate: true }
);




</script>
  


<style>

.markdown-body table {color:var(--el-text-color-primary);border-width: 1px;border-color: var(--el-border-color);border-collapse: collapse;}

.markdown-body table th {border-width: 1px;padding: 8px;border-style: solid;border-color: var(--el-border-color);background-color: var(--el-bg-color);}

.markdown-body table td {border-width: 1px;padding: 8px;border-style: solid;border-color: var(--el-border-color);background-color: var(--el-bg-color);}
</style>


<style lang="scss" scoped>
.msg-item {
  position: relative;
  display: flex;
  justify-content: end;
  align-items: top;
  width: 100%;
  padding: 20px 0;
  font-size: 16px;
}

.markdown-body {
  background-color: transparent;
}


.chat-time {
  position: absolute;
  font-size: 14px;
  color: var(--el-text-chat-time-color);
  top: 0px;
  right: 50px;
}

.copy-btn {
  position: absolute;
  font-size: 14px;
  color: var(--el-color-primary);
  top: 0px;
  right: 15px;
  cursor: pointer;
}

.copy-btn b {
  line-height: 14px;
  font-weight: normal;
  margin-left: 5px;
  position: absolute;
  display: inline-flex;
  width: 100px;
}

.el-avatar {
  margin-left: 10px;
  order: 1;
  flex-shrink: 0
}

.el-avatar>img {}

.msg-item-bot {
  justify-content: start !important;

}

.msg-item-bot .el-avatar {
  order: 0;
  margin-left: 0;
  margin-right: 10px;
  background-color: transparent;
}

.msg-content {

  padding: 10px 15px;
  border-top-right-radius: 0;

  max-width: 95%;
  line-height: 200%;
  color: var(--el-text-color-primary)
}


.msg-item-bot .chat-time {
  left: 60px;
}

.msg-item-bot .chat-time-fix {
  left: 15px;
}

.nobot {
  margin: 0;
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.msg-content pre {
  margin: 0;
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}


.chat-item {
  border: 1px solid var(--el-border-color);
  border-radius: 15px;
  border-top-left-radius: 0;
  background-color: var(--el-msg-item-bot-color);
  margin-top: 15px;
}

.chat-item-nobot {
  border: 1px solid var(--el-border-color);
  border-radius: 15px;
  border-top-right-radius: 0;
  background-color: var(--el-color-info-light-7);
  margin-top: 15px;
}
</style>
  