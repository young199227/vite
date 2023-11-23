import { defineStore } from 'pinia'
import axios from "axios";

export const global = defineStore("global", {
    state: () => {
        return {
            url: 'http://127.0.0.1:8000',
            apiUrl: 'http://127.0.0.1:8000/api',
            listSelect: 'bow',
            listKey: 0,
            userName: '',
            is_userAuth: false,
        };
    },
    actions: {
        //檢查skill_token
        checkSkillToken() {
            if (this.getCookie("skill_token")) {
                axios
                    .post(
                        this.apiUrl + "/userAuth",
                        {},
                        {
                            headers: {
                                Authorization: "Bearer " + this.getCookie("skill_token"),
                            },
                        }
                    )
                    .then((response) => {
                        //如果通過驗證就把userName存入store.userName當作驗證if
                        this.userName = response.data.data.name;
                        this.is_userAuth = true;
                        console.log(this.userName + ":" + this.is_userAuth);
                    })
                    .catch((error) => {
                        //如果過不了驗證就刪除skill_token
                        this.deleteCookie("skill_token");
                        console.error(error.response.data);
                    });
            }
        },
        //設置 Cookie：
        setCookie(name: string, value: string) {
            const date = new Date();

            //時間為台灣時間+3小時
            date.setTime(date.getTime() + 11 * 60 * 60 * 1000);
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        },
        //讀取 Cookie：
        getCookie(name: string) {
            const cookieName = name + "=";
            const cookies = document.cookie.split(';');

            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.indexOf(cookieName) === 0) {
                    return cookie.substring(cookieName.length, cookie.length);
                }
            }
            return "";
        },
        //刪除 Cookie：
        deleteCookie(name: string) {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    },
});