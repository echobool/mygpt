<template >
    <el-card class="box-card" shadow="never" style="margin: 30px 15px 55px 15px; max-width: calc(100vw - 30px);">
        <template #header>
            <div class="card-header">
                <h3 style="margin:5px 20px;">代理站点设置</h3>
            </div>
        </template>


        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm"
            :size="formSize">
            <el-form-item label="站点logo" >
                请点击上方logo 上传
            </el-form-item>
            <el-form-item label="站点名称" prop="site_name">
                <el-input v-model="ruleForm.site_name" size="large" />
            </el-form-item>
            <el-alert type="info" show-icon :closable="false">
                <p>注意：独立域名一旦设置请勿随意更改，否则你用户就无法使用之前的域名了。例：www.baidu.com 配置好后将域名 CNAME 到下面二级域名上。</p>
            </el-alert>
            <el-form-item label="独立域名" prop="domain">
                <el-input v-model="ruleForm.domain" size="large" />
            </el-form-item>
            <el-alert type="info" show-icon :closable="false">
                <p>注意：二级域名一旦设置请勿随意更改，否则你用户就无法使用之前的域名了。</p>
            </el-alert>
            <el-form-item label="二级域名" prop="sub_domain">
                <el-input v-model="ruleForm.sub_domain" size="large" input-style="width:80px">
                    <template #append><span>{{subDmain}}</span> </template>
                </el-input>
            </el-form-item>
            <el-form-item label="备案号" prop="icp">
                <el-input v-model="ruleForm.icp" size="large" />
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="ruleForm.phone" size="large" />
            </el-form-item>
            <el-form-item label="验证码" prop="code">
                <el-input v-model="ruleForm.code" size="large" input-style="width:80px">
                    <template #append>
                        <el-button size="large" :disabled="sendCodeDisabled" type="primary" @click="sendCode(ruleFormRef)">
                            {{ sendCodeBtnTxt }}
                        </el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    保存
                </el-button>
            </el-form-item>
        </el-form>



    </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted} from 'vue'
import { ValidatePhone, ValidateDomain, ValidateSubDomain } from '../../utils/validate'
import type { FormInstance, FormRules } from 'element-plus'
import { sendPhoneCode, postAgentSetting } from '../../http/api'
import router from '../../router';
import { useGlobalStore } from '../../store'
import { storeToRefs } from 'pinia'
const subDmain = import.meta.env.APP_SUB_DOMAIN;


const Global = useGlobalStore()
const {  curAgent} = storeToRefs(Global)

const sendCodeDisabled = ref(false)
const sendCodeBtnTxt = ref('发送验证码')
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    site_name: '',
    domain: '',
    sub_domain: '',
    icp: '',
    phone: '',
    code: '',
})





onMounted(() => {

    ruleForm.site_name = curAgent.value.site_name
    ruleForm.domain = curAgent.value.domain
    ruleForm.sub_domain = curAgent.value.sub_domain
    ruleForm.icp = curAgent.value.icp
    ruleForm.phone = curAgent.value.phone
});

const rules = reactive<FormRules>({
    site_name: [
        { required: true, message: '请输入站点名称', trigger: 'blur' },
        { min: 3, max: 10, message: '站点名称字符控制在4 至 10个之内', trigger: 'blur' },
    ],
    domain: [
        { validator: ValidateDomain, trigger: 'change' },
    ],
    sub_domain: [
        { required: true, message: '请输入二级域名，', trigger: 'blur', },
        { min: 4, max: 10, message: '二级域名字符控制在4 至 10个之内', trigger: 'blur', },
        { asyncValidator: ValidateSubDomain, message: '二级域名被占用', trigger: 'blur', },
    ],
    phone: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { validator: ValidatePhone, trigger: 'change' },
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { min: 4, max: 4, message: '请输入正确的验证码', trigger: 'blur' },
    ],
})



const sendCode = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validateField(["phone"], (valid: any, fields: any) => {
        if (valid) {
            // 先禁用按钮
            sendCodeDisabled.value = true

            sendPhoneCode({
                phone: ruleForm.phone
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




const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {

            postAgentSetting(ruleForm).then(res => {
                console.log(res)
                router.replace({name:'revenue'})
            }).catch(err => {
                console.log(err)
            })

        } else {
            console.log('error submit!', fields)
        }
    })
}





</script>

<style scoped>
.el-alert {
    margin-bottom: 5px;
}
</style>