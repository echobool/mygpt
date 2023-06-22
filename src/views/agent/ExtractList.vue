<template >
    <el-card class="box-card" shadow="never" style="margin: 30px 15px 55px 15px; max-width: calc(100vw - 30px);">
        <template #header>
            <div class="card-header">
                <h3 style="margin:5px 20px;">提现记录</h3>
            </div>
        </template>

        <el-table :data="ExtractList" size="large" stripe style="width: 100%">
                <el-table-column fixed prop="id" label="编号" width="80" />
                <el-table-column prop="real_name" label="姓名"/>
                <el-table-column prop="bank_name" label="银行" width="120"  show-overflow-tooltip/>
                <el-table-column prop="card_no" label="卡号" width="120"  show-overflow-tooltip />
                <el-table-column prop="amount" label="提现金额" />
                <el-table-column prop="status" label="状态" >
                    <template #default="scope">
                        <el-tag v-show="scope.row.status == 0" class="ml-2" type="info">未知</el-tag>
                        <el-tag v-show="scope.row.status == 1" effect="dark" class="ml-2">已打款</el-tag>
                        <el-tag v-show="scope.row.status == 2" type="warning" class="ml-2">申请中</el-tag>
                        <el-tag v-show="scope.row.status == 3" type="danger" class="ml-2">处理失败</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="pay_at" label="付款时间" width="150" :formatter="formatDate" />
                <el-table-column prop="created_at" label="创建时间" width="150" :formatter="formatDate" />

            </el-table>

            <el-pagination v-show="ExtractList" small background layout="prev, pager, next" :total="dataTotal"
                :page-size="pageSize" class="mt-4" @current-change="sizeChange" v-model="page" />

    </el-card>
</template>

<script setup lang="ts">
import { reactive, ref,  onMounted } from 'vue'
import { formatDateByTimestamp } from "../../utils/DateTime";
import { extractListApi } from '../../http/api'

const ExtractList: any = reactive([])
const dataTotal = ref(0)
const pageSize = ref(10)
const page = ref(1)

onMounted(() => {

    getExtractList()
});


const getExtractList = async () => {

    ExtractList.splice(0, ExtractList.length)
    await extractListApi({
        'page': page.value,
        'page_size': pageSize.value
    }).then(res => {
        if (res.data) {

            dataTotal.value = res.ext.count
            let data = res.data
            
            data.forEach((item: any) => {
                ExtractList.push({
                    id: item.id,
                    real_name: item.real_name,
                    bank_name: item.bank_name,
                    card_no: item.card_no,
                    status: item.status,
                    amount: item.amount,
                    fail_reason: item.fail_reason,
                    pay_at: item.pay_at,
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
    getExtractList()
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