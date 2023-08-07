<template >
    <el-card class="box-card" shadow="never" style="margin: 30px 15px 55px 15px; max-width: calc(100vw - 30px);">
        <template #header>
            <div class="card-header">
                <h3 style="margin:5px 20px;">收益记录</h3>
            </div>
        </template>

        <el-table :data="IncomeList" size="large" stripe style="width: 100%">
                <el-table-column fixed prop="id" label="编号" width="100" />
                <el-table-column prop="order_id" label="订单号" width="100" />
                <el-table-column prop="user_id" label="会员ID" width="100" />
                <el-table-column prop="pkg_name" label="套餐" width="150" />
                <el-table-column prop="price" label="价格" width="120" />
                <el-table-column prop="rebate" label="返佣比例" width="150" />
                <el-table-column prop="amount" label="返佣金额" width="150"/>
                <el-table-column prop="created_at" label="创建时间" width="150" :formatter="formatDate" />

            </el-table>

            <el-pagination v-show="orderList" small background layout="prev, pager, next" :total="dataTotal"
                :page-size="pageSize" class="mt-4" @current-change="sizeChange" v-model="page" />

    </el-card>
</template>

<script setup lang="ts">
import { reactive, ref,  onMounted } from 'vue'
import { formatDateByTimestamp } from "../../utils/DateTime";
import { Income } from '../../http/api'

const IncomeList: any = reactive([])
const orderList: any = reactive([])
const dataTotal = ref(0)
const pageSize = ref(10)
const page = ref(1)

onMounted(() => {

    getIncome()
});


const getIncome = async () => {

    IncomeList.splice(0, Income.length)
    await Income({
        'page': page.value,
        'page_size': pageSize.value
    }).then((res:any) => {
        if (res.data) {

            dataTotal.value = res.ext.count
            let data = res.data
            
            data.forEach((item: any) => {
                IncomeList.push({
                    id: item.id,
                    order_id: item.order_id,
                    user_id: item.user_id,
                    price: item.price,
                    pkg_name: item.pkg_name,
                    rebate: item.rebate,
                    amount: item.amount,
                    created_at: item.created_at,
                })
            })

        }
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}
const sizeChange = (value: number) => {
    page.value = value
    getIncome()
}

const formatDate = (_row: any, _column: any, cellValue: string, _index: any) => {
    if (cellValue != "") {
        return formatDateByTimestamp(cellValue)
    } else {
        return '--'
    }
}

</script>

<style lang="scss" scoped>
.col-income{
    color: #555;
    font-size: 14px;
    text-align: center;
    line-height: 200%;
    margin-bottom: 10px;
    background-color: #f2f2f2;
}
.col-income span{
    color: #aaa;
    display: inline-block;
    width: 50px;
    font-size: 12px;
}



.el-pagination {
    margin-top: 20px;
    text-align: center;
    justify-content: center;
}

</style>