<script setup lang="ts">
import { useLocalStorageValue } from './composables/useLocalStorageValue';

const random = () => Math.floor(Math.random() * 100);
const { value: randomValue } = useLocalStorageValue('my-value', random(), {syncTabs: true})
</script>

<template>
  <h1>Random value persistence</h1>
  <h2>{{ randomValue }}</h2>
  <button @click="randomValue = random()">Generate!</button>
</template>

<style scoped></style>
