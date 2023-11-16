<script lang="ts" setup>
import {toggleDark} from "~/composables";
import {global} from "../../composables/pinia";
const store = global();

//按下時切換listSelect的值還有listKey++
function listSelectClick(skill: string) {
  store.listSelect = skill;
  store.listKey++;
}
</script>

<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-sub-menu index="1">
      <template #title>祕法才能{{ store.listSelect }}{{store.listKey}}</template>
      <el-menu-item index="1-1" @click="listSelectClick('mag')">黑魔導士
      </el-menu-item>
      <el-menu-item index="1-2" @click="listSelectClick('show')">狙擊手</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="2">新增</el-menu-item>

    <el-menu-item h="full" @click="toggleDark()">
      <button
          class="border-none w-full bg-transparent cursor-pointer"
          style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny"/>
      </button>
    </el-menu-item>
  </el-menu>
</template>
