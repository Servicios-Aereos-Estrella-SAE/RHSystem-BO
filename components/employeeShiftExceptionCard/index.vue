<template>
  <div class="box shift-exception-info-card">
    <div class="shift-name">
      {{ `${shiftException.exceptionType.exceptionTypeTypeName}` }}
    </div>
    <div class="shift-hours">
      {{ `${shiftException.shiftExceptionsDescription}` }}
    </div>
    <div class="shift-days">
      {{ `${calendarDay}` }}
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