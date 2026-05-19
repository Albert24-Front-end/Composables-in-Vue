<script setup lang="ts">
import { ref } from "vue";
import { useLocalStorageValue } from "./composables/useLocalStorageValue";

const storageKey = ref("my-value");
const random = () => Math.floor(Math.random() * 100);
const { value: randomValue } = useLocalStorageValue(storageKey, random(), {
  syncTabs: true,
});
</script>

<template>
  <div class="container">
    <h1>Random value persistence</h1>
    <h2>Value: {{ randomValue }}</h2>
    <p class="field">Key: <input type="text" v-model="storageKey" /></p>
    <button @click="randomValue = random()">Generate!</button>
  </div>
</template>

<style scoped></style>
