<template>
  <div class="box shift-info-card">
    <div class="shift-name">
      {{ `${shift.shiftName}` }}
    </div>
    <div class="shift-time">
      {{ `Start: ${shift.shiftTimeStart}` }}
    </div>
    <div class="shift-hours">
      {{ `Hours active: ${shift.shiftActiveHours}` }}
    </div>
    <div class="shift-days">
      {{ `Holidays: ${shift.shiftRestDays}` }}
    </div>
    <div class="box-tools-footer">
      <Button icon="pi pi-pencil" severity="primary" @click="handlerClickOnEdit()"/>
      <Button icon="pi pi-trash" severity="danger" @click="handlerClickOnDelete()"/>
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

.shift-info-card {
  margin-top: 2.25rem;
  position: relative;

  .shift-name {
    text-align: center;
    font-weight: 500;
    border-radius: calc($radius / 2);
    box-sizing: border-box;
    padding: 1rem;
  }

  .shift-time, .shift-hours, .shift-days {
    text-align: left;
    font-weight: 400;
    border-radius: calc($radius / 2);
    box-sizing: border-box;
    padding: 1rem;
  }

  .box-tools-footer {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;

    button {
      width: 100%;
    }
  }
}
</style>
