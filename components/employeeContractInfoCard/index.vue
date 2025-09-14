<template>
  <div class="employee-contract-info-card">
    <div>
      <div v-if="employeeContract.employeeContractType" class="employee-contract-type">
        <div class="capitalize">
          {{ $t('type') }}:
          {{ getTypeName }}
        </div>
      </div>
      <div v-if="employeeContract.payrollBusinessUnit" class="business-unit">
        <div class="capitalize ellipsis">
          {{ $t('payroll_business_unit') }}:
          {{ employeeContract.payrollBusinessUnit.businessUnitName }}
        </div>
      </div>
      <div class="employee-contract-folio">
        <div>
          {{ $t('document_folio') }}:
          {{ employeeContract.employeeContractFolio }}
        </div>
      </div>
      <div v-if="employeeContract.department" class="department">
        <div class="capitalize ellipsis">
          {{ $t('department') }}:
          {{ employeeContract.department.departmentName }}
        </div>
      </div>
      <div v-if="employeeContract.position" class="position">
        <div class="capitalize ellipsis">
          {{ $t('position') }}:
          {{ employeeContract.position.positionName }}
        </div>
      </div>
      <div class="employee-contract-salary">
        <div class="capitalize">
          {{ $t('monthly_net_salary') }}:
          $ {{ currencyFormat(employeeContract.employeeContractMonthlyNetSalary) }}
        </div>
      </div>
      <br>
      <div class="employee-contract-status">
        <div class="capitalize">
          {{ $t('status') }}:
          {{ $t(employeeContract.employeeContractStatus.toLocaleLowerCase()) }}
        </div>
      </div>
      <br>
      <div class="attached-file" :class="{ active: !!(employeeContract.employeeContractFile) }" @click="openFile">
        <div class="icon">
          <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M33 12v23c0 4.42-3.58 8-8 8s-8-3.58-8-8V10c0-2.76 2.24-5 5-5s5 2.24 5 5v21a2 2 0 1 1-4 0V12h-3v19c0 2.76 2.24 5 5 5s5-2.24 5-5V10c0-4.42-3.58-8-8-8s-8 3.58-8 8v25c0 6.08 4.93 11 11 11s11-4.92 11-11V12h-3z"
              fill="#88a4bf" class="fill-000000"></path>
            <path d="M0 0h48v48H0z" fill="none"></path>
          </svg>
        </div>
        <small>
          {{ employeeContract.employeeContractFile ? $t('open_attached_file') : $t('not_file_attached') }}
        </small>
      </div>


      <div v-if="employeeContract.employeeContractStartDate" class="period-applied">
        <div class="period-applied-date">
          <div class="icon">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M21 8.5v9.25A3.25 3.25 0 0 1 17.75 21H6.25A3.25 3.25 0 0 1 3 17.75V8.5h18ZM7.25 15a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM12 15a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm-4.75-4.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm4.75 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm4.75 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm1-7.5A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5Z"
                fill="#88a4bf" class="fill-212121"></path>
            </svg>
          </div>
          {{ getDate(employeeContract.employeeContractStartDate) }}
        </div>
        <div class="period-applied-date">
          <div class="icon">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 8.5v9.25A3.25 3.25 0 0 0 6.25 21h11.5A3.25 3.25 0 0 0 21 17.75V8.5H3ZM16.75 15a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 15a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm4.75-4.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm-4.75 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm-4.75 0a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm-1-7.5A3.25 3.25 0 0 0 3 6.25V7h18v-.75A3.25 3.25 0 0 0 17.75 3H6.25Z"
                fill="#88a4bf" class="fill-212121"></path>
            </svg>
          </div>
          {{ employeeContract.employeeContractEndDate ? getDate(employeeContract.employeeContractEndDate) : '---' }}
        </div>
      </div>
    </div>
    <div class="status capitalize">
      <div class="dot" :class="{ active: !!employeeContract.employeeContractActive }"></div>
      {{ employeeContract.employeeContractActive ? $t('active') : $t('inactive')}}
    </div>

    <div v-if="!isDeleted" class="box-tools-footer">
      <Button class="btn btn-block" @click="handlerClickOnEdit">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z"
            fill="#88a4bf" class="fill-212121 fill-303e67"></path>
        </svg>
      </Button>
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