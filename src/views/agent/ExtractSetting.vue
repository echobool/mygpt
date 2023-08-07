<template >
    <el-card class="box-card" shadow="never" style="margin: 30px 15px 55px 15px; max-width: calc(100vw - 30px);">
        <template #header>
            <div class="card-header">
                <h3 style="margin:5px 20px;">提现设置</h3>
            </div>
        </template>


        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100" class="demo-ruleForm"
            :size="formSize">
            <el-alert type="info" show-icon :closable="false">
                注意：
                <ol> 
                    <li> 为保证各代理商资金安全，需要进行实名认证资料，</li>
                    <li>开户银行要填写到具体支行</li> 
                    <li>开户人必须和真实姓名一致</li> 
                </ol>
            </el-alert>
            <el-form-item label="真实姓名" prop="real_name">
                <el-input v-model="ruleForm.real_name" size="large" />
            </el-form-item>
            <el-form-item label="身份证号" prop="card_id">
                <el-input v-model="ruleForm.card_id" size="large" />
            </el-form-item>
            <el-form-item label="开户银行" prop="bank_name">
                <el-input v-model="ruleForm.bank_name" size="large" />
            </el-form-item>
            
            <el-form-item label="银行卡号" prop="card_no">
                <el-input v-model="ruleForm.card_no" size="large" />
            </el-form-item>
            <el-form-item label="微信号" prop="wechat_no">
                <el-input v-model="ruleForm.wechat_no" size="large" />
            </el-form-item>
            <el-form-item label="支付宝账号" prop="alipay_no">
                <el-input v-model="ruleForm.alipay_no" size="large" />
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
import type { FormInstance, FormRules } from 'element-plus'
import router from '../../router';
import { postExtractSetting } from '../../http/api'
import { useGlobalStore } from '../../store'
import { storeToRefs } from 'pinia'


const Global = useGlobalStore()
const {  curAgent} = storeToRefs(Global)


const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    card_id: '',
    bank_name: '',
    card_no: '',
    wechat_no: '',
    alipay_no: '',
    real_name: '',
})





onMounted(() => {

    ruleForm.card_id = curAgent.value.card_id
    ruleForm.bank_name = curAgent.value.bank_name
    ruleForm.card_no = curAgent.value.card_no
    ruleForm.real_name = curAgent.value.real_name
    ruleForm.wechat_no = curAgent.value.wechat_no
    ruleForm.alipay_no = curAgent.value.alipay_no
});

const rules = reactive<FormRules>({
    card_id: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
    ],
    bank_name: [
        { required: true, message: '请输入开户行全称', trigger: 'blur' },
    ],
    
    card_no: [
        { required: true, message: '请输入银行卡号，', trigger: 'blur', },
    ],
    real_name: [
        { required: true, message: '请输入真实姓名', trigger: 'blur' },
    ],
    
})



const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {

            postExtractSetting(ruleForm).then(res => {
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