// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    logged:false,
    user:{},
    usersCache:{}
  }),
})
