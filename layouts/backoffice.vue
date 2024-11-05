<template>
  <div>
    <transition name="page">
      <loader v-if="statusFullLoader" />
    </transition>
    <div v-if="authAccess">
      <dashboardHeader />
      <aside-menu />
      <div class="default-layout-wrapper">
        <div class="modules-wrapper">
          <div v-if="displayContent" class="modules-content-wrepper">
            <!-- <div class="box">
              <h1>Color mode: {{ $colorMode.value }}</h1>
              <select v-model="$colorMode.preference" @change="setcolor">
                <option value="system">System</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="sepia">Sepia</option>
              </select>
            </div> -->
            <slot />
          </div>
          <div v-else class="modules-content-wrepper">
            <div class="spinner-container">
              <ProgressSpinner class="custom-spinner" :style="{ color: 'red' }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Script from './assets/backoffice/script.ts'
  export default Script
</script>

<style lang="scss">
@import './assets/backoffice/style';
</style>