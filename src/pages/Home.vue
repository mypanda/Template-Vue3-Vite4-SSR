<template>
  <div>
    <h1>Home</h1>
    <p style="width: 100px;">
      <img src="@/assets/logo.svg" alt="logo" />
    </p>
    <button @click="state.count++">count is: {{ state.count }}</button>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const state = reactive({
  count: 0
})
</script>