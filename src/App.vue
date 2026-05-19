<script setup lang="ts">
import { ref } from 'vue'

const random = () => Math.floor(Math.random() * 100);

const randomValue = ref(random());
</script>

<template>
  <h1>Random value persistence</h1>
  <h2>{{ randomValue }}</h2>
  <button @click="randomValue = random()">Generate!</button>
</template>

<style scoped></style>
