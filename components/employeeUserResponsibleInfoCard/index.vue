<template>
  <div class="employee-user-responsible-info-card">
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
      <div class="user-employee-data">
        <div class="name capitalize">
          {{ employeeName }}
        </div>
        <div class="email">
          {{ `${userResponsibleEmployee.user.userEmail}`.toLocaleLowerCase() }}
        </div>
        <div class="rol capitalize">
          {{ `${userResponsibleEmployee.user.role.roleName || ''}`.toLocaleLowerCase() }}
        </div>
        <div class="status capitalize">
          <div class="dot" :class="{ active: !!userResponsibleEmployee.user.userActive }"></div>
          {{ userResponsibleEmployee.user.userActive ? 'Active' : 'Inactive' }} User Access
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
    <div v-if="!isDeleted" class="box-tools-footer">
      <Button class="btn btn-block" @click="handlerClickOnDelete">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
            fill="#88a4bf" class="fill-212121 fill-303e67"></path>
        </svg>
      </Button>
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