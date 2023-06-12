<template>
    <div class="el-container" style="max-width: 998px; margin: 0 auto;">
        <el-card class="box-card" shadow="never" style="margin: 30px 15px 15px 15px; max-width: calc(100vw - 30px);">
            <template #header>
                <div class="card-header">
                    <div class="header-card">
                        <el-row :gutter="20">
                            <el-col :xs="9" :sm="9" :md="3" :lg="3">
                                <el-avatar size="large" src="../public/img/avatar1.svg" />
                            </el-col>
                            <el-col :xs="15" :sm="15" :md="8" :lg="8">
                                <h3>{{ user.nickname }}<span class="quota">额度 <b>{{ user.quota }}</b></span> </h3>
                                <div>{{ user.phone == "" ? "--" : user.phone }}
                                
                                </div>
                            </el-col>
                            <el-col :xs="9" :sm="9" :md="6" :lg="6" style="text-align: center;">
                                <div class="tips">会员等级</div>
                                <h3>{{ user.pkg_name == "" ? "无" : user.pkg_name }}</h3>

                            </el-col>
                            <el-col :xs="15" :sm="15" :md="6" :lg="6" style="text-align: center;">
                                <div class="tips">过期时间</div>
                                <h3>{{ user.expiry_date == "" ? "--" : formatDateByTimestamp(user.expiry_date) }}</h3>
                            </el-col>
                        </el-row>


                    </div>

                    <!-- <el-button class="button" text>欢迎使用 字节点点AI系统</el-button> -->
                </div>
            </template>

            <el-row class="statistic">
                <el-col :xs="12" :sm="6" :md="6" :lg="6">
                    <el-statistic title="聊天次数" :value=" user.qa_num ">
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
                <el-table-column fixed prop="order_no" label="订单号" width="250" />
                <el-table-column prop="name" label="套餐" width="100" />
                <!-- <el-table-column prop="genre" label="类型" /> -->
                <el-table-column prop="expiry_date" label="时长(天)" width="100" />
                <el-table-column prop="price" label="价格" width="100" />
                <el-table-column label="支付状态" width="100">
                    <template #default="scope">

                        <el-tag v-if="scope.row.pay_state == 2">已支付</el-tag>
                        <el-tag type="info" v-if="scope.row.pay_state == 1">未支付</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="number_use" label="额度" width="100" />
                <el-table-column prop="pay_at" label="支付时间" width="150" :formatter="formatDate" />
                <el-table-column prop="created_at" label="创建时间" width="150" :formatter="formatDate" />

            </el-table>

            <el-pagination v-show="orderList" small background layout="prev, pager, next" :total="dataTotal"
                :page-size="pageSize" class="mt-4" @current-change="sizeChange" v-model="page" />

        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref,  onMounted } from 'vue'
import { myOrder, getUserInfo } from '../http/api'
import { formatDateByTimestamp } from "../utils/DateTime";

const orderList: any = reactive([])
const dataTotal = ref(0)
const pageSize = ref(10)
const page = ref(1)

const user: any = reactive({})

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
            user.nickname = data.nickname
            user.pkg_name = data.pkg_name
            user.expiry_date = data.expiry_date
            user.qa_num = data.qa_num
            user.quota = data.quota
            user.points = data.points
            user.status = data.status
            user.phone = data.phone
            user.login_num = data.login_num
            user.draw_num = data.draw_num
            user.qa_log_num = data.qa_log_num

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
                })
            })
        }

    }).catch(error => {
        console.error(error);
    });
}


</script>


<style lang="scss" scoped>
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

.quota{
    font-size: 14px;
    color: #888;
    margin-left: 20px;
}
.quota b {
    margin-left: 15px;
    font-size: 18px;
    color: #333;
}


.el-pagination {
    margin-top: 20px;
    text-align: center;
    justify-content: center;
}
</style>