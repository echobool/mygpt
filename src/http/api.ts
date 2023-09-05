import axios from '../http/index'


export const getList = (params: any) => {
    return  axios.get('/chat/list', { params })
}

export const createChat =  (data: any) => {
    return  axios.post('/chat/', data)
}


export const delChat =  (params: any) => {
    return  axios.delete('/chat/', { params })
}

export const getChatLog = (params: any) => {
    return  axios.get('/chat/log', { params })
}


// 发送验证码
export const sendPhoneCode =  (data: any) => {
    return  axios.post('/sms', data)
}


// 手机短信登录
export const phoneLogin =  (data: any) => {
    return  axios.post('/phone', data)
}

// 手机短信登录
export const phoneBind =  (data: any) => {
    return  axios.post('/bind', data)
}

// 退出登录
export const logout =  () => {
    return  axios.post('/user/logout')
}

// 获取推荐数据
export const getInviteList =  () => {
    return  axios.get('/user/invite')
}

// 获取套餐列表
export const getPkgList = (params: any) => {
    return  axios.get('/pkg/list', { params })
}

// 获取代理套餐列表
export const getAgentList = (params: any) => {
    return  axios.get('/pkg/agent', { params })
}


// 获取公众号登录二维码 ticket
export const getMpQrcodeTicket = (params: any) => {
    return  axios.get('/qrcode', { params })
}

// 获取公众号登录二维码图片 用于分享推荐
export const getMpQrcodeImg = (params: any) => {
    return  axios.get('/qrcode-img', { params,responseType: 'blob' })
}

// 获取公众号登录轮询
export const mpQrcodeLogin = (data: any) => {
    return  axios.post('/mpqrcodelogin', data)
}

// 创建支付订单并返回支付信息
export const payInfo = (data: any) => {
    return  axios.post('/order/', data)
}

// 查询订单是否已支付
export const queryOrderState = (params: any) => {
    return  axios.get('/order/query', { params })
}




// 获取自己的订单信息
export const myOrder = (params: any) => {
    return  axios.get('/order/list', { params })
}


// 获取代理商信息
export const getAgentData = () => {
    return  axios.get('/agent/')
}

// 根据域名获取代理商信息
export const getAgentByHost = () => {
    return  axios.get('/agent/host')
}


// 获取代理商的收益信息
export const Income = (params: any) => {
    return  axios.get('/agent/income', { params })
}
// 获取代理商提现记录
export const extractListApi = (params: any) => {
    return  axios.get('/agent/extract', { params })
}

// 查询二级域名是否被占用
export const checkSubDomain = (params: any) => {
    return  axios.get('/agent/subdomain', { params })
}



// 保存代理商配置
export const postAgentSetting = (data: any) => {
    return  axios.post('/agent/setting', data)
}

// 保存代理商提现配置
export const postExtractSetting = (data: any) => {
    return  axios.post('/agent/extract', data)
}

// 申请提现
export const postExtractApply = (data: any) => {
    return  axios.post('/agent/extract/apply', data)
}

// openid登录
export const openIdLogin = (data: any) => {
    return  axios.post('/openid', data)
}


// 获取用户自己的信息
export const getUserInfo = () => {
    return  axios.get('/user/info')
}



// jsapi支付
export const jsapiPay = (data: any) => {
    return  axios.post('/order/jsapi', data)
}




// 获取所有应用
export const getAllApp = (params: any) => {
    return  axios.get('/app/list', { params })
}

// 获取所有推荐应用
export const getAppRecommend = () => {
    return  axios.get('/app/recommend')
}

// 获取应用信息
export const getAppInfo = (params: any) => {
    return  axios.get('/app/info', { params })
}

// 收藏应用
export const collect = (data: any) => {
    return  axios.post('/app/collect', data)
}

// 获取收藏应用列表
export const getCollects =  (params: any) => {
    return  axios.get('/app/collects', { params })
}