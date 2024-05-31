<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
  useHead({
    titleTemplate: (titleChunk: any) => {
      return titleChunk ? `${titleChunk} - SAE RH` : 'SAE Recursos Humanos';
    }
  })
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(0.01rem);
}
</style>