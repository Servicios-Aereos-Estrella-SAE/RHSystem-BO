<template>
  <div class="box employee-proceeding-file-info-card">
    <div class="flex align-items-end justify-content-center" :style="{ position: 'relative', height: '60px' }">
      <SpeedDial class="icon" :style="{ left: 0, bottom: 0 }" :model="items" direction="up-left" :transitionDelay="80" showIcon="pi pi-bars" hideIcon="pi pi-times" buttonClass="p-button-outlined"  type="quarter-circle"/>
    </div>
    <div class="proceeding-file-name">
      {{ `${employeeProceedingFile.proceedingFile.proceedingFileType.proceedingFileTypeName}` }}
    </div>
    <div class="proceeding-file-name">
      {{ `${employeeProceedingFile.proceedingFile.proceedingFileName}` }}
    </div>
    <div v-if="employeeProceedingFile.proceedingFile.proceedingFileIdentify" class="proceeding-file-name">
      {{ `${employeeProceedingFile.proceedingFile.proceedingFileIdentify}` }}
    </div>
    <div v-else class="proceeding-file-name">
      ---
    </div>

    <div class="box-tools-footer">
      <Button icon="pi pi-pencil" class="box-btn" @click="handlerClickOnEdit()"/>
      <Button icon="pi pi-trash" class="box-btn btn-red" @click="handlerClickOnDelete()"/>
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