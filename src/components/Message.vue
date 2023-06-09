<template>
  <div :class="{ 'msg-item-bot': isBot }" class="msg-item">
    <span class="chat-time">{{ msg.created_time }}</span>
    <el-avatar :size="35" :src="avatar" />
    <div v-if="isBot" class="msg-content markdown-body" v-html="msg.content"></div>
    <div v-if="!isBot" class="msg-content markdown-body nobot">{{ msg.content }}</div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, Ref, computed, watch } from 'vue';
import type { Msg } from '../class/Msg';
import '../assets/css/md.css'

const props = defineProps<{
  data: Msg
}>();

const isBot = computed(() => props.data?.who === 'bot');
const avatar = computed(() => {
  if (props.data?.who === 'bot') {
    return "/img/ai.png"
  } else {
    return "/img/avatar.png"
  }

});

const msg: Ref<Msg> = ref({
  id: '',
  chat_id: '',
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
  
<style lang="scss" scoped>
.msg-item {
  position: relative;
  display: flex;
  justify-content: end;
  align-items: top;
  width: 100%;
  padding: 20px 0;
  color: #373543;
  font-size: 16px;
}

.chat-time {
  position: absolute;
  font-size: 12px;
  color: #aaa;
  top: 0px;
  right: 50px;
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
  border: 1px solid #dfdcdc;
  padding: 10px 15px;
  border-radius: 10px;
  border-top-right-radius: 0;
  background-color: #ffffff;
  max-width: 80%;
  line-height: 150%;
}

.msg-item-bot .msg-content {
  border-radius: 10px;
  border-top-left-radius: 0;
  border: 1px solid #dfdcdc;
  background-color: #dfe9fa;
}

.msg-item-bot .chat-time {
  left: 50px;
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
</style>
  