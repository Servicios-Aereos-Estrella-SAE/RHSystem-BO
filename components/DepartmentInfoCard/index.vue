<template>
  <div class="box department-info-card">
    <div class="department-name">
      {{ `${department.departmentName}` }}
    </div>
    <div class="department-alias">
      {{ `Alias: ${department.departmentAlias || 'N/A'}` }}
    </div>
    <div class="department-status assist">
      {{ `Active: ${department.departmentActive ? 'Yes' : 'No'}` }}
    </div>
    <div class="box-tools-footer">
      <Button class="box-btn" @click="handlerClickOnDetail(department.departmentId)" label="See details" icon="pi-arrow-right" iconPos="right"  /> 
      <Button class="box-btn" @click="handlerClickOnEdit(department.departmentId)" label="Edit" icon="pi pi-pencil" iconPos="right"  /> 
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
  margin-top: 2px;
  margin-right: 2px;
  position: relative;
  
  .box-btn {
    padding: 10px;
    box-sizing: border-box;
    border-radius: 0.375rem;
    border: none;
    background-color: white;
    color: #303e67;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.4s;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    border: 1px solid #e3ebf6;
    text-decoration: none;
  }
  .department-name {
    text-align: left;
    font-weight: 500;
    border-radius: calc($radius / 2);
    box-sizing: border-box;
    padding: 1rem 2%;
  }
  .assist {
    font-size: 14px;
    color: $success;
    margin-bottom: 0.75rem;
    background-color: transparentize($color: $success, $amount: 0.95);
  }
  .department-code,
  .department-alias,
  .department-status {
    text-align: left;
    font-weight: 400;
    border-radius: calc($radius / 2);
    box-sizing: border-box;
    padding: 2%;
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