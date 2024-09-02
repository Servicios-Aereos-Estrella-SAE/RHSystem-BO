<template>
  <div class="box user-info-card">
    <div class="avatar">
      <span v-html="holiday.holidayIcon"></span>
    </div>
    <div class="email">
    </div>
    <div class="name">
      {{ `${formatDate(holiday.holidayDate)}` }}
    </div>
    <div class="role assist capitalize">
      {{ `${holiday.holidayName}` }}
    </div>
    <div class="box-tools-footer">
      <Button v-if="canUpdate" icon="pi pi-pencil" severity="info" @click="handlerClickOnEdit()" />
      <Button v-if="canDelete" icon="pi pi-trash" severity="warning" @click="handlerClickOnDelete()" />
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';
</style>