<template>
  <div class="box exception-request-info-card">
    <!-- Nombre del empleado -->
    <div class="property-row-title employee-name">
      {{ `${exceptionRequest?.exceptionType.exceptionTypeTypeName}` }}
    </div>

    <div v-if="exceptionRequest.employee" class="exception-request-details">
      <div class="property-row">
        <span>{{ $t('employee') }} {{ $t('name') }}</span>
        <span class="property-value">
          {{ exceptionRequest.employee.person?.personFirstname }}
          {{ exceptionRequest.employee.person?.personLastname }}
          {{ exceptionRequest.employee.person?.personSecondLastname }}</span>
      </div>

      <div class="property-row">
        <span>{{ $t('department') }}</span>
        <span class="property-value">{{ exceptionRequest.employee.department.departmentName }}</span>
      </div>

      <div class="property-row">
        <span>{{ $t('position') }}</span>
        <span class="property-value">{{ exceptionRequest.employee.position.positionName }}</span>
      </div>

      <div class="property-row">
        <span>{{ $t('requested_date') }}</span>
        <span class="property-value"> {{ calendarDay }}</span>
      </div>
    </div>
    <div class="role assist capitalize" v-if="exceptionRequest.exceptionRequestStatus === 'accepted'">
      {{ `${$t(exceptionRequest.exceptionRequestStatus)}` }}
    </div>
    <div class="role no-assist capitalize" v-if="exceptionRequest.exceptionRequestStatus === 'refused'">
      {{ `${$t(exceptionRequest.exceptionRequestStatus)}` }}
    </div>

    <div class="box-tools-footer" v-if="showEditButton && exceptionRequest.exceptionRequestStatus === 'pending'">
      <Button class="btn btn-block btn-text-black" @click="handlerClickOnEdit()">
        {{ $t('see_details') }}
        <svg class="feather feather-arrow-right" fill="none" stroke="#303e67" stroke-linecap="round"
          stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
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