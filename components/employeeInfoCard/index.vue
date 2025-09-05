<template>
  <div class="box user-info-card">
    <div class="employee-head">
      <div class="avatar" @click="onClickPhoto">
        <img v-if="employee.employeePhoto" :src="getEmployeePhoto" :alt="$t('employee_photo')" class="employee-photo" />
        <div v-else class="username-initial">
          {{ employeeInitial }}
        </div>
        <div v-if="canManageUserResponsible" class="icon">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z"
              fill="#88a4bf" class="fill-212121"></path>
          </svg>
        </div>
      </div>
      <div class="employee-head-info">
        <div class="name">
          {{ employeeName }}
        </div>
        <div class="employee-number">
          {{ `Emp. ID: ${employee.employeeCode}` }}
        </div>
        <div class="employee-email">
          {{ `${ $t('email') }: ${employee.employeeBusinessEmail || $t('not_assigned')}` }}
        </div>
      </div>
    </div>

    <div class="info">
      <div class="business-unit">
        {{ `${ $t('business_unit') }: ${employee.businessUnit?.businessUnitName || $t('not_assigned')}` }}
      </div>
      <div class="department">
        {{ `${employee.department.departmentName || ''}`}}
      </div>
      <div class="position">
        {{ `${employee.position.positionName}` }}
      </div>
    </div>

    <div class="box-tools-footer">
      <button class="btn btn-block" @click="handlerClickOnEdit">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
      </button>
      <button v-if="canManageShifts" class="btn btn-block" @click="handlerClickOnShifts">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.25 13.5h-4a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 1.5 0V12h3.25a.75.75 0 0 1 0 1.5ZM12 2C6.478 2 2 6.478 2 12s4.478 10 10 10 10-4.478 10-10S17.522 2 12 2Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
      </button>
      <button v-if="canUpdate && (canReadOnlyFiles || canManageFiles)" id="btn-procceding-files" class="btn btn-block"
        @click="handlerOpenProceedingFiles">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 6.25A2.25 2.25 0 0 1 4.25 4h3.956a2.25 2.25 0 0 1 1.438.52l2.381 1.98h5.725A2.25 2.25 0 0 1 20 8.75v.752H6.422a2.25 2.25 0 0 0-2.183 1.705l-1.923 7.7c.043-.171 0 .005 0 0a2.24 2.24 0 0 1-.32-1.158L2 6.25Z"
            fill="#88a4bf" class="fill-212121"></path>
          <path
            d="M3.745 19.379A.5.5 0 0 0 4.23 20h14.24a1.75 1.75 0 0 0 1.698-1.326l1.763-7.05a.5.5 0 0 0-.485-.622H6.422a.75.75 0 0 0-.728.568L3.745 19.38Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
      </button>
      <button v-if="canDelete && !employee.deletedAt && canManageUserResponsible" class="btn btn-block"
        @click="handlerClickOnDelete">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
      </button>
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