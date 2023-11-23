import { defineStore } from 'pinia'

export const global = defineStore("global", {
    state: () => {
        return {
            url: 'http://127.0.0.1:8000',
            apiUrl: 'http://127.0.0.1:8000/api',
            listSelect: 'bow',
            listKey: 0,
        };
    },
    actions: {
        //設置 Cookie：
        setCookie(name: string, value: string) {
            const date = new Date();

            // 取得台灣時間並加上 3 小時
            const taiwanTime = new Date(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Taipei' }).format(date));
            taiwanTime.setTime(taiwanTime.getTime() + 3 * 60 * 60 * 1000);

            const expires = "expires=" + taiwanTime.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";

            console.log(123);
            
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