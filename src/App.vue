<template>
  <div class="common-layout">
    <el-container>
      <el-header class="hidden-xs-only" v-if="!$route.meta.hidenfater">
        <div class="header-container">
          <div class="logo-container" style="cursor: pointer;" @click="router.replace({ name: 'home' })">
            <img class="logo" width="30" :src="logoUrl ? logoUrl : defaultLogo" alt="ai Logo">
            <span style="position: relative; font-weight: bold; margin-left: 10px;font-size: 20px;">
              {{ agent.site_name ? agent.site_name : siteName }}
            </span>
          </div>
          <div class="content">

            <el-menu :default-active="activeIndex" :router="true" class="el-menu-demo hidden-xs-only" mode="horizontal"
              @select="handleSelect">
              <el-menu-item @click="router.replace({ name: 'home' })"> <el-icon>
                  <ChatDotRound />
                </el-icon> 消息</el-menu-item>
              <el-menu-item @click=" aiClick()"><el-icon>
                  <Apple />
                </el-icon>
                <el-badge value="new" class="item">AI应用</el-badge>
              </el-menu-item>
              <el-menu-item index="" disabled><el-icon>
                  <Picture />
                </el-icon> 绘图</el-menu-item>

              <el-menu-item @click="inviteClick()" v-if="Global.token && !user.agent.user_id">
                <div class="residue-time"> 剩余时长：{{ residueTime }}</div>
                <span style="padding-left: 15px; color: var(--el-color-warning);"><el-badge is-dot class="item">推荐获时长
                  </el-badge></span>
              </el-menu-item>
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
                    user.agent?.agent_level_name ? user.agent?.agent_level_name : "加入代理，轻松赚钱" }}</el-button>
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



            <div class="app-service" v-if="service.status == 'open'">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <el-icon size="20" style="margin: 5px 5px 0 10px;  cursor: pointer;" class="el-icon--right">
                    <Service />
                  </el-icon>
                  <span class="service-text">客服</span>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-for="(item, index) in service.items" :key="index" :icon="Help"><el-link
                        :href="item.href" type="primary">{{ item.title }}</el-link></el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <div class="hidden-xs-only"><el-switch @change="toggleDark" v-model="isDark" class="mt-2"
                style="margin:0 10px; --el-switch-on-color: #aaa; --el-switch-off-color: #444" inline-prompt
                :active-icon="Sunny" :inactive-icon="Moon" /></div>
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

        <el-alert v-show="user.id && (user.subscribe != 1 || (user.subscribe == 1 && user.un_subscribe == 1))"
          class="hidden-md-and-up wx-subscribe" title="" type="warning" style="text-align: center;">关注公众号不迷路，关注后不提示，点击
          <el-button @click="getMpQrcodeSubscribe" size="small" type="primary" plain>关注公众号</el-button>
        </el-alert>


        <router-view v-slot="{ Component }">
          <component :openLoginFrom="openLoginFrom" :openUpgradePop="openUpgradePop" :isDark="isDark" ref="viewBox"
            :is="Component" />
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


      <!-- 邀请获取时长窗口 -->
      <el-dialog v-model="dialogShareVisible" width="700" style="border-radius: 10px; text-align: center;" title="">
        <el-row>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" style="margin-bottom: 20px;">
            <el-image
              style="width: 80px; height: 80px; padding: 20px; background-color: var(--el-color-warning-light-8); border-radius: 50%;"
              src="img/lipin.svg" fit="cover" />
            <h2>推荐朋友, 获得使用时长</h2>
            <p>
              成功推荐朋友，即用户通过你的链接或二维码登录平台就获得平台 GPT3.5 一天 使用时长。
            </p>
            <el-button type="danger" size="large" @click="showShareTxtBtn"
              style="width: 80%;margin: 15px;">推荐给朋友</el-button>
            <el-row style="border-top: 1px solid var(--el-border-color);">
              <el-col :span="12">
                <h4 style="color: crimson;"><span style="font-size: 30px;">{{ inviteNum }}</span> 人</h4>
                成功推荐
              </el-col>
              <el-col style="border-left: 1px solid var(--el-border-color);" :span="12">
                <h4 style="color: crimson;"><span style="font-size: 30px;">{{ inviteNum }}</span> 天</h4>
                累计获得
              </el-col>
            </el-row>
          </el-col>
          <el-col :class="{ 'share-list-border-left': isPc }" style="padding: 15px; position: relative; margin-top: 20px;"
            :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <h4 style="text-align: left; position: absolute; top: -10px; font-weight: normal; margin: 0 15px;">
              成功推荐记录（只显示最近10条）</h4>
            <ul style="margin: 15px 0;padding: 0; list-style: none;">
              <li
                style="display: flex; justify-content: space-between; padding: 5px 10px; background-color: var(--el-bg-chat-color);"
                v-for="(item, index) in inviteList" :key="index">
                <div style="display: flex;">{{ item.nickname }}</div>
                <div style="display: flex;">{{ formatDateByTimestamp(item.created_at) }}</div>
              </li>
              <li style="margin-top: 70px;" v-if="inviteList.length == 0">
                <el-empty :image-size="100" description="没有数据" />
              </li>
            </ul>
          </el-col>
        </el-row>

      </el-dialog>
      <!-- 推荐文案窗口 -->
      <el-dialog v-model="dialogShareTxtVisible" width="400" style="border-radius: 10px; text-align: center;"
        title="文案配图">
        <el-row>
          <el-col :span="24">
            <el-image v-if="inviteImg" style="width: 200px; border: 1px solid #ddd;" :src="inviteImg" fit="cover" />
            <br>
            <el-button v-if="inviteImg" style="margin: 15px;" @click="downloadImage">下载图片</el-button>
            <h2>推荐文案</h2>
            <p class="recommand-txt">
              {{ shareTxt }}
            </p>

            <el-button type="danger" size="large" @click="copyShareTxt" style="width: 80%;margin: 15px;">复制文案</el-button>

          </el-col>

        </el-row>

      </el-dialog>
      <!-- 关注公众号窗口 -->
      <el-dialog v-model="dialogSubscribeVisible" width="400" style="border-radius: 10px; text-align: center;"
        title="关注公众号">
        <el-row>
          <el-col :span="24">
            <el-image style="width: 300px; height: 300px; border: 1px solid #ddd;" :src="qrcodeImgSrc" fit="cover">
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <Loading />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <br>
            <h3>长按二维码关注公众号</h3>
            <p>如果已关注还出现提示，请取消关注再关注。</p>
          </el-col>
        </el-row>
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
        <h1 style=" margin-bottom: 35px; margin-top: 0;">选择额度套餐
          <el-button @click="inviteClick" size="default" type="danger" style="margin-left: 30px;">推荐获使用时长</el-button>
        </h1>
        <el-tabs type="border-card" v-model="curModel" @tab-click="changPkgTab">
          <el-tab-pane label="会员时长套餐" name="gpt3.5">
            <!-- pc端 -->
            <div class="scroll hidden-sm-and-down">
              <el-space size="large" alignment="flex-start">
                <el-card v-for="(item, index) in pkgList" :class="{ 'card-item-active': selectPkg == item.id }"
                  :key="index" shadow="hover" @click="selectPkgEvt(item.id)" class="vip-card"
                  :body-style="{ padding: '0px', marginBottom: '1px' }">

                  <div class="pkg-item">
                    <span v-if="item.recommend == 1" class="tui">推荐</span>
                    <h3>{{ item.name }}</h3>
                    <div class="mid">
                      <b><i>￥</i>{{ item.price.toFixed(2) }}</b>
                      <span>原价￥{{ item.old_price.toFixed(2) }}</span>
                    </div>
                    <div class="remark">折合 {{ (item.price / item.lifespan).toFixed(2) }}元/天 <br> <b>赠送4.0额度 {{ item.quota
                    }}条</b>
                    </div>
                  </div>
                </el-card>
              </el-space>
            </div>
            <!-- 移动端 -->
            <div class="scroll-y hidden-md-and-up">
              <el-row justify="space-around">
                <el-col :span="12" v-for="(item, index) in pkgList" :key="index">
                  <el-card :class="{ 'card-item-active': selectPkg == item.id }" shadow="hover"
                    @click="selectPkgEvt(item.id)" :body-style="{ padding: '0px', marginBottom: '1px' }">

                    <div class="pkg-item">
                      <span v-if="item.recommend == 1" class="tui">推荐</span>
                      <h3>{{ item.name }}</h3>
                      <div class="mid">
                        <b><i>￥</i>{{ item.price.toFixed(2) }}</b>
                        <span>原价￥{{ item.old_price.toFixed(2) }}</span>
                      </div>
                      <div class="remark">折合 {{ (item.price / item.lifespan).toFixed(2) }}元/天 <br> <b>赠送4.0额度 {{
                        item.quota }}条</b>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>

          </el-tab-pane>

          <el-tab-pane label="GPT-4套餐包" name="gpt4">
            <!-- pc端 -->
            <div class="scroll hidden-sm-and-down">
              <el-space size="large" alignment="flex-start">
                <el-card v-for="(item, index) in pkgList" :class="{ 'card-item-active': selectPkg == item.id }"
                  :key="index" shadow="hover" @click="selectPkgEvt(item.id)" class="vip-card"
                  :body-style="{ padding: '0px', marginBottom: '1px' }">

                  <div class="pkg-item">
                    <span v-if="item.recommend == 1" class="tui">推荐</span>
                    <h3>{{ item.name }}</h3>
                    <div class="mid">
                      <b><i>￥</i>{{ item.price.toFixed(2) }}</b>
                      <span>原价￥{{ item.old_price.toFixed(2) }}</span>
                    </div>
                    <div class="remark"><b>4.0额度 {{ item.quota }}条</b>
                    </div>
                  </div>
                </el-card>
              </el-space>
            </div>
            <!-- 移动端 -->
            <div class="scroll-y hidden-md-and-up">
              <el-row justify="space-around">
                <el-col :span="12" v-for="(item, index) in pkgList" :key="index">
                  <el-card :class="{ 'card-item-active': selectPkg == item.id }" shadow="hover"
                    @click="selectPkgEvt(item.id)" :body-style="{ padding: '0px', marginBottom: '1px' }">

                    <div class="pkg-item">
                      <span v-if="item.recommend == 1" class="tui">推荐</span>
                      <h3>{{ item.name }}</h3>
                      <div class="mid">
                        <b><i>￥</i>{{ item.price.toFixed(2) }}</b>
                        <span>原价￥{{ item.old_price.toFixed(2) }}</span>
                      </div>
                      <div class="remark"><b>4.0额度 {{ item.quota }}条</b>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </div>



          </el-tab-pane>

        </el-tabs>



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
        :width="span == 12 ? 700 : 950" style="border-radius: 10px;">
        <h1 style=" text-align: center; margin-bottom: 35px; margin-top: 0;">入驻本站代理商，你将获得</h1>

        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="span" :lg="span" :xl="span">
            <h2 style="text-align: left; padding-left: 50px;">{{ tongPaiData.name }}</h2>
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
          <el-col v-show="span == 12" :xs="24" :sm="24" :md="span" :lg="span" :xl="span">
            <h2 style="text-align: left; padding-left: 50px;">{{ heHuoRenData.name }}</h2>
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
      <el-drawer class="footer-drawer" v-model="drawerBottom" direction="ltr" title="I am the title" :with-header="false">

        <div class="el-drawer-item drawer-header">
          <div style="display: inline-block; width: 40px; height: 40px; padding: 15px;">
            <el-avatar style="height: 40px;" :size="40" :src="user.avatar ? user.avatar : '/img/avatar1.svg'" />
          </div>

          <h3 style="font-size: 16px; display: inline-block;">{{ user.nickname }}
            <span class="quota" style="position: absolute; top:10px; right:15px">
              <el-tag type="success" class="mx-1" effect="dark">
                {{ user.pkg_name == "" ? "无" : user.pkg_name }}
              </el-tag></span>
            <div style="font-weight: normal; color: #aaa; font-size: 14px;">{{ user.phone == "" ? "--" : user.phone }}
            </div>
          </h3>


        </div>

        <div class="el-drawer-item">
          <label> <el-icon>
              <View />
            </el-icon> 风格切换</label>
          <el-switch @change="toggleDark" v-model="isDark" size="large" class="mt-2"
            style="margin:0 10px; --el-switch-on-color: #aaa; --el-switch-off-color: #444; float:right; right: 15px;"
            inline-prompt :active-icon="Sunny" :inactive-icon="Moon" />
        </div>
        <div class=" el-drawer-item" @click="router.replace({ name: 'userHome' }); drawerBottom = false">
          <el-button :icon="User" text>
            用户中心</el-button>
        </div>
        <div class="el-drawer-item">
          <label> <el-icon>
              <Help />
            </el-icon>
            <el-link :underline="false"
              style="margin-left: 5px; width: 80%; justify-content:flex-start;vertical-align:top;"
              href="https://site.qianniugohome.com/p/help" target="_blank"> 在线帮助</el-link>
          </label>

        </div>
        <div class="el-drawer-item">
          <label> <el-icon>
              <Service />
            </el-icon>
            <el-link :underline="false"
              style="margin-left: 5px; width: 80%; justify-content:flex-start;vertical-align:top;"
              href="https://site.qianniugohome.com/p/kefu" target="_blank"> 联系客服</el-link>
          </label>
        </div>
        <div class="open-vip el-drawer-item" @click="inviteClick()">
          <div class="residue-time"> 剩余时长：{{ residueTime }}<span
              style="padding-left: 15px; color: var(--el-color-warning);"><el-badge is-dot class="item">推荐获时长
              </el-badge></span></div>

        </div>
        <div class="open-vip el-drawer-item">
          <el-button style="width: 90%;" @click="openUpgradePop" type="warning" text><el-image src="/img/charge.png"
              style="width: 30px; margin-right: 10px;" />用户充值</el-button>
        </div>

        <div class="open-agent-btn el-drawer-item">
          <el-button style="width: 90%;" @click="openAgentDialog" type="primary" text><el-image src="/img/lihua.png"
              style="width: 30px; margin-right: 10px;" />{{
                user.agent?.agent_level_name ? user.agent?.agent_level_name : "加入代理，轻松月入10W" }}</el-button>
        </div>

        <div class=" el-drawer-item logout">
          <el-button style="width: 100%;" size="large" type="primary"
            @click="logoutEvent(); drawerBottom = false">退出登录</el-button>

        </div>

      </el-drawer>

      <!-- 移动端底部菜单 -->
      <el-footer class="app-footer hidden-sm-and-up">
        <el-menu :default-active="activeIndex" :ellipsis="false" class="el-menu-demo " mode="horizontal"
          @select="handleSelect">
          <el-menu-item @click="router.replace({ name: 'home' })">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            <span>消息</span>
          </el-menu-item>
          <el-menu-item @click=" aiClick()">
            <el-icon>
              <el-badge value="new" class="item">
                <Apple />
              </el-badge>

            </el-icon><span>AI应用</span>

          </el-menu-item>
          <el-menu-item disabled><el-icon>
              <Picture />
            </el-icon> <span>绘图</span>
          </el-menu-item>

          <!-- 用户登录 -->
          <el-menu-item v-if="!Global.token" @click="openLoginFrom"><el-icon>
              <User />
            </el-icon> <span>个人中心</span>
          </el-menu-item>
          <el-menu-item style="height: 60px;" v-else @click="openDrawer">
            <span v-if="residueTimeHour < 100"
              style="position: absolute; top: 5px;right: 32px; border-radius: 10px;width: 8px; height: 8px; display: block; background-color: #ff0000;"></span>
            <el-avatar style="height: 30px;" :size="30" :src="user.avatar ? user.avatar : '/img/avatar1.svg'" />
          </el-menu-item>
        </el-menu>

      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">

import { Odometer, EditPen, SwitchButton, Sunny, Moon, Lollipop, Apple, User, Service, Help } from '@element-plus/icons-vue';
import { reactive, ref, onMounted, watch } from 'vue'
import { useGlobalStore } from './store'
import { PkgListType, UserType, AgentType } from './class/types'
import { ValidatePhone } from './utils/validate'
import { storeToRefs } from 'pinia'
import router from './router';
import { formatDateByTimestamp } from './utils/DateTime'
import { TabsPaneContext, type FormInstance, type FormRules } from 'element-plus'
import { useDark, useToggle, useTitle, useFullscreen } from '@vueuse/core'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { sendPhoneCode, jsapiPay, phoneLogin, phoneBind, getUserInfo, logout, getPkgList, payInfo, getMpQrcodeTicket, mpQrcodeLogin, queryOrderState, getAgentList, getAgentByHost, getInviteList, getMpQrcodeImg } from './http/api'
import { copyToClipboard } from './utils/string'

const { toggle } = useFullscreen()

const logoUrl = ref('')
const siteName = ref('')
const service: any = ref('')
const baseURL = import.meta.env.APP_BASE_URL;
const defaultLogo = import.meta.env.APP_DEFAULT_LOGO;
siteName.value = import.meta.env.APP_SITE_NAME;
service.value = JSON.parse(import.meta.env.APP_SERVICE);
let shareTxt: string = import.meta.env.APP_SHARE_TXT;


const staticUrl = baseURL.replace('v1', '')

const title = useTitle()

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'light',
  valueLight: 'dark',
})
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
const dialogSubscribeVisible = ref(false)
const dialogShareVisible = ref(false)
const dialogShareTxtVisible = ref(false)
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
let heHuoRenData: PkgListType = reactive({} as PkgListType)

const pkgList: PkgListType[] = reactive([])
const AgentList: any = reactive([])
const span = ref(12)
const residueTime = ref('0')
const residueTimeHour = ref(100)

const curModel = ref('gpt3.5')
const inviteImg = ref('')
const inviteNum = ref(0)
const inviteList: any = reactive([])


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

// 监听count的变化
watch(user.value, (newValue, oldValue) => {
  console.log(`count的值从 ${oldValue} 变为 ${newValue}`);
  // 计算剩余时间
  getResidueTime()
});


onMounted(() => {

  if (token.value) {
    loadUserInfo()
  }

  // 根据域名载入配置
  loadAgent()
  checkAgentTips()

  // 计算剩余时间
  getResidueTime()

});


const getLocalTime = (i: number) => {
  if (typeof i !== 'number') return; var d = new Date(); //得到1970年一月一日到现在的秒数 
  var len = d.getTime();//本地时间与GMT时间的时间偏移差(注意：GMT这是UTC的民间名称。GMT=UTC）
  var offset = d.getTimezoneOffset() * 60000;//得到现在的格林尼治时间
  var utcTime = len + offset;
  return new Date(utcTime + 3600000 * i);
}

const getResidueTime = () => {
  // 给定的时间戳
  const givenTimestamp: any = user.value.expiry_date; // 假设为秒级时间戳

  // 将时间戳转换为毫秒级
  const givenDate = new Date(givenTimestamp * 1000);
  // 当前日期（北京时间）
  const today = getLocalTime(8) as Date;

  // 计算剩余时间差（以毫秒为单位）
  const timeDiff = givenDate.getTime() - today.getTime();

  // 如果时间差小于等于0，则剩余天数为0
  if (timeDiff <= 0) {
    residueTime.value = '0'
  } else {
    // 将时间差转换为小时数
    const remainingHours = Math.ceil(timeDiff / (1000 * 60 * 60));

    if (remainingHours < 100) {
      residueTime.value = remainingHours + ' 小时'
      residueTimeHour.value = remainingHours
    } else {
      // 将时间差转换为天数
      const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      residueTime.value = remainingDays + ' 天'
    }
  }
}


const checkAgentTips = () => {
  if (typeof user.value.agent === 'object') {
    if (user.value.agent.agent_level != "" && user.value.agent.site_name == "") {
      agentTipsVisible.value = true
    } else {
      agentTipsVisible.value = false
    }

    if (curAgent.value.site_name != "") {
      agentTipsVisible.value = false
    }

  } else {
    agentTipsVisible.value = false
  }
}


const openDrawer = () => {
  drawerBottom.value = true
}

const loadAgent = async () => {

  await getAgentByHost().then((res: any) => {

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
    let inviteUserId = localStorage.getItem('invite_user_id')
    let loginUrl = baseUrl + "/wechat/login?host=" + host
    if (inviteUserId) {
      loginUrl += "&invite=" + inviteUserId
    }
    window.location.assign(loginUrl)
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

// 用于点击 AI栏目时执行一下 内容的方法 加载应用
const aiClick = () => {
  router.replace({ name: 'ai' })

  // console.log(typeof viewBox.value.setShowApp);
  if (typeof viewBox.value.setShowApp == 'function') {
    viewBox.value.setShowApp(true)
  }

}

// 邀请好友获得时长弹窗
const inviteClick = async () => {
  if (Global.token == "") {
    openLoginFrom()
    return
  }


  dialogShareVisible.value = true
  // 如果是充值窗口则关闭充值窗口
  dialogUpgradeVisible.value = false
  inviteList.splice(0, inviteList.length)
  // 获取推荐成功列表
  await getInviteList().then((res: any) => {
    console.log(res);
    if (res.code == 0) {
      inviteNum.value = res.ext.count
      // 推荐列表
      res.data.forEach((item: any) => {
        inviteList.push({
          "nickname": item.nickname ? item.nickname : item.phone,
          "phone": item.phone,
          "created_at": item.created_at
        })
      });
    }
  })
}
// 邀请好友文案弹窗
const showShareTxtBtn = () => {
  dialogShareTxtVisible.value = true

  dialogShareVisible.value = false
  // 清空分享图片
  inviteImg.value = ""

  // 合成分享二维码图片
  genInviteQrcodeImg()

  // 拼接分享内容
  shareTxt += ' \n\n 立即体验：https://' + host + '/s/' + user.value.id

}

const genInviteQrcodeImg = async () => {
  // 创建一个新的画布
  const canvas = document.createElement('canvas');
  const ctx: any = canvas.getContext('2d');

  const invite_user_id = user.value.id;

  // 获取二维码图片
  const imgBody: any = await getMpQrcodeImg({ invite: invite_user_id });

  if (imgBody) {
    console.log(imgBody);

    // 创建第一张图片
    var image1 = new Image();
    image1.src = "/img/wechat-share-tmp.png"; // 替换为第一张图片的路径

    // 等待第一张图片加载完成
    await new Promise((resolve) => (image1.onload = resolve));

    // 创建第二张图片
    var image2 = new Image();
    image2.src = window.URL.createObjectURL(imgBody); // 将 blob 数据转为对象 URL

    // 等待第二张图片加载完成
    await new Promise((resolve) => (image2.onload = resolve));

    // 创建第三张图片
    var image3 = new Image();
    image3.src = logoUrl.value ? logoUrl.value : defaultLogo;
    image3.width = 100

    // 等待第一张图片加载完成
    await new Promise((resolve) => (image3.onload = resolve));

    // 设置画布的大小与第一张图片一致
    canvas.width = image1.width;
    canvas.height = image1.height;

    // 在画布上绘制第一张图片
    ctx.drawImage(image1, 0, 0);

    // 在画布上绘制第二张图片（覆盖在第一张图片之上）
    ctx.drawImage(image2, 385, 880);

    ctx.drawImage(image3, 510, 1460, 180, 180);

    // 将合并后的图片转为 base64 格式
    inviteImg.value = canvas.toDataURL();

    // 打印合并后的图片 base64 数据
    // console.log(mergedImageBase64);
  }
};

const downloadImage = () => {
  const link = document.createElement("a");
  link.href = inviteImg.value;
  link.download = "GPT4_share_qrcode.png";
  link.click();
};



// 复制推荐文案
const copyShareTxt = () => {
  if (shareTxt) {
    copyToClipboard(shareTxt)
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




// 套餐切换事件
const changPkgTab = async (pane: TabsPaneContext, _ev: Event) => {
  curModel.value = pane.paneName as string

  if (pane.paneName == 'gpt3.5') {
    requestPkgData(1)
  } else if (pane.paneName == 'gpt4') {
    requestPkgData(2)
  }
}


const requestPkgData = async (pkg_type: number) => {
  countDown(10)
  pkgList.splice(0, pkgList.length);
  // 请求后台套餐数据
  await getPkgList({
    page: 1,
    page_size: 20,
    pkg_type: pkg_type
  }).then((res: any) => {
    if (res.data) {
      let defaultPkgId = 0
      res.data.forEach((item: PkgListType) => {
        if (item.recommend === 1 && defaultPkgId == 0) {
          defaultPkgId = item.id
        }
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
        defaultPkgId > 0 && selectPkgEvt(defaultPkgId) // 默认选中一个推荐的套餐
      }
    }
  }).catch(err => {
    console.log(err)
  })
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

const getMpQrcodeSubscribe = async () => {
  dialogSubscribeVisible.value = true
  // 获取二维码ticket
  await getMpQrcodeTicket({}).then((res: any) => {
    if (res.code == 0) {
      let data = res.data
      qrcodeImgSrc.value = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + data.ticket
    }
  })
}

// 二维码登录
const getMpQrcode = async () => {
  let invite_user_id = localStorage.getItem('invite_user_id')
  // 获取二维码ticket
  await getMpQrcodeTicket({
    invite: invite_user_id
  }).then((res: any) => {
    if (res.code == 0) {
      let data = res.data
      qrcodeImgSrc.value = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + data.ticket
      console.log(qrcodeImgSrc.value);


      timer2 = setInterval(() => {
        mpQrcodeLogin({
          uuid: data.uuid
        }).then((res: any) => {
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
            user.value.pkg_name = userData.pkg_name
            user.value.expiry_date = userData.expiry_date
            user.value.qa_num = userData.qa_num
            user.value.quota = userData.quota
            user.value.points = userData.points
            user.value.subscribe = userData.subscribe
            user.value.un_subscribe = userData.un_subscribe
            user.value.un_subscribe = userData.un_subscribe
            user.value.open_id = userData.open_id_1
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


const loadUserInfo = async () => {
  await getUserInfo().then((res: any) => {
    if (res.data) {
      let userData = res.data
      // 存入状态管理
      user.value.id = userData.id
      user.value.nickname = userData.nickname
      user.value.avatar = userData.avatar
      user.value.email = userData.email
      user.value.phone = userData.phone
      user.value.status = userData.state
      user.value.pkg_name = userData.pkg_name
      user.value.expiry_date = userData.expiry_date
      user.value.qa_num = userData.qa_num
      user.value.quota = userData.quota
      user.value.points = userData.points
      user.value.subscribe = userData.subscribe
      user.value.un_subscribe = userData.un_subscribe
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
  // if (user.value.phone == "") {
  //   dialogBindVisible.value = true
  //   return
  // }

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
  await getAgentList({}).then((res: any) => {
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

        tongPaiData = AgentList.find((item: PkgListType) => item.c_name === "tongpai_2");

      } else {

        tongPaiData = AgentList.find((item: PkgListType) => item.c_name === "tongpai");
        heHuoRenData = AgentList.find((item: PkgListType) => item.c_name === "hehuoren");

      }

      tongPaiData.intro_arr = tongPaiData.intro.split('\n')
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
  if (!isPc()) {
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
  }).then((res: any) => {
    if (res.code == 0) {
      // 展示二维码
      agentQrcodeText.value = res.data.pay_url
      // 定时查询是否支付成功
      timer4 = setInterval(() => {
        queryOrderState({
          out_trade_no: res.data.out_trade_no
        }).then((res: any) => {
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
  await getUserInfo().then((res: any) => {
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
    user.value.pkg_name = userData.pkg_name
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

  // 默认加载
  if (curModel.value == 'gpt3.5') {
    requestPkgData(1)
  } else if (curModel.value == 'gpt4') {
    requestPkgData(2)
  }

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
  }).then((res: any) => {
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
  // 如果在微信端调用jsapi支付方式 如果是桌面端则按桌面端 扫码处理
  if (!isPc()) {
    return
  }

  paymentLogo.value = ''

  await payInfo({
    payment: payment.value,
    package_id: selectPkg.value
  }).then((res: any) => {
    if (res.code == 0) {
      genQrcode(res.data.pay_url)

      timer3 = setInterval(() => {
        queryOrderState({
          out_trade_no: res.data.out_trade_no
        }).then((res: any) => {
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
      }).then((res: any) => {
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

  let inviteUserId = localStorage.getItem("invite_user_id") as string

  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      phoneLogin({
        phone: ruleForm.phoneNum,
        code: ruleForm.code,
        invite_id: parseInt(inviteUserId)
      }).then((res: any) => {
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
          user.value.pkg_name = userData.pkg_name
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
      }).then((res: any) => {
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
  await logout().then((res: any) => {
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


// 判断是pc 微信浏览器 还是手机微信浏览器
function isPc() {
  var system = {
    win: false,
    mac: false,
    xll: false,
    ipad: false
  };

  // 检测网页运行平台
  var p = window.navigator.platform;
  system.win = p.indexOf("Win") == 0; // windows
  system.mac = p.indexOf("Mac") == 0; // 苹果
  system.xll = p == "X11" || p.indexOf("Linux") == 0; // Linux
  system.ipad = navigator.userAgent.match(/iPad/i) != null ? true : false;  // iPad
  if (system.win || system.mac || system.xll || system.ipad) {  // 在PC端上打开的
    return true;
  } else {
    let ua = navigator.userAgent.toLowerCase();
    return /micromessenger/.test(ua) ? false : true;
  }
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
  width: 100%;
  top: 0;
  z-index: 10;
  // right: calc((100vw - 600px)/2);
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
  line-height: 25px;
}

.vipDialog .pkg-item .remark {
  color: #a5a5a5;
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

.agentDialog {
  padding-left: 30px;
}

.agentDialog ol {

  margin-bottom: 10px;
}

.agentDialog ol li {
  color: var(--el-color-warning);
  line-height: 30px;
}


.agentDialog .agent-item {
  text-align: left;
  padding-left: 30px;
  margin-bottom: 30px;
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

.el-container ::v-deep .vipDialog .el-tabs__nav {
  float: none;
  justify-content: left;
}


.el-header {
  border-bottom: 1px solid var(--el-border-color);
}

.el-header ::v-deep sup {
  top: 11px !important;
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

.header-container .residue-time {
  border: 1px dotted var(--el-color-warning);
  color: var(--el-color-warning);
  border-radius: 5px;
  height: 30px;
  line-height: 30px;
  padding: 2px 15px;
  margin: 10px 0;
}

.el-drawer-item .residue-time {
  border: 1px dotted var(--el-color-warning);
  color: var(--el-color-warning);
  border-radius: 5px;
  height: 30px;
  line-height: 30px;
  padding: 2px 0px;
  margin: 0 10px;
  font-size: 14px;
}

.header-container .user-facade {
  display: flex;
  justify-content: end;
  align-items: center;
  flex-grow: 1;
  padding-right: 10px;
  max-width: 120px;
}

.header-container .app-service {
  display: flex;
  justify-content: end;
  align-items: center;
  flex-grow: 1;
  padding-right: 10px;
  max-width: 120px;
  width: 120px;
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

.app-service .service-text {
  display: inline-block;
  justify-content: left;
  align-items: center;
  min-width: 30px;
  max-width: 60px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  margin-bottom: 3px;
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

.el-container ::v-deep .el-drawer.ltr {
  width: 70% !important;
}


.el-drawer .open-agent-btn {
  text-align: center;
  margin-top: 25px;
}

.el-drawer .open-vip {
  text-align: center;
  margin-top: 25px;
}

.el-container ::v-deep .footer-drawer .el-drawer__body {
  padding: 0 !important;
}

.el-drawer-item {
  //border-bottom: 1px solid var(--el-border-color);
  margin-top: 0 !important;

  padding: 15px 0;
}

.el-drawer-item label {
  margin: 0 15px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-regular)
}

.el-drawer .logout {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 15px 15px 40px;
}


.app-footer {
  padding-left: 0;
  padding-right: 0;
  overflow: hidden;
}

.el-container ::v-deep .app-footer .el-menu {
  height: 59px;
  border-top: 1px solid var(--el-border-color);
}

.app-footer .el-menu-item {
  flex-direction: column;
  width: 25%;
  padding: 10px 15px;
}

.app-footer .el-menu--horizontal {
  border: 0;
}

.app-footer .el-menu-item span {
  height: 20px;
  line-height: 20px;
  color: var(--el-text-color-regular);
  font-size: 12px;
}


.footer-drawer {
  padding: 0;
}


.wx-subscribe {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 10;
}

.wx-subscribe ::v-deep .el-alert__content {
  width: 100%;
}

.share-list-border-left {
  border-left: 1px solid var(--el-border-color);
}
</style>
