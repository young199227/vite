<template>
  <el-config-provider namespace="ep">
    <BaseHeader/>
    <br>
    <!--:key會在按祕法按鈕時值++(0->1)然後讓List這個元件刷新-->
    <List :api="store.listSelect" :key="store.listKey"/>

  </el-config-provider>
</template>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
}
</style>
<script setup lang="ts">
import {global} from "../src/composables/pinia";

const store = global();
</script>