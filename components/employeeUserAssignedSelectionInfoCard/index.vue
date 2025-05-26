<template>
  <div class="employee-user-assigned-info-card">
    <div class="user-head">
      <div class="avatar">
        <img v-if="getPhoto" :src="getPhoto" alt="Employee Photo" class="employee-photo" />
        <div v-else class="username-initial">
          {{ employeeInitial }}
        </div>
        <div class="icon">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z"
              fill="#88a4bf" class="fill-212121"></path>
          </svg>
        </div>
      </div>
      <div v-if="employee && employee.person" class="user-employee-data">
        <div class="name capitalize">
          {{ employeeName }}
        </div>
        <div v-if="employee.person.user" class="email">
          {{ `${employee.person.user.userEmail}`.toLocaleLowerCase() }}
        </div>
        <div v-if="employee.person.user" class="rol capitalize">
          {{ `${employee.person.user.role.roleName || ''}`.toLocaleLowerCase() }}
        </div>
        <div v-if="employee.person.user" class="status capitalize">
          <div class="dot" :class="{ active: !!employee.person.user.userActive }"></div>
          {{ employee.person.user.userActive ? 'Active' : 'Inactive' }} User Access
        </div>

      </div>
    </div>

    <div class="info">
      <div class="employee-code">
        {{ `Employee ID ${getEmployeeNumber || 'Not specified'}` }}
      </div>
      <div class="department capitalize">
        {{ getDepartment || 'Department not specified' }}
      </div>
      <div class="position capitalize">
        {{ getPosition || 'Position not specified' }}
      </div>
    </div>
    <div v-if="canManageAssignedEdit" class="box-tools-footer">
      <Checkbox v-model="employee.userResponsibleEmployeeChecked" binary />
      <label for="userResponsibleEmployeeChecked"> Select </label>

      <Checkbox v-model="employee.userResponsibleEmployeeReadonly" name="userResponsibleEmployeeReadonly" binary />
      <label for="userResponsibleEmployeeReadonly"> Readonly </label>

      <Checkbox v-model="employee.userResponsibleEmployeeDirectBoss" name="userResponsibleEmployeeDirectBoss" binary />
      <label for="userResponsibleEmployeeDirectBoss"> Direct Boss </label>
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