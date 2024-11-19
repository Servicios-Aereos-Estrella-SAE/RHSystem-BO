<template>
  <div class="user-info-card">
    <div class="name">
      {{ 
        `${employee.employeeFirstName || ''}` }} {{ `${employee.employeeLastName || ''}`
      }}
    </div>
    <div class="employee-number">
      {{ `Emp. ID: ${employee.employeeCode}` }}
    </div>
    <div class="info capitalize">
      {{ `${employee.department.departmentName || ''}`}}
    </div>
    <div class="info">
      {{ `${employee.position.positionName}` }}
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