<template>
    <div class="el-container" style="max-width: 998px; margin: 0 auto;">

        <el-card class="box-card" shadow="never" style="margin: 30px 15px 15px 15px; max-width: calc(100vw - 30px);">
            <template #header>
                <div class="card-header">
                    <div class="header-card">
                        <el-row :gutter="20">
                            <el-col :xs="6" :sm="6" :md="3" :lg="3">
                                <!-- 头像设置 -->
                                <el-popover placement="top-start" title="上传logo" :width="300" trigger="hover"
                                    content="请上传图片为100*100 以内方形图片，支持.png .jpg格式，文件大小不超过200k. 建议有透明度的 png 图片">
                                    <template #reference>
                                        <el-upload class="avatar-uploader" accept="image/png, image/jpeg"
                                            :headers="uploadHeaders" :action="baseURL + '/agent/upload'"
                                            :show-file-list="false" :on-success="handleAvatarSuccess"
                                            :before-upload="beforeAvatarUpload">
                                            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                                            <el-icon v-else class="avatar-uploader-icon">
                                                <Plus />
                                            </el-icon>
                                        </el-upload>
                                    </template>
                                </el-popover>

                            </el-col>
                            <el-col :xs="12" :sm="12" :md="8" :lg="8">
                                <h3>{{ agentData.agent_level_name }}</h3>
                                <div>{{ agentData.real_name }} <el-button @click="$router.replace('setting')" text
                                        type="primary" plain>站点设置</el-button> </div>
                            </el-col>
                            <el-col :xs="6" :sm="6" :md="5" :lg="5" style="text-align: center;">
                                <div class="tips">收益</div>
                                <h3>{{ agentData.balance ? agentData.balance : 0 }}</h3>

                            </el-col>
                            <el-col :xs="24" :sm="24" :md="8" :lg="8" style="text-align: center;">
                                <div class="tips"> &nbsp;</div>
                                <el-button type="primary" plain>提现</el-button>
                                <el-button @click="$router.replace('extract')" text type="primary" plain>提现设置</el-button>
                                <el-button text type="primary" plain>提现日志</el-button>

                            </el-col>
                        </el-row>


                    </div>

                    <!-- <el-button class="button" text>欢迎使用 字节点点AI系统</el-button> -->
                </div>
            </template>

            <el-row class="statistic">
                <el-col :xs="12" :sm="12" :md="6" :lg="6">
                    <el-statistic title="名下会员" :value="agentData.member_num" />
                </el-col>
                <el-col :xs="12" :sm="12" :md="6" :lg="6">
                    <el-statistic title="发展代理" :value="agentData.agent_num" />
                </el-col>
                <el-col :xs="12" :sm="12" :md="6" :lg="6">
                    <el-statistic title="总收益" :value="agentData.total_revenue" />
                </el-col>
                <el-col :xs="12" :sm="12" :md="6" :lg="6">
                    <el-statistic title="已提现" :value="agentData.extracted_money">

                    </el-statistic>
                </el-col>
            </el-row>
        </el-card>


        <el-container>
            <router-view v-slot="{ Component }">
                <component ref="AgentViewBox" :is="Component" />
            </router-view>
        </el-container>



    </div>
</template>

<script setup lang="ts">
import { reactive,  ref,  onMounted } from 'vue'
import { getAgentData } from '../../http/api'
import { useGlobalStore } from '../../store'
import { storeToRefs } from 'pinia'
import { AgentType } from '../../class/types';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'

const Global = useGlobalStore()
const { token,  curAgent } = storeToRefs(Global)
const agentData: AgentType = reactive({} as AgentType)

const imageUrl = ref('')
const baseURL = import.meta.env.APP_BASE_URL;
const staticUrl = baseURL.replace('v1', '')
const uploadHeaders = {
    'Authorization': token.value
}




// logo 上传
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    _response,
    uploadFile
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('请上传文件格式为 png, jpg')
        return false
    } else if (rawFile.size / 1024 > 200) {
        ElMessage.error('上传图片大小不超过 200k!')
        return false
    }
    return true
}





onMounted(() => {

    // 加载代理商数据
    loadAgent()
});


const loadAgent = async () => {
    await getAgentData().then(res => {

        if (res.data) {
            let data: any = res.data
            agentData.user_id = data.user_id
            agentData.agent_level = data.agent_level
            agentData.agent_level_name = data.agent_level_name
            agentData.balance = data.balance
            agentData.real_name = data.real_name
            agentData.status = data.status
            agentData.bank_name = data.bank_name
            agentData.card_no = data.card_no
            agentData.card_id = data.card_id
            agentData.card_id_front = data.card_id_front
            agentData.card_id_back = data.card_id_back
            agentData.domain = data.domain
            agentData.sub_domain = data.sub_domain
            agentData.logo = data.logo
            agentData.site_name = data.site_name
            agentData.icp = data.icp
            agentData.member_num = data.member_num
            agentData.agent_num = data.agent_num
            agentData.total_revenue = data.total_revenue
            agentData.extracted_money = data.extracted_money
            agentData.phone = data.phone
            imageUrl.value = staticUrl + data.logo

            curAgent.value = agentData
            console.log(data)
        }

    }).catch(error => {
        console.error(error);
    });
}




//在setup里边的数据是私有的，需要通过defineExpose暴露给父组件，父组件才可以使用
defineExpose({
    loadAgent
})

</script>


<style lang="scss" scoped>
@media only screen and (max-width: 576px) {
    .el-container ::v-deep .header-card {
        margin: 20px 5px;
    }
}

.el-container {
    display: block;
}

.box-card {
    border-radius: 20px;

}

.statistic .el-col {
    text-align: center;
}

.header-card {
    margin: 20px 30px;
    text-align: left;
}


.header-card h3 {
    margin: 0 0 5px 0;
}

.header-card .tips {
    color: #888;
    font-size: 12px;
    margin-bottom: 5px;
}



.el-pagination {
    margin-top: 20px;
    text-align: center;
    justify-content: center;
}

.el-statistic {
    margin: 8px 0;
}



.avatar-uploader .avatar {
    width: 60px;
    height: 60px;
    display: block;
}
</style>



<style >
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    text-align: center;
}
</style>