<template>
  <div class="box proceeding-file-type-info-card">
    <div class="name">
      {{ `${proceedingFileType.proceedingFileTypeName || ''}`}}
    </div>
    <div class="line">
    </div>
    <div class="info capitalize">
      <strong>{{ `${proceedingFileType.proceedingFileTypeAreaToUse || ''}`}}</strong>
    </div>
    <div class="status assist">
      {{ `Active: ${proceedingFileType.proceedingFileTypeActive ? 'Yes' : 'No'}` }}
    </div>
    <div class="box-tools-footer">
      <Button v-if="canUpdate" icon="pi pi-pencil" class="box-btn" @click="handlerClickOnEdit()" />
      <Button v-if="canDelete" icon="pi pi-trash" class="box-btn btn-red" @click="handlerClickOnDelete()" />
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>