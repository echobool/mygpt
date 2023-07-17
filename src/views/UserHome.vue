<template>
    <div class="el-container main" style="max-width: 998px; margin: 0 auto;">
        <el-card class="box-card" shadow="never" style="margin: 30px 15px 15px 15px; max-width: calc(100vw - 30px);">
            <template #header>
                <div class="card-header">
                    <div class="header-card">
                        <el-row :gutter="20">
                            <el-col :xs="8" :sm="8" :md="3" :lg="3" style="text-align: center;">
                                <el-avatar size="large" :src=" user.avatar? user.avatar:'/img/avatar1.svg'" />
                            </el-col>
                            <el-col :xs="16" :sm="16" :md="8" :lg="8">
                                <h3>{{ user.nickname }}<span class="quota"> 
                                    <el-tag type="success" class="mx-1" effect="dark">
                                            {{ user.pkg_name == "" ? "无" : user.pkg_name }}
                                        </el-tag></span> </h3>
                                <div>{{ user.phone == "" ? "--" : user.phone }}

                                </div>
                            </el-col>
                            <el-col :xs="8" :sm="8" :md="6" :lg="6" style="text-align: center;">
                                <div class="tips">剩余4.0额度</div>
                                <h3>{{ user.quota }} 条</h3>

                            </el-col>
                            <el-col :xs="16" :sm="16" :md="6" :lg="6" style="text-align: center;">
                                <div class="tips">会员到期</div>
                                <h3>{{ user.expiry_date == "" ? "--" : formatDateByTimestamp2(user.expiry_date) }}</h3>
                            </el-col>
                        </el-row>


                    </div>

                    <!-- <el-button class="button" text>欢迎使用 字节点点AI系统</el-button> -->
                </div>
            </template>

            <el-row class="statistic">
                <el-col :xs="12" :sm="6" :md="6" :lg="6">
                    <el-statistic title="聊天次数" :value="user.qa_num">
                        <template #suffix>
                            <el-icon style="vertical-align: -0.125em">
                                <ChatLineRound />
                            </el-icon>
                        </template>
                    </el-statistic>
                </el-col>
                <el-col :xs="12" :sm="6" :md="6" :lg="6">
                    <el-statistic :value="user.qa_log_num">
                        <template #title>
                            <div style="display: inline-flex; align-items: center">
                                聊天记录数
                                <el-icon style="margin-left: 4px" :size="12">
                                    <Male />
                                </el-icon>
                            </div>
                        </template>
                    </el-statistic>
                </el-col>
                <el-col :xs="12" :sm="6" :md="6" :lg="6">
                    <el-statistic title="绘图次数" :value="user.draw_num" />
                </el-col>
                <el-col :xs="12" :sm="6" :md="6" :lg="6">
                    <el-statistic title="登录次数" :value="user.login_num">

                    </el-statistic>
                </el-col>
            </el-row>




        </el-card>


        <el-card class="box-card" shadow="never" style="margin: 30px 15px 55px 15px; max-width: calc(100vw - 30px);">
            <template #header>
                <div class="card-header">
                    <h3 style="margin:5px 20px;">充值记录</h3>
                </div>
            </template>

            <el-table :data="orderList" size="large" stripe style="width: 100%">
                <el-table-column fixed prop="name" label="套餐" width="100" />
                <!-- <el-table-column prop="genre" label="类型" /> -->
                <el-table-column prop="expiry_date" label="到期日期" width="150" :formatter="formatDate"  />
                <el-table-column prop="price" label="价格" width="80" />
                <el-table-column label="支付状态" width="100">
                    <template #default="scope">

                        <el-tag v-if="scope.row.pay_state == 2">已支付</el-tag>
                        <el-tag type="info" v-if="scope.row.pay_state == 1">未支付</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="quota" label="额度" width="100" />
                <el-table-column prop="residue" label="余额" width="100" />
                <el-table-column prop="pay_at" label="支付时间" width="150" :formatter="formatDate" />
                <el-table-column prop="created_at" label="创建时间" width="150" :formatter="formatDate" />
                <el-table-column  prop="order_no" label="订单号" width="150" show-overflow-tooltip />

            </el-table>

            <el-pagination v-show="orderList" small background layout="prev, pager, next" :total="dataTotal"
                :page-size="pageSize" class="mt-4" @current-change="sizeChange" v-model="page" />

        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { myOrder, getUserInfo } from '../http/api'
import { useGlobalStore } from '../store'
import { storeToRefs } from 'pinia'
import { formatDateByTimestamp ,formatDateByTimestamp2} from "../utils/DateTime";

const Global = useGlobalStore()
const { user} = storeToRefs(Global)


const orderList: any = reactive([])
const dataTotal = ref(0)
const pageSize = ref(10)
const page = ref(1)

//const user: any = reactive({})

onMounted(() => {

    // 获取用户实时资料
    loadUserInfo()

    // 加载聊天列表
    loadMyOrder()

});

const loadUserInfo = async () => {
    await getUserInfo().then(res => {
        if (res.data) {
            let data = res.data
            user.value.nickname = data.nickname
            user.value.avatar = data.avatar
            user.value.pkg_name = data.pkg_name
            user.value.expiry_date = data.expiry_date
            user.value.qa_num = data.qa_num
            user.value.quota = data.quota
            user.value.points = data.points
            user.value.status = data.status
            user.value.phone = data.phone
            user.value.login_num = data.login_num
            user.value.draw_num = data.draw_num
            user.value.qa_log_num = data.qa_log_num
          

        }
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}



const formatDate = (_row: any, _column: any, cellValue: string, _index: any) => {
    if (cellValue != "") {
        return formatDateByTimestamp(cellValue)
    } else {
        return '--'
    }
}

const sizeChange = (value: number) => {
    page.value = value
    loadMyOrder()
}


const loadMyOrder = async () => {
    orderList.splice(0, orderList.length);

    await myOrder({
        "page_size": pageSize.value,
        "page": page.value,
    }).then(res => {

        if (res.data) {
            let data: any = res.data
            dataTotal.value = res.ext.count
            data.forEach((item: any) => {
                orderList.push({
                    name: item.name,
                    order_no: item.order_no,
                    price: item.price,
                    old_price: item.old_price,
                    number_use: item.number_use,
                    pay_state: item.pay_state,
                    payment: item.payment,
                    pay_at: item.pay_at,
                    expiry_date: item.expiry_date,
                    created_at: item.created_at,
                    genre: item.genre,
                    transaction_id: item.transaction_id,
                    quota: item.quota,
                    residue: item.residue,
                })
            })
        }

    }).catch(error => {
        console.error(error);
    });
}


</script>


<style lang="scss" scoped>

@media only screen and (max-width: 576px) {
    .el-container ::v-deep .header-card{
        margin-bottom: 0;
    }
  .el-container ::v-deep .header-card .el-col {
    margin-bottom: 15px;

  }

  .el-container .main {
        height: calc(100vh - 60px);
        overflow: scroll;
        background-color: var(--el-color-info-light-9);
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
    margin: 20px 20px;
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

.quota {
    font-size: 14px;
    color: #888;
    margin-left: 20px;
}

.quota b {
    margin-left: 15px;
    font-size: 12px;
    color: #333;
}


.el-pagination {
    margin-top: 20px;
    text-align: center;
    justify-content: center;
}
</style>