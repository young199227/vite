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
});