<script setup>
import { onServerPrefetch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserListStore } from '../stores/userList'
const store = useUserListStore()
const { userList } = storeToRefs(store)
const { fetchUserList } = store
onServerPrefetch(async () => {
  await fetchUserList()
})
</script>

<template>
  <div>
    <div>
      <button @click="() => fetchUserList()">Fetch UserList</button>
    </div>
    <ul>
      <li v-for="item in userList" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>