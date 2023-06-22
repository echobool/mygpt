import Axios from 'axios';
import { useGlobalStore } from '../store'




const baseURL = import.meta.env.APP_BASE_URL;
const host = new URL(window.location.href).hostname;
const axios = Axios.create({
    baseURL,
    timeout: 0,
});

// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
    (config) => {
        const store = useGlobalStore()
        config.headers['Authorization'] = store.getToken
        config.headers['Agent-host'] = host
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 后置拦截器（获取到响应时的拦截）
axios.interceptors.response.use(
    (response) => {

        const store = useGlobalStore()

        // console.log(response)
        /**
         * 根据你的项目实际情况来对 response 和 error 做处理
         * 这里对 response 和 error 不做任何处理，直接返回
         */
        const { headers, data } = response;
        const { code, msg } = response.data;
        const { status } = response;
        const contentType = headers['content-type'];
        if (contentType.includes('force-download')) {
            let obj = {
                code: 200,
                data: { headers, data },
                message: '',
            };
            return obj;
        }

        if (status === 200) {
            if (code > 0) {
                // token 验证失败 处理用户重新登录
                if (code == 1006) {
                    store.setToken('')
                    const msg = "请登录"
                    ElMessage.error(`${code},  ${msg}`);
                    return Promise.reject(response.data);
                }
                if (code == 10061) {
                    store.setToken('')
                    const msg = "用户在其它地方登录，您已被踢下线！"
                    ElMessage.error(`${code},  ${msg}`);
                    return Promise.reject(response.data);
                }
                if (code == 11031 || code == 2019) {
                    return response.data;
                }
                ElMessage.error(`${code}, ${msg}`);
                //console.error(`request err: `, msg);
                return Promise.reject(response.data);
            }

            return response.data;
        } else {
            return Promise.reject(response.data);
        }
    },
    (error) => {
        if (error.response && error.response.data) {
            const status = error.response.status;
            const msg = error.response.data.message;
            ElMessage.error(`${status}, ${msg}`);
            console.error(`[网络错误]`, error.response);
        } else {
            ElMessage.error(`${error}`);
        }
        return Promise.reject(error);
    },
);

export default axios;
