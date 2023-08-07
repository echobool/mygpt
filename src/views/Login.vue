<template>
  <div class="el-container" style="max-width: 998px; margin: 0 auto;">

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { openIdLogin } from '../http/api'
import { useGlobalStore } from '../store'
import { storeToRefs } from 'pinia'
import { AgentType } from '../class/types'

import { useRoute } from 'vue-router';
import router from '../router'

const Global = useGlobalStore()
const { user, token } = storeToRefs(Global)
const route = useRoute();
const host = new URL(window.location.href).hostname;

onMounted(() => {

  // 执行登录
  OnOpenIdLogin()

});
console.log(route.query.openid)

const OnOpenIdLogin = () => {
  openIdLogin({
    openid: route.query.openid
  }).then((res:any) => {
    if (res.data) {

      let domain = res.data.domain
      if (domain && domain != "" && domain != host) {
        window.location.href = "https://" + domain
        return
      }

      let userData = res.data.user
      // 存入状态管理
      user.value.agent = {} as AgentType
      // 存入状态管理
      user.value.id = userData.id
      user.value.nickname = userData.nickname
      user.value.avatar = userData.avatar
      user.value.email = userData.email
      user.value.phone = userData.phone
      user.value.status = userData.state
      token.value = res.data.token

      //是否是代理商 是的话不展示开通会员和代理按钮
      if (userData.agent) {
        user.value.agent.user_id = 1
        user.value.agent.agent_level_name = userData.agent.agent_level_name
        user.value.agent.agent_level = userData.agent.agent_level
        user.value.agent.order_id = userData.agent.order_id
        user.value.agent.real_name = userData.agent.real_name
      }
      router.replace({ path: '/' })
    }
    //console.log(res)
  }).catch(err => {
    console.log(err)
  })
}


</script>


<style lang="scss" scoped></style>