import { defineStore } from 'pinia'

export const global = defineStore("global", {
    state: () => {
        return {
            listSelect: 'show',
            listKey: 0,
        };
    },
});