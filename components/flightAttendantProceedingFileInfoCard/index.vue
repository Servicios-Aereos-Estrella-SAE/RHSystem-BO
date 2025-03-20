<template>
  <div class="box flight-attendant-proceeding-file-info-card">
    <div class="flex align-items-end justify-content-center" :style="{ position: 'relative', height: '60px' }">
      <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"
        class="menu-top-right" />
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>
    <div class="proceeding-file-type-name">
      {{ `${flightAttendantProceedingFile.proceedingFile.proceedingFileType.proceedingFileTypeName}` }}
    </div>
    <div class="proceeding-file-name">
      {{ `${flightAttendantProceedingFile.proceedingFile.proceedingFileName}` }}
    </div>
    <div v-if="flightAttendantProceedingFile.proceedingFile.proceedingFileExpirationAt" class="proceeding-file-date">
      {{ `${calendarDay}` }}
    </div>
    <div v-else class="proceeding-file-date">
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

  @import './style';
</style>