<script setup lang="ts">
import {ref} from "vue";
import axios from 'axios';

//api值來源在pinia.ts傳入App.vue再傳入這裡
const api = defineProps<{ api: string }>();

const skillList = ref('');
const tableData = ref('');
function showSkill() {
  axios.get('http://127.0.0.1:8000/api/' + api.api)
      .then(response => {
        // 處理成功的回應
        console.log(response.data);
        skillList.value = response.data;
        tableData.value = response.data;
      })
      .catch(error => {
        // 處理錯誤
        console.error(error);
      });
}

const orderName = ref('');
const orderMoney = ref('');
function addSkill() {

  axios.post('http://127.0.0.1:8000/api/add', {
    'name': orderName.value,
    'money': orderMoney.value,
  }).then(response => {
    // 處理成功的回應
    console.log(response.data);
    showSkill();
  }).catch(error => {
    // 處理錯誤
    console.error(error.response.data.errors);
    alert(error.response.data.errors);
  });

}

//一進入先拿資料
showSkill();

//進入後先讀loading 0.5秒
const fullscreenLoading = ref(false);
fullscreenLoading.value = true
setTimeout(() => {
  fullscreenLoading.value = false
}, 500)


</script>

<template>
  <!--  <el-input v-model="orderName"/>-->
  <!--  <el-input v-model="orderMoney"/>-->
  <!--  <el-button v-on:click="add">新增</el-button>-->

  <!--  此span作用於loading-->
  <span v-loading.fullscreen.lock="fullscreenLoading"></span>

  <el-row justify="center">
    <el-col :md="18">
      <el-space direction="vertical" :fill="true" :size="13">
        <el-card class="box-card" shadow="never" v-for="item in skillList" :key="item.id">
          <template #header>
            <div class="card-header">
              <!--              <el-image style="width: 30px; height: 30px" src="/img/Gl8azUj.png"/>-->
              <br>
              <span>{{ item.name }}</span>
            </div>
          </template>
          <div class="multiline-text">{{ item.money }}</div>
        </el-card>
      </el-space>
    </el-col>
  </el-row>

  <!--  <el-table :data="tableData" border style="">-->
  <!--    <el-table-column prop="id" label="id" width=""/>-->
  <!--    <el-table-column prop="name" label="名稱" width=""/>-->
  <!--    <el-table-column prop="money" label="新增時間"/>-->
  <!--  </el-table>-->
</template>

<style>
.multiline-text {
  white-space: pre-line;
}
</style>
