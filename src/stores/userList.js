import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { fetchUserList as _fetchUserList } from '@/api'

export const useUserListStore = defineStore('users', {
  state: () => ({
    userList: []
  }),
  actions: {
    async fetchUserList() {
      try {
        this.userList = await _fetchUserList()
        console.log('this.userList ', this.userList )
      } catch (error) {
        console.error(error)
        return error
      }
    }
  }
})
