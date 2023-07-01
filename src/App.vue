<template>
  <div class="common-layout">
    <el-container>
      <el-header class="">
        <div class="header-container">
          <div class="logo-container" style="cursor: pointer;" @click="router.replace({ name: 'home' })">
            <img class="logo" width="30" :src="logoUrl ? logoUrl : '/ailogo.svg'" alt="ai Logo">
            <span style="position: relative; font-weight: bold; margin-left: 10px; margin-top: -5px; font-size: 20px;">
              {{ agent.site_name ? agent.site_name : siteName }}
            </span>
          </div>
          <div class="content">

            <el-menu :default-active="activeIndex" :router="true" class="el-menu-demo hidden-xs-only" mode="horizontal"
              @select="handleSelect">
              <el-menu-item @click="router.replace({ name: 'home' })"> <el-icon>
                  <ChatDotRound />
                </el-icon> 消息</el-menu-item>
              <el-menu-item index="" disabled><el-icon>
                  <Picture />
                </el-icon> 绘图</el-menu-item>

              <!-- <el-menu-item index="3"><el-icon>
                  <Goods />
                </el-icon> 商城</el-menu-item> -->
              <!-- <el-menu-item index="4">
                <i class="el-icon" style="font-size:24px;" data-v-6c8d2bba=""><svg
                    preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" width="1.2em" height="1.2em"
                    data-v-6c8d2bba="">
                    <path fill="currentColor"
                      d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.338 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.912-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.562 4.938c.362.312.675.912.675 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z">
                    </path>
                  </svg>
                </i>
                项目地址</el-menu-item> -->
            </el-menu>



            <div class="open-agent-btn hidden-xs-only">
              <el-button @click="openAgentDialog" type="primary" text><el-image src="/img/lihua.png"
                  style="width: 30px; margin-right: 10px;" />{{
                    user.agent?.agent_level_name ? user.agent?.agent_level_name : "加入代理，轻松月入10W" }}</el-button>
            </div>
            <!-- 立即开通会员升级 -->
            <div class="open-vip-btn hidden-xs-only">
              <el-button @click="openUpgradePop" type="warning" text><el-avatar :size="18" src="/img/diamond.png"
                  style="" />用户充值</el-button>
            </div>



            <!-- 用户右上区域 -->
            <div class="user-facade">
              <div class="no-login" v-if="!Global.token" @click="openLoginFrom">
                <el-avatar :size="30" src="/img/avatar1.svg" />
                {{ username }}
              </div>
              <el-dropdown v-else>
                <div class="el-dropdown-link">
                  <el-avatar :size="30" :src="user.avatar ? user.avatar : '/img/avatar1.svg'" />
                  <span class="username">
                    {{ Global.getNickname }}
                  </span>
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :icon="Odometer"
                      @click="router.replace({ name: 'userHome' })">用户中心</el-dropdown-item>
                    <el-dropdown-item class="hidden-sm-and-up" :icon="Lollipop"
                      @click="openUpgradePop">用户充值</el-dropdown-item>

                    <el-dropdown-item :icon="EditPen" disabled>签到</el-dropdown-item>
                    <el-dropdown-item @click="logoutEvent" :icon="SwitchButton">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>

            </div>
            <button @click="openDrawer" class="reset-btn menu-hamburger hamburger hidden-sm-and-up" aria-label="移动端导航">
              <el-icon style="font-size: 25px;" class="el-icon--right">
                <Menu />
              </el-icon>
            </button>


            <div class="hidden-xs-only"><el-switch @change="toggleDark" v-model="isDark" class="mt-2"
                style="margin:0 10px; --el-switch-on-color: #444; --el-switch-off-color: #aaa" inline-prompt
                :active-icon="Moon" :inactive-icon="Sunny" /></div>
            <div class="hidden-xs-only" style="margin: 5px 10px 0 10px;  cursor: pointer;"><el-icon size="20"
                @click="toggle">
                <FullScreen />
              </el-icon></div>


          </div>
        </div>

      </el-header>

      <el-container>
        <!-- 完善代理信息提示 -->
        <el-alert v-show="agentTipsVisible" title="请完善代理信息设置，否则站点无法访问" center type="error" class="agent-tips" />

        <router-view v-slot="{ Component }">
          <component :openLoginFrom="openLoginFrom" ref="viewBox" :is="Component" />
        </router-view>

      </el-container>




      <!-- 登录窗口 -->
      <el-dialog class="loginDialog" v-model="dialogFormVisible" width="480" @opened="getMpQrcode"
        @closed="closeLoginDialog" style="border-radius: 10px;" title="">
        <h1 style="text-align: center;">欢迎来到 {{ agent.site_name ? agent.site_name : siteName }}</h1>

        <div style="display: block;width: 100%;text-align: center; color: coral; font-size: 16px; line-height: 30px;">
          登录就赠送免费聊天额度</div>

        <el-tabs style="margin-top: 30px;" v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="微信扫码登录" name="loginCode">
            <el-image style="max-width: 340px; max-height: 340px; min-height: 250px;" :src="qrcodeImgSrc" :lazy="true"
              :loading="'lazy'" fit="fill">
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
            <span style="text-align: center; display: block;">扫码后关注公众号即可登录</span>
          </el-tab-pane>
          <el-tab-pane label="手机登录" name="loginPwd">

            <div style="display: block; margin-bottom: 30px;  width: 100%;text-align: center;">验证即登录，未注册将自动创建登录帐号</div>

            <el-form ref="ruleFormRef" label-position="top" :model="ruleForm" :rules="rules" label-width="120px"
              class="loginForm" :size="formSize">
              <el-form-item prop="phoneNum">
                <el-input v-model="ruleForm.phoneNum" size="large" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item style="margin-bottom: 20px;">
                <el-col :span="14">
                  <el-form-item prop="code">
                    <el-input v-model="ruleForm.code" size="large" placeholder="请输入验证码" />
                  </el-form-item>
                </el-col>
                <el-col class="text-center" :span="1"></el-col>
                <el-col :span="9">
                  <el-form-item>
                    <el-button size="large" :disabled="sendCodeDisabled" type="primary" @click="sendCode(ruleFormRef)">
                      {{ sendCodeBtnTxt }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-form-item>
              <el-form-item style="margin-bottom: 0; margin-top: 0;">
                <el-button size="large" style="width: 100%; font-size: 18px;" type="primary"
                  @click="submitForm(ruleFormRef)">
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <template #footer>
          <span class="dialog-footer">
          </span>
        </template>
      </el-dialog>


      <!-- 绑定手机号窗口 -->
      <el-dialog class="loginDialog" v-model="dialogBindVisible" width="480"
        style="border-radius: 10px; text-align: center; " title="绑定手机号">

        <el-form ref="ruleFormRef" label-position="top" :model="ruleForm" :rules="rules" label-width="120px"
          style="margin-top: 25px;" class="loginForm" :size="formSize">
          <el-form-item prop="phoneNum">
            <el-input v-model="ruleForm.phoneNum" size="large" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item style="margin-bottom: 20px;">
            <el-col :span="14">
              <el-form-item prop="code">
                <el-input v-model="ruleForm.code" size="large" placeholder="请输入验证码" />
              </el-form-item>
            </el-col>
            <el-col class="text-center" :span="1"></el-col>
            <el-col :span="9">
              <el-form-item>
                <el-button size="large" :disabled="sendCodeDisabled" type="primary" @click="sendCode(ruleFormRef)">
                  {{ sendCodeBtnTxt }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item style="margin-bottom: 0; margin-top: 0;">
            <el-button size="large" style="width: 100%; font-size: 18px;" type="primary"
              @click="submitBindForm(ruleFormRef)">
              提交
            </el-button>
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
          </span>
        </template>
      </el-dialog>

      <!-- 用户充值付费窗口 -->
      <el-dialog class="vipDialog" title="" v-model="dialogUpgradeVisible" @closed="onVipDialogClose" width="750"
        style="border-radius: 10px;">
        <h1 style=" margin-bottom: 35px; margin-top: 0;">选择额度套餐</h1>

        <div class="scroll hidden-sm-and-down">
          <el-space size="large" alignment="flex-start">
            <el-card v-for="(item, index) in pkgList" :class="{ 'card-item-active': selectPkg == item.id }" :key="index"
              shadow="hover" @click="selectPkgEvt(item.id)" class="vip-card"
              :body-style="{ padding: '0px', marginBottom: '1px' }">

              <div class="pkg-item">
                <span v-if="item.recommend == 1" class="tui">推荐</span>
                <h3>{{ item.name }}</h3>
                <div class="mid">
                  <b><i>￥</i>{{ item.price }}</b>
                  <span>原价￥{{ item.old_price }}</span>
                </div>
                <div class="remark">折合 {{ (item.price / item.lifespan).toFixed(2) }}元/天 <br> 赠送4.0额度 {{ item.quota }}条
                </div>
              </div>
            </el-card>
          </el-space>
        </div>

        <div class="scroll-y hidden-md-and-up">
          <el-row justify="space-around">
            <el-col :span="12" v-for="(item, index) in pkgList" :key="index">
              <el-card :class="{ 'card-item-active': selectPkg == item.id }" shadow="hover" @click="selectPkgEvt(item.id)"
                :body-style="{ padding: '0px', marginBottom: '1px' }">

                <div class="pkg-item">
                  <span v-if="item.recommend == 1" class="tui">推荐</span>
                  <h3>{{ item.name }}</h3>
                  <div class="mid">
                    <b><i>￥</i>{{ item.price }}</b>
                    <span>原价￥{{ item.old_price }}</span>
                  </div>
                  <div class="remark">折合 {{ (item.price / item.lifespan).toFixed(2) }}元/天 <br> 赠送4.0额度 {{ item.quota }}条
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

        </div>
        <el-card class="hidden-sm-and-down" style="margin-top:10px; background-color: transparent; border: 0;"
          shadow="never" v-if="Global.token == ''"
          :body-style="{ padding: '0px', marginBottom: '1px', textAlign: 'center' }">
          <el-button @click="openLoginFrom(); dialogUpgradeVisible = false" size="large" style="width: 20%;"
            type="primary">请登录</el-button>

        </el-card>

        <!-- 支付方式 -->

        <el-card class="hidden-sm-and-down" style="margin-top:10px;" shadow="hover" v-if="Global.token != ''"
          :body-style="{ padding: '0px', marginBottom: '1px', }">
          <div class="pay-area ">
            <div class="qrcode">
              <!-- <el-image style="width: 110px; height: 110px" src="/img/qrcode_chrome.png"></el-image> -->
              <vue-qr v-show="paymentLogo" :text="qrcodeText" :correctLevel="3" :size="110" :margin="0"
                colorDark="#000000" colorLight="white" backgroundColor="white" backgroundDimming="white"
                :logoSrc="paymentLogo" :logoScale=".2" :logoMargin="5" logoBackgroundColor="white"></vue-qr>
            </div>
            <div class="pay-right">
              <div class="payment">
                <el-button @click="changePayment('wechat')" :class="{ 'payment-active': payment == 'wechat' }"
                  plain><el-avatar :size="18" src="/img/wechat.png" style="" /> &nbsp;
                  微信支付</el-button>
                <!-- <el-button @click="changePayment('alipay')" :class="{ 'payment-active': payment == 'alipay' }"
                  plain><el-avatar :size="18" src="/img/alipay.png" style="" /> &nbsp;
                  支付宝支付</el-button> -->
              </div>

              <div class="pay-info ">
                应付金额 <span>￥<b class="money">{{ selectPkgData.price }}</b></span>
                <el-tag class="mx-1" type="danger" effect="light">
                  已优惠 ￥{{ (selectPkgData.old_price - selectPkgData.price).toFixed(2) }}
                </el-tag>
              </div>

              <div class="pay-remark ">
                <div class="agreement">支付视为您同意《 <el-link href="https://element-plus.org" target="_blank">会员协议</el-link> 》
                </div>
                <div class="pay-time">剩余支付时间： <span>{{ payCountDown }}</span> </div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- jsapi 支付 -->
        <div class="pay-area-jsapi hidden-md-and-up" style="padding: 0; margin-top: 20px; ">
          <el-button @click="onJsapiPay" :loading="JsapiPayBtnLoad" size="large" style="width: 100%;"
            type="primary">微信支付</el-button>
        </div>

        <!-- <el-card style="margin-top:25px;" shadow="hover"
          :body-style="{ padding: '0px', backgroundColor: '#f5f5f5', marginBottom: '1px', }">
          <div class="pay-card">
            <el-image style="width: 110px; height: 75px" src="/img/card.png"></el-image>
            <div class="pay-card-right">
              <h3>卡密支付</h3>
              <div class="card-form">
                <el-form :inline="true" class="demo-form-inline">
                  <el-form-item style="width:400px">
                    <el-input size="large" placeholder="请输入支付卡密" />
                  </el-form-item>
                  <el-form-item style="width: 50px;">
                    <el-button size="large" type="primary">提交</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </el-card> -->
        <template #footer>
          <span class="dialog-footer">
          </span>
        </template>
      </el-dialog>

      <!-- 代理窗口 -->
      <el-dialog class="agentDialog" :close-on-click-modal="false" title="" v-model="agentDialogVisible" @closed=""
        :width="span == 6 ? 1150 : 950" style="border-radius: 10px;">
        <h1 style=" text-align: center; margin-bottom: 35px; margin-top: 0;">入驻本站代理商，你将获得</h1>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="span" :lg="span" :xl="span">
            <h3 style="text-align: center;">{{ tongPaiData.name }}</h3>
            <ol>
              <li v-for="(item, index) in tongPaiData.intro_arr">
                <p :key="index">{{ item }}</p>
              </li>
            </ol>
            <div class="agent-item">
              <div class="agent-price"> <span>代理费用 </span> <i>￥</i><b>{{ tongPaiData.price }}</b> </div>
              <div class="agent-old-price"> <span>原价(即将恢复) </span>￥{{ tongPaiData.old_price }} </div>
              <el-button @click="openAgent(tongPaiData.id)" :loading="JsapiPayBtnLoad" size="large"
                type="primary">立即开通</el-button>
            </div>

          </el-col>
          <el-col :xs="24" :sm="24" :md="span" :lg="span" :xl="span">
            <h3 style="text-align: center;">{{ yinPaiData.name }}</h3>
            <ol>
              <li v-for="(item, index) in yinPaiData.intro_arr">
                <p :key="index">{{ item }}</p>
              </li>
            </ol>
            <div class="agent-item">
              <div class="agent-price"> <span>代理费用 </span> <i>￥</i><b>{{ yinPaiData.price }}</b> </div>
              <div class="agent-old-price"> <span>原价(即将恢复) </span>￥{{ yinPaiData.old_price }} </div>
              <el-button @click="openAgent(yinPaiData.id)" :loading="JsapiPayBtnLoad" size="large"
                type="primary">立即开通</el-button>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="span" :lg="span" :xl="span">
            <h3 style="text-align: center;">{{ jinPaiData.name }}</h3>
            <ol>
              <li v-for="(item, index) in jinPaiData.intro_arr">
                <p :key="index">{{ item }}</p>
              </li>
            </ol>
            <div class="agent-item">
              <div class="agent-price"> <span>代理费用 </span> <i>￥</i><b>{{ jinPaiData.price }}</b> </div>
              <div class="agent-old-price"> <span>原价(即将恢复) </span>￥{{ jinPaiData.old_price }} </div>
              <el-button @click="openAgent(jinPaiData.id)" :loading="JsapiPayBtnLoad" size="large"
                type="primary">立即开通</el-button>
            </div>
          </el-col>
          <el-col v-show="span == 6" :xs="24" :sm="24" :md="span" :lg="span" :xl="span">
            <h3 style="text-align: center;">{{ heHuoRenData.name }}</h3>
            <ol>
              <li v-for="(item, index) in heHuoRenData.intro_arr">
                <p :key="index">{{ item }}</p>
              </li>
            </ol>
            <div class="agent-item">
              <div class="agent-price"> <span>代理费用 </span> <i>￥</i><b>{{ heHuoRenData.price }}</b> </div>
              <div class="agent-old-price"> <span>原价(即将恢复) </span>￥{{ heHuoRenData.old_price }} </div>
              <el-button @click="openAgent(heHuoRenData.id)" :loading="JsapiPayBtnLoad" size="large"
                type="primary">立即开通</el-button>
            </div>
          </el-col>
        </el-row>

        <template #footer>
          <span class="dialog-footer">
          </span>
        </template>
      </el-dialog>

      <!-- 代理支付窗口 -->
      <el-dialog v-model="agentPayDialogVisible" title="开通代理" align-center width="300px" center
        @closed="onAgentDialogClose">
        <div class="qrcode" style="text-align: center; height: 150px;">
          <vue-qr v-show="agentQrcodeText" :text="agentQrcodeText" :correctLevel="3" :size="150" :margin="0"
            colorDark="#000000" colorLight="white" backgroundColor="white" backgroundDimming="white"
            logoSrc="/img/wechat.png" :logoScale=".2" :logoMargin="5" logoBackgroundColor="white"></vue-qr>
        </div>
        <template #footer>
          <span class="dialog-footer">
            请使用微信扫码支付
          </span>
        </template>
      </el-dialog>

      <!-- 移动端兼容 -->
      <el-drawer v-model="drawerBottom" direction="btt" title="I am the title" :with-header="false">
        <el-menu :default-active="activeIndex" style="justify-content: space-evenly;" :router="true" class="el-menu-demo"
          mode="horizontal" @select="handleSelect">
          <el-menu-item @click="router.replace({ name: 'home' })"> <el-icon>
              <ChatDotRound />
            </el-icon> 消息</el-menu-item>
          <el-menu-item @click="router.replace({ name: 'draw' })" disabled><el-icon>
              <Picture />
            </el-icon> 绘图</el-menu-item>
        </el-menu>

        <div class="open-vip">
          <el-button @click="openUpgradePop" type="warning" size="large" link>用户充值</el-button>
          <el-switch @change="toggleDark" size="large" v-model="isDark" class="mt-2"
            style="margin:0 24px; --el-switch-on-color: #444; --el-switch-off-color: #aaa" inline-prompt
            :active-icon="Moon" :inactive-icon="Sunny" />
        </div>

        <div class="open-agent-btn ">
          <el-button @click="openAgentDialog" type="primary" text><el-image src="/img/lihua.png"
              style="width: 30px; margin-right: 10px;" />{{
                user.agent?.agent_level_name ? user.agent?.agent_level_name : "加入代理，轻松月入10W" }}</el-button>
        </div>

      </el-drawer>

    </el-container>
  </div>
</template>

<script setup lang="ts">
import { Odometer, EditPen, SwitchButton, Sunny, Moon, Menu, Lollipop } from '@element-plus/icons-vue';
import { reactive, ref, onMounted } from 'vue'
import { useGlobalStore } from './store'
import { PkgListType, UserType, AgentType } from './class/types'
import { ValidatePhone } from './utils/validate'
import { storeToRefs } from 'pinia'
import router from './router';
import { type FormInstance, type FormRules } from 'element-plus'
import { useDark, useToggle, useTitle, useFullscreen } from '@vueuse/core'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { sendPhoneCode, jsapiPay, phoneLogin, phoneBind, getUserInfo, logout, getPkgList, payInfo, getMpQrcodeTicket, mpQrcodeLogin, queryOrderState, getAgentList, getAgentByHost } from './http/api'

const { toggle } = useFullscreen()

const logoUrl = ref('')
const siteName = ref('')
const baseURL = import.meta.env.APP_BASE_URL;
siteName.value = import.meta.env.APP_SITE_NAME;
const staticUrl = baseURL.replace('v1', '')

const title = useTitle()


const isDark = useDark()
isDark.value = true
const toggleDark = useToggle(isDark)

const Global = useGlobalStore()
const { user, token, agent, curAgent } = storeToRefs(Global)
title.value = agent.value.site_name ? agent.value.site_name : siteName.value

const formSize = ref('default')
const qrcodeImgSrc = ref('')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  phoneNum: '',
  code: ''
})
const drawerBottom = ref(false)
const viewBox = ref()
const activeIndex = ref('1')
const activeName = ref('loginCode')
const username = ref('登录送额度')
const dialogFormVisible = ref(false)
const dialogBindVisible = ref(false)
const dialogUpgradeVisible = ref(false)
const agentDialogVisible = ref(false)
const agentPayDialogVisible = ref(false)
const agentTipsVisible = ref(false)
const sendCodeDisabled = ref(false)
const JsapiPayBtnLoad = ref(false)
const sendCodeBtnTxt = ref('发送验证码')
const payCountDown = ref('10:00:00')
const qrcodeText = ref('')
const agentQrcodeText = ref('')
const selectPkg = ref(0)
const payment = ref('wechat')
const paymentLogo = ref('')
const selectPkgData: PkgListType = reactive({} as PkgListType)
let tongPaiData: PkgListType = reactive({} as PkgListType)
let yinPaiData: PkgListType = reactive({} as PkgListType)
let jinPaiData: PkgListType = reactive({} as PkgListType)
let heHuoRenData: PkgListType = reactive({} as PkgListType)

const pkgList: PkgListType[] = reactive([])
const AgentList: any = reactive([])
const span = ref(8)





let timer: number = 0
let timer2: number = 0
let timer3: number = 0
let timer4: number = 0


const rules = reactive<FormRules>({
  phoneNum: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { validator: ValidatePhone, trigger: 'change' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '请输入正确的验证码', trigger: 'blur' },
  ],

})

onMounted(() => {
  // 根据域名载入配置
  loadAgent()
  checkAgentTips()
});



const checkAgentTips=()=>{
  if(typeof user.value.agent === 'object' ){
    agentTipsVisible.value = user.value.agent.agent_level != "" && !user.value.agent.site_name 
  }
}


const openDrawer = () => {
  drawerBottom.value = true
}

const loadAgent = async () => {

  await getAgentByHost().then(res => {

    if (res.data) {
      let data: any = res.data

      // 如果中间件发现没有此二级域名则重定向到官方站
      if (data.domain != "") {
        window.location.href = 'http://' + data.domain
        return
      }

      agent.value.agent_level = data.agent_level
      agent.value.agent_level_name = data.agent_level_name
      agent.value.user_id = data.user_id
      agent.value.status = data.status
      agent.value.domain = data.domain
      agent.value.sub_domain = data.sub_domain
      agent.value.logo = data.logo
      agent.value.site_name = data.site_name
      agent.value.icp = data.icp
      if (agent.value.logo != "") {
        logoUrl.value = staticUrl + agent.value.logo
      }
      title.value = agent.value.site_name ? agent.value.site_name : siteName.value
    }

  }).catch(error => {
    console.error(error);
  });
}

const host = new URL(window.location.href).hostname;
const openLoginFrom = () => {
  if (isWeixinBrowser()) {
    console.log("执行微信登录")
    const baseUrl = import.meta.env.APP_BASE_URL
    //document.getElementById("myframe").src=baseUrl + "/wechat/login";
    window.location.assign(baseUrl + "/wechat/login?host=" + host)
  } else {
    dialogFormVisible.value = true
  }
}


const closeLoginDialog = () => {
  qrcodeImgSrc.value = ""
  // 清除轮询
  clearInterval(timer2)
  // 调用子组件方法
  // 要当前页面处在访问中才能触发 
  if (typeof (viewBox.value.loadChatList) == 'function') {
    viewBox.value.loadChatList()
  }

  if (typeof (viewBox.value.loadAgent) == 'function') {
    viewBox.value.loadAgent()
  }

}

// vip窗口关闭时执行
const onVipDialogClose = () => {
  qrcodeText.value = ""
  // 清楚轮询查询订单状态
  if (timer3 > 0) {
    clearInterval(timer3)
  }

}

// 代理商支付窗口关闭时执行
const onAgentDialogClose = () => {
  agentQrcodeText.value = ""
  // 清楚轮询查询订单状态
  if (timer4 > 0) {
    clearInterval(timer4)
  }

}

// 二维码登录
const getMpQrcode = async () => {
  // 获取二维码ticket
  await getMpQrcodeTicket().then(res => {
    if (res.code == 0) {
      let data = res.data
      qrcodeImgSrc.value = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + data.ticket


      timer2 = setInterval(() => {
        mpQrcodeLogin({
          uuid: data.uuid
        }).then(res => {
          if (res.code == 0) {

            let domain = res.data.domain
            if (domain && domain != "" && domain != host) {
              redirect(domain)
              return
            }


            let userData = res.data.user
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
              user.value.agent.site_name = userData.agent.site_name

              checkAgentTips()
            }

            ruleForm.phoneNum = ''
            ruleForm.code = ''
            dialogFormVisible.value = false //关闭登录窗口
            // 清除轮询
            clearInterval(timer2)
          }
        }).catch(err => {
          console.log(err)
        })
      }, 3000)
    }

    console.log(res)
  }).catch(err => {
    console.log(err)
  })
}


const redirect = (domain: string) => {
  window.location.href = "https://" + domain
}



const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  drawerBottom.value = false
}

const handleClick = (tab: any, event: Event) => {
  console.log(tab, event)
}

// 打开代理界面
const openAgentDialog = async () => {

  if (Global.token == "") {
    openLoginFrom()
    return
  }

  // 如果用户手机号为空则弹出绑定手机号
  if (user.value.phone == "") {
    dialogBindVisible.value = true
    return
  }

  drawerBottom.value = false
  // 如果已经是代理了 则进入代理管理页面
  if (user.value.agent?.agent_level) {
    router.replace({
      name: 'revenue'
    })
    return
  }



  if (agent.value.site_name !== "" && agent.value.status !== 1) {
    ElMessageBox.alert(
      '该商家未通过审核，不能进行操作',
      '警告',
      {
        confirmButtonText: '确定',
        type: 'warning',
      })
    return
  }


  AgentList.splice(0, AgentList.length)

  // 获取代理套餐价格
  await getAgentList({}).then(res => {
    console.log(res)
    if (res.data) {

      res.data.forEach((item: PkgListType) => {
        AgentList.push({
          id: item.id,
          name: item.name,
          c_name: item.c_name,
          gate: item.gate,
          old_price: item.old_price,
          price: item.price,
          lifespan: item.lifespan,
          sort: item.sort,
          intro: item.intro,
        })
      })


      if (agent.value.agent_level == 'hehuoren'
        || agent.value.agent_level == 'tongpai_2'
        || agent.value.agent_level == 'yinpai_2'
        || agent.value.agent_level == 'jinpai_2') {
        span.value = 8
        tongPaiData = AgentList.find((item: PkgListType) => item.c_name === "tongpai_2");
        yinPaiData = AgentList.find((item: PkgListType) => item.c_name === "yinpai_2");
        jinPaiData = AgentList.find((item: PkgListType) => item.c_name === "jinpai_2");

      } else {
        span.value = 6
        tongPaiData = AgentList.find((item: PkgListType) => item.c_name === "tongpai");
        yinPaiData = AgentList.find((item: PkgListType) => item.c_name === "yinpai");
        jinPaiData = AgentList.find((item: PkgListType) => item.c_name === "jinpai");
        heHuoRenData = AgentList.find((item: PkgListType) => item.c_name === "hehuoren");

      }

      tongPaiData.intro_arr = tongPaiData.intro.split('\n')
      yinPaiData.intro_arr = yinPaiData.intro.split('\n')
      jinPaiData.intro_arr = jinPaiData.intro.split('\n')
      heHuoRenData.intro_arr = heHuoRenData.intro ? heHuoRenData.intro.split('\n') : null;

      agentDialogVisible.value = true
    }
  }).catch(err => {
    console.log(err)
  })
}

// 开通代理付费窗口 并展示二维码
const openAgent = async (id: number) => {
  // 如果是微信浏览器 则使用jsapi支付
  if (isWeixinBrowser()) {
    JsapiPayBtnLoad.value = true
    toJsapiPay(id)
    return
  }

  payment.value = 'wechat'
  agentPayDialogVisible.value = true
  agentQrcodeText.value = ''
  await payInfo({
    payment: payment.value,
    package_id: id
  }).then(res => {
    if (res.code == 0) {
      // 展示二维码
      agentQrcodeText.value = res.data.pay_url
      // 定时查询是否支付成功
      timer4 = setInterval(() => {
        queryOrderState({
          out_trade_no: res.data.out_trade_no
        }).then(res => {
          if (res.data.pay_state == 2) {
            // 停止轮询
            clearInterval(timer4)
            // 关闭代理付款窗口
            agentPayDialogVisible.value = false
            agentDialogVisible.value = false
            // 调用充值成功后的状态更新等
            //重新获取用户信息
            requestGetUserInfo()
          }
        }).catch(err => {
          console.log(err)
        })

      }, 3000)
    }
  }).catch(err => {
    console.log(err)
  })
}



// 请求用户信息
const requestGetUserInfo = async () => {
  await getUserInfo().then(res => {
    console.log(res);
    let userData = res.data
    user.value.agent = {} as AgentType
    // 存入状态管理
    user.value.id = userData.id
    user.value.nickname = userData.nickname
    user.value.avatar = userData.avatar
    user.value.email = userData.email
    user.value.phone = userData.phone
    user.value.status = userData.state
    //是否是代理商 是的话不展示开通会员和代理按钮
    if (userData.agent) {
      user.value.agent.user_id = 1
      user.value.agent.agent_level_name = userData.agent.agent_level_name
      user.value.agent.agent_level = userData.agent.agent_level
      user.value.agent.order_id = userData.agent.order_id
      user.value.agent.real_name = userData.agent.real_name
      user.value.agent.site_name = userData.agent.site_name
      checkAgentTips()
    }
  }).catch(err => {
    console.log(err);

  })
}



// 打开升级付费窗口
const openUpgradePop = async () => {

  // if (Global.token == "") {
  //   // 弹出登录窗口
  //   openLoginFrom()
  //   return
  // }

  if (agent.value.site_name !== "" && agent.value.status !== 1) {
    ElMessageBox.alert(
      '该商家未通过审核，不能进行充值',
      '警告',
      {
        confirmButtonText: '确定',
        type: 'warning',
      })
    return
  }


  // 微信端弹出层隐藏
  drawerBottom.value = false

  dialogUpgradeVisible.value = true
  countDown(10)
  pkgList.splice(0, pkgList.length);
  // 请求后台套餐数据
  await getPkgList({
    page: 1,
    page_size: 20
  }).then(res => {
    if (res.data) {
      res.data.forEach((item: PkgListType) => {
        pkgList.push({
          id: item.id,
          name: item.name,
          c_name: item.c_name,
          genre: item.genre,
          created_at: item.created_at,
          expiry_date: item.expiry_date,
          number_use: item.number_use,
          old_price: item.old_price,
          price: item.price,
          lifespan: item.lifespan,
          remarks: item.remarks,
          state: item.state,
          recommend: item.recommend,
          sort: item.sort,
          gate: item.gate,
          quota: item.quota,
          intro: item.intro,
          intro_arr: [],
        })
      })

      if (Global.token != "") {
        selectPkgEvt(5) // 默认选中一个套餐
      }
    }
  }).catch(err => {
    console.log(err)
  })
}

const selectPkgEvt = (id: number) => {
  selectPkg.value = id
  // 根据id 查找出相关套餐数据
  let result = pkgList.find(item => item.id === id) as PkgListType;
  selectPkgData.id = result.id,
    selectPkgData.name = result.name,
    selectPkgData.genre = result.genre,
    selectPkgData.created_at = result.created_at,
    selectPkgData.expiry_date = result.expiry_date,
    selectPkgData.number_use = result.number_use,
    selectPkgData.old_price = result.old_price,
    selectPkgData.price = result.price,
    selectPkgData.remarks = result.remarks,
    selectPkgData.state = result.state,
    selectPkgData.recommend = result.recommend
  // 请求支付信息
  requestPay()
}


const changePayment = (pay: string) => {
  payment.value = pay
  // 请求支付信息
  requestPay()
}



let url = window.location.href
const onJsapiPay = () => {
  // 将按钮状态置为加载状态
  JsapiPayBtnLoad.value = true
  toJsapiPay(selectPkg.value)
}



const toJsapiPay = async (pkgId: number) => {
  await jsapiPay({
    package_id: pkgId
  }).then(res => {
    if (res.code == 0) {
      let prepay_id = res.data.prepay_id
      //跳转支付页面
      location.href = baseURL + '/wxpay/jsapi?prepay_id=' + prepay_id + '&redirect_url=' + url + '&agent_id=' + agent.value.user_id
    }
    console.log(res);

  }).catch(err => {
    console.log(err);

  })
}

// 向后台发起支付方式并返回支付信息
const requestPay = async () => {
  clearInterval(timer3)
  // 如果在微信端调用jsapi支付方式
  if (isWeixinBrowser()) {
    return
  }

  paymentLogo.value = ''

  await payInfo({
    payment: payment.value,
    package_id: selectPkg.value
  }).then(res => {
    if (res.code == 0) {
      genQrcode(res.data.pay_url)

      timer3 = setInterval(() => {
        queryOrderState({
          out_trade_no: res.data.out_trade_no
        }).then(res => {
          if (res.data.pay_state == 2) {
            // 停止轮询
            clearInterval(timer3)
            // 关闭充值窗口
            dialogUpgradeVisible.value = false
            // 调用充值成功后的状态更新等
          }
        }).catch(err => {
          console.log(err)
        })

      }, 3000)

    }
  }).catch(err => {
    console.log(err)
  })
}


const sendCode = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validateField(["phoneNum"], (valid: any, fields: any) => {
    if (valid) {
      // 先禁用按钮
      sendCodeDisabled.value = true

      sendPhoneCode({
        phone: ruleForm.phoneNum
      }).then(res => {
        if (res.code == 0) {
          let sec = 60
          const timer = setInterval(() => {
            sec--
            sendCodeBtnTxt.value = `${sec}s 后重新发送`
            if (sec <= 0) {
              sec = 60
              clearInterval(timer)
              sendCodeBtnTxt.value = `发送验证码`
              sendCodeDisabled.value = false
            }
          }, 1000)
        }
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}


// 手机登录
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      phoneLogin({
        phone: ruleForm.phoneNum,
        code: ruleForm.code
      }).then(res => {
        if (res.data) {

          let domain = res.data.domain
          if (domain && domain != "" && domain != host) {
            redirect(domain)
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

          ruleForm.phoneNum = ''
          ruleForm.code = ''
          dialogFormVisible.value = false //关闭登录窗口
        }
        //console.log(res)
      }).catch(err => {
        console.log(err)
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

// 绑定手机
const submitBindForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      phoneBind({
        phone: ruleForm.phoneNum,
        code: ruleForm.code,
        user_id: user.value.id
      }).then(res => {
        if (res.code == 0) {
          // 存入状态管理
          user.value.phone = ruleForm.phoneNum

          ruleForm.phoneNum = ''
          ruleForm.code = ''
          dialogBindVisible.value = false //关闭绑定窗口
        }
        //console.log(res)
      }).catch(err => {
        console.log(err)
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

const logoutEvent = async () => {
  await logout().then(res => {
    if (res.code == 0) {
      user.value = <UserType>{}
      // agent.value = <AgentType>{} // 代理站点不能清除
      token.value = ""
      curAgent.value = <AgentType>{}
    }
    router.replace({ name: 'home' })
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
}

// 支付倒计时
const countDown = (num: number) => {

  if (timer) { clearInterval(timer) }
  var maxTime = 100 * 60 * num;
  function jia(a: string): string {
    if (parseInt(a) < 10)
      return "0" + a;
    else
      return a.toString();
  }
  var last = function () {

    var minutes = Math.floor(maxTime / 60 / 100).toString();
    var seconds = Math.floor(maxTime / 100 % 60).toString();
    var msec = Math.floor(maxTime % 100).toString();
    minutes = jia(minutes);
    seconds = jia(seconds);
    msec = jia(msec);

    var mes = minutes + ":" + seconds + ":" + msec;
    payCountDown.value = mes;
    maxTime--;
    if (maxTime == 0) {
      clearInterval(timer);
      // 倒计时完关闭支付窗口
      dialogUpgradeVisible.value = false
    }
  }
  timer = setInterval(function () {
    last();
  }, 10);
}

const genQrcode = (url: string) => {
  qrcodeText.value = url
  if (payment.value == 'wechat') {
    paymentLogo.value = '/img/wechat.png'
  } else if (payment.value == 'alipay') {
    paymentLogo.value = '/img/alipay.png'
  }

}

// 判断是否为微信浏览器
const isWeixinBrowser = () => {
  let ua = navigator.userAgent.toLowerCase();
  return /micromessenger/.test(ua) ? true : false;
}

</script>

<style lang="scss" scoped>
body {
  margin: 0 !important;
}


@media only screen and (max-width: 576px) {
  .el-container ::v-deep .el-dialog {
    max-width: calc(100vw - 32px);
    margin-top: 60px;
  }


  .el-container ::v-deep .el-dialog__body {
    padding: 5px 15px !important;
    margin: 0 !important;
  }

}


.agent-tips {
  max-width: 600px;
  top: 70px;
  z-index: 10;
  right: calc((100vw - 600px)/2);
  position: absolute;
}

.open-agent-btn {
  margin-right: 10px;
}

.el-container ::v-deep .loginDialog {
  //width: 480px;
}

.el-container ::v-deep .vipDialog {
  // width: 800px;
}

.el-container ::v-deep .vipDialog .el-dialog__body {
  margin: 0 25px 15px;
  padding: 0;
}

.vipDialog .scroll {
  overflow-x: scroll;
  padding-bottom: 20px;
}

.vipDialog .scroll-y {
  overflow-y: scroll;
  padding-bottom: 20px;
  height: 400px;
}

.el-container ::v-deep .scroll-y .el-col {
  padding: 5px !important;
}

.vipDialog .el-card {
  border: 1px solid var(--el-border-color);
  border-radius: 10px;
  padding: 0;
  background-color: var(--el-color-primary-light-9);
  margin-bottom: 1px;
}

.vipDialog .card-item-active {
  border: 1px solid #fe0303;
}

.vipDialog .card-item-active::after {
  content: " ";
  background-image: url(/img/active.png);
  background-repeat: no-repeat;

}

.vipDialog .payment-active {
  border: 1px solid #fe0303;
}

.vipDialog .pkg-item {
  position: relative;
  display: block;
  padding: 15px;
  padding-right: 0;
  width: 135px;
  cursor: pointer;
}

.vipDialog .pkg-item .tui {
  position: absolute;
  background-image: url(/img/rem.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  color: #fff;
  font-size: 12px;
  display: block;
  width: 45px;
  line-height: 22px;
  text-align: center;
  right: 0;
  top: 0;
}


.vipDialog .pkg-item h3 {
  width: 100%;
  margin: 0 0 10px 0;
}

.vipDialog .pkg-item .mid {
  width: 100%;
  margin: 0 0 10px 0;

}

.vipDialog .pkg-item .mid b {
  font-size: 28px;
  color: #e82828;
}

.vipDialog .pkg-item .mid b i {
  font-size: 16px;
  font-style: normal;
}

.vipDialog .pkg-item .mid span {
  text-decoration: line-through;
  display: inline-block;
  margin-left: 5px;
  font-size: 12px;
  color: #777;
}

.vipDialog .pkg-item .remark {
  display: inline-block;
  font-size: 12px;
  color: #777;
}

.vipDialog .pay-area {
  display: flex;
  width: 100%;
  height: 110px;
  padding: 15px;
  font-size: 12px;
  color: #777;
}

.vipDialog .pay-area .pay-right {
  display: flex;
  padding-left: 15px;
  flex-direction: column;
  width: 520px;
}

.vipDialog .pay-area .qrcode {
  display: inline-block;
  width: 110px;
  height: 110px;
}


.vipDialog .pay-area .pay-right .payment {
  display: flex;
  padding-left: 15px;
  height: 35px;
}

.vipDialog .pay-area .pay-right .pay-info {
  display: flex;
  padding-left: 15px;
  margin-top: 20px;
  height: 30px;
  align-items: center;
  font-size: 14px;
}

.vipDialog .pay-area .pay-right .pay-info span {
  color: #e82828;
  padding-left: 10px;
}

.vipDialog .pay-area .pay-right .pay-info span .money {
  font-size: 30px;
  margin-right: 20px;
}

.vipDialog .pay-area .pay-right .pay-remark {
  display: flex;
  align-items: flex-end;
  height: 30px;
  padding-left: 15px;
  justify-content: space-between;
}

.vipDialog .pay-area .pay-right .pay-remark .agreement {
  display: inline-flex;

}

.vipDialog .pay-area .pay-right .pay-remark .pay-time {
  display: inline-flex;
  width: 140px;
}

.vipDialog .pay-area .pay-right .pay-info-we .tips {
  height: 45px;
  line-height: 45px;
  text-align: center;
  display: block;
  width: 160px;
  font-size: 16px;
  color: #333;
}

.vipDialog .pay-area .pay-right .pay-info-we .pay-time {
  text-align: center;
  display: inline-flex;
  width: 160px;
  line-height: 30px;
  justify-content: space-between;
}

.vipDialog .pay-area .pay-right .pay-remark .pay-time span {
  color: #e82828;
}

.vipDialog .pay-card {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 15px;
}

.vipDialog .pay-card .pay-card-right {
  display: flex;
  align-items: flex-start;
  padding: 0 25px;
  padding-right: 10px;
  flex-direction: column;
}

.vipDialog .pay-card .pay-card-right h3 {
  margin: 0;
  display: inline-flex;
}

.vipDialog .pay-card .pay-card-right .card-form {
  margin: 0;
  display: inline-flex;
  margin-top: 15px;
  height: 40px;
}

.agentDialog ol {
  min-height: 260px !important;
}

.agentDialog ol li {
  color: var(--el-color-warning);
  line-height: 30px;
}


.agentDialog .agent-item {
  text-align: center;

}

.agentDialog .agent-item .agent-price {
  line-height: 30px;
}

.agentDialog .agent-item .agent-old-price {
  line-height: 30px;
  margin-bottom: 15px;
  text-decoration: line-through;
  color: #a5a5a5;
}

.agentDialog .agent-item .agent-price span {
  font-weight: bold;
  font-size: 14px;
}

.agentDialog .agent-item .agent-price i {
  font-style: normal;
  font-weight: bold;
  color: #e82828;
}

.agentDialog .agent-item .agent-price b {
  font-style: normal;
  font-weight: bold;
  color: #e82828;
  font-size: 28px;
}

.el-container ::v-deep .loginDialog .el-dialog__body {
  padding: 5px 70px;
}

.el-container ::v-deep .el-tabs__nav {
  float: none;
  justify-content: center;
}


.el-header {
  border-bottom: 1px solid var(--el-border-color);
}

.header-container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;

}


.logo-container {
  display: flex;
  align-items: center;
  height: 60px;
}

.header-container .content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;

}

.header-container .user-facade {
  display: flex;
  justify-content: end;
  align-items: center;
  flex-grow: 1;
  padding-right: 10px;
  max-width: 120px;
}

.header-container .open-vip-btn {
  display: flex;
  justify-content: end;
  align-items: center;
  flex-grow: 1;
  padding-right: 15px;
  width: 135px;

  color: #dd9507;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
}

.header-container .open-vip-btn .el-avatar {
  margin-right: 5px;
  background-color: transparent;
}

.open-vip-pop .flex-wrap {
  flex-wrap: wrap;
  display: flex;
  justify-content: space-between;
  width: 350px;

}

.open-vip-pop .flex-wrap .item {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: var(--el-color-warning);
  margin-bottom: 1em;
}

.header-container .no-login {
  display: flex;
  justify-content: end;
  align-items: center;
  flex-grow: 1;
  padding-right: 0;
  width: 120px;
  font-size: 14px;
  color: var(--el-menu-text-color);
  cursor: pointer;
}

.user-facade .el-dropdown-link {
  display: inline-flex;
  justify-content: end;
  align-items: center;
}

.user-facade .username {
  display: inline-flex;
  justify-content: left;
  align-items: center;
  min-width: 50px;
  max-width: 60px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.user-facade .el-avatar {
  margin-right: 10px;
}



.header-container .content .el-menu {
  width: 100%;
  border-bottom: 0;
  justify-content: center;
}

.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 0;
}


button.reset-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: var(--el-text-color-regular);
}

.menu-hamburger {
  width: 20px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  justify-content: center;
  height: var(--nav-height);
  margin: 0 14px;
}

.menu-hamburger>span {
  border-radius: 10px;
  height: 2px;
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



.loginForm {}

.loginForm .el-form-item {
  margin-bottom: 35px;
}

.loginForm ::v-deep .el-form-item__content {
  justify-content: center;
}

.loginForm ::v-deep .el-input__inner {
  font-size: 16px;
}


.el-container ::v-deep .el-drawer.btt {
  border-radius: 20px 20px 0 0;
}

.el-drawer .open-agent-btn {
  text-align: center;
  margin-top: 25px;
}

.el-drawer .open-vip {
  text-align: center;
  margin-top: 25px;
}
</style>
