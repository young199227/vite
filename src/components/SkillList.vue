<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { global } from "../../src/composables/pinia";
const store = global();

//api值來源在pinia.ts傳入App.vue再傳入這裡
const api = defineProps<{ api: string }>();

//讀取技能
const skillList = ref("");
function showSkill() {
  axios
    .get(store.apiUrl + "/show/" + api.api)
    .then((response) => {
      // 處理成功的回應
      console.log(response.data);
      skillList.value = response.data.data;

      fullscreenLoading.value = false;
    })
    .catch((error) => {
      // 處理錯誤
      console.error(error);
    });
}

//一進入先拿資料
showSkill();

//先loading(轉圈圈)
const fullscreenLoading = ref(true);
</script>

<template>

  <!--  此span作用於loading-->
  <span v-loading.fullscreen.lock="fullscreenLoading"></span>

  <!-- 技能顯示 -->
  <el-row justify="center">
    <el-col :md="18">
      <el-space direction="vertical" :fill="true" :size="13">
        <el-card
          class="box-card"
          shadow="never"
          v-for="item in skillList"
          :key="item.id"
        >
          <template #header>
            <div class="card-header">
              <el-image
                style="width: 30px; height: 30px"
                :src="store.url + item.img_url"
              />
              <br />
              <span>{{ item.name }}</span>
            </div>
          </template>
          <div class="multiline-text">{{ item.describe }}</div>
        </el-card>
      </el-space>
    </el-col>
  </el-row>

</template>

<style>
.multiline-text {
  white-space: pre-line;
}
</style>
