<template>
  <div class="box employee-proceeding-file-info-card">
    <div class="flex align-items-end justify-content-center" :style="{ position: 'relative', height: '60px' }">
      <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"
        class="menu-top-right" />
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>
    <div class="proceeding-file-type-name">
      {{ `${employeeProceedingFile.proceedingFile.proceedingFileType.proceedingFileTypeName}` }}
    </div>
    <div class="proceeding-file-name">
      {{ `${employeeProceedingFile.proceedingFile.proceedingFileName}` }}
    </div>
    <div v-if="employeeProceedingFile.proceedingFile.proceedingFileExpirationAt" class="proceeding-file-date">
      {{ `${calendarDay}` }}
    </div>
    <div v-else class="proceeding-file-date">
      ---
    </div>
    <div v-if="employeeProceedingFile.proceedingFile.proceedingFileIdentify" class="proceeding-file-identify">
      {{ `${employeeProceedingFile.proceedingFile.proceedingFileIdentify}` }}
    </div>
    <div v-else class="proceeding-file-identify">
      ---
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import '/resources/styles/variables.scss';
  @import 'primeicons/primeicons.css';
  @import './style';
</style>