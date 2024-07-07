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
}

layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}
</style>