<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// import { useMyGeneralStore } from './store/general';

//   const myGeneralStore = useMyGeneralStore()
//   const businessName = ref(myGeneralStore.activeSystemBusinessName)
//   const businessFavicon = ref(myGeneralStore.favicon)

//   useHead({
//     titleTemplate: (titleChunk: any) => {
//       return titleChunk ? `${businessName.value} | ${titleChunk}` : 'Business BackOffice';
//     },
//     link: [
//       { rel: 'icon', type: 'image/x-icon', href: businessFavicon.value }
//     ]
//   })
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