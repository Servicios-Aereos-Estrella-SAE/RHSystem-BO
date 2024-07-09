<template>
  <div class="box department-info-card">
    <div class="department-name">
      {{ `${department.departmentName}` }}
    </div>
    <div class="department-alias">
      {{ `Alias: ${department.departmentAlias || 'N/A'}` }}
    </div>
    <div class="department-status">
      {{ `Active: ${department.departmentActive ? 'Yes' : 'No'}` }}
    </div>
    <div class="box-tools-footer">
      <Button icon="pi pi-info" severity="primary" @click="handlerClickOnDetail()" />
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

.department-info-card {
  margin-top: 2.25rem;
  margin-right: 1rem;
  position: relative;

  .department-name {
    text-align: center;
    font-weight: 500;
    border-radius: calc($radius / 2);
    box-sizing: border-box;
    padding: 1rem;
  }

  .department-code,
  .department-alias,
  .department-status {
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