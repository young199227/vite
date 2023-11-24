<script lang="ts" setup>
import { toggleDark } from "~/composables";
import { reactive, ref } from "vue";
import { global } from "../../composables/pinia";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
//全域變數用
const store = global();

//技能頁面轉換 按下時切換listSelect的值還有listKey++(++是為了讓app.vue的組件刷新時是完全新的)
function listSelectClick(skill: string) {
  store.listSelect = skill;
  store.listKey++;
}

//註冊表單
const registerFormVisible = ref(false);
const registerForm = reactive({
  name: "",
  password: "",
});

//註冊
function register() {
  //先關閉表單
  registerFormVisible.value = false;

  axios
    .post(store.apiUrl + "/register", registerForm)
    .then((response) => {
      console.log(response.data.message);
      alert(response.data.message);
      registerForm.name = "";
      registerForm.password = "";
      setTimeout(() => {
        location.reload();
      }, 3000);
    })
    .catch((error) => {
      console.error(error.response.data);
    });
}

//登入表單
const loginFormVisible = ref(false);
const loginForm = reactive({
  name: "",
  password: "",
});

//登入
function login() {
  //先關閉表單
  loginFormVisible.value = false;

  axios
    .post(store.apiUrl + "/login", loginForm)
    .then((response) => {
      alert(response.data.message);
      loginForm.name = "";
      loginForm.password = "";
      //存入skill_token
      store.setCookie("skill_token", response.data.data.skill_token);
      //然後用api在驗證一次
      store.checkSkillToken();
    })
    .catch((error) => {
      console.error(error.response.data);
    });
}

//登出
function logout() {
  axios
    .post(
      store.apiUrl + "/logout",
      {},
      {
        headers: {
          Authorization: "Bearer " + store.getCookie("skill_token"),
        },
      }
    )
    .then((response) => {
      store.deleteCookie("skill_token");
      location.reload();
    })
    .catch((error) => {
      console.error(error.response.data);
    });
}

//新增技能表單
const skillFormData = new FormData();
const image = ref(null);
const skillFormVisible = ref(false);
const skillForm = reactive({
  type: "",
  name: "",
  describe: "",
  sort: "",
});

//新增技能
function addSkill() {
  //先關閉表單
  skillFormVisible.value = false;

  skillFormData.append("type", skillForm.type);
  skillFormData.append("name", skillForm.name);
  skillFormData.append("describe", skillForm.describe);
  skillFormData.append("sort", skillForm.sort);

  axios
    .post(store.apiUrl + "/addSkill", skillFormData, {
      headers: {
        Authorization: "Bearer " + store.getCookie("skill_token"),
      },
    })
    .then((response) => {
      console.log(response.data.message);
      // alert(response.data.message);

      //刷新技能頁面
      listSelectClick(skillForm.type);

      skillForm.name = "";
      skillForm.type = "";
      skillForm.describe = "";
      skillForm.sort = "";
      image.value = null;
    })
    .catch((error) => {
      console.error(error.response.data);
    });
}

//選擇圖片的方法
const handleFileChange = (event: any) => {
  const file = event.target.files[0];

  if (file) {
    // Update the ref with the selected file
    image.value = file;

    // Append the file to FormData
    skillFormData.append("image", file);
    console.log("Selected file:", file);
  } else {
    // Handle the case where the user canceled file selection
    image.value = null;
    console.log("User canceled file selection");
  }
};
</script>

<template>
  <!-- head -->
  <el-menu class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <!-- log -->
    <el-menu-item index="1">
      <img
        style="width: 100px"
        src="/element-plus-logo.svg"
        alt="Element logo"
      />
    </el-menu-item>

    <!-- 技能選擇鈕 -->
    <el-sub-menu index="2">
      <template #title>祕法才能</template>
      <el-menu-item index="2-1" @click="listSelectClick('mag')">
        <img src="/img/黑魔島士.png" alt="Element logo" />
        黑魔導士
      </el-menu-item>
      <el-menu-item index="2-2" @click="listSelectClick('bow')">
        <img src="/img/狙擊手.png" alt="Element logo" />
        狙擊手
      </el-menu-item>
    </el-sub-menu>

    <!-- 黑暗版按鈕 -->
    <el-menu-item index="3" @click="toggleDark()">
      <button
        class="border-none w-full bg-transparent cursor-pointer"
        style="height: var(--ep-menu-item-height)"
      >
        <i inline-flex i="dark:ep-moon ep-sunny" />
      </button>
    </el-menu-item>

    <div class="flex-grow" />
    <!-- 右上的按鈕表 -->

    <el-sub-menu index="4">
      <el-menu-item
        v-if="!store.is_userAuth"
        index="4-1"
        @click="registerFormVisible = true"
        >註冊</el-menu-item
      >
      <el-menu-item
        v-if="!store.is_userAuth"
        index="4-2"
        @click="loginFormVisible = true"
        >登入</el-menu-item
      >
      <el-menu-item
        v-if="store.is_userAuth"
        index="4-3"
        @click="skillFormVisible = true"
        >新增技能</el-menu-item
      >
      <el-menu-item v-if="store.is_userAuth" index="4-4" @click="logout"
        >登出</el-menu-item
      >
    </el-sub-menu>
  </el-menu>

  <!-- 註冊表單 -->
  <el-dialog v-model="registerFormVisible" title="註冊" class="w-80">
    <el-form :model="registerForm">
      <el-form-item label="帳號">
        <el-input v-model="registerForm.name" />
      </el-form-item>
      <el-form-item label="密碼">
        <el-input
          v-model="registerForm.password"
          type="password"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="registerFormVisible = false">取消</el-button>
        <el-button type="primary" @click="register"> 註冊 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 登入表單 -->
  <el-dialog v-model="loginFormVisible" title="登入" class="w-80">
    <el-form :model="loginForm">
      <el-form-item label="帳號">
        <el-input v-model="loginForm.name" />
      </el-form-item>
      <el-form-item label="密碼">
        <el-input v-model="loginForm.password" type="password" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="loginFormVisible = false">取消</el-button>
        <el-button type="primary" @click="login"> 登入 </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 新增技能表單 -->
  <el-dialog v-model="skillFormVisible" title="新增技能" class="w-80">
    <el-form :model="skillForm">
      <el-form-item label="技能種類">
        <el-select
          v-model="skillForm.type"
          placeholder="選擇技能"
          style="width: 115px"
        >
          <el-option label="狙擊手" value="bow" />
          <el-option label="黑魔導士" value="mag" />
        </el-select>
      </el-form-item>
      <el-form-item label="技能名稱">
        <el-input v-model="skillForm.name" />
      </el-form-item>
      <el-form-item label="技能描述">
        <el-input
          v-model="skillForm.describe"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        />
      </el-form-item>
      <el-form-item label="排列順序">
        <el-input-number v-model="skillForm.sort" :min="1" :max="20" />
      </el-form-item>
      <el-form-item label="圖片上傳">
        <input type="file" @change="handleFileChange" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="skillFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addSkill"> 新增技能 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style>
.flex-grow {
  flex-grow: 1;
}
</style>
