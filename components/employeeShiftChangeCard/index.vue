<template>
  <div class="employee-shift-change-info-card">
    <div>
      <div class="employee-shift-change-name">
        <div v-if="employeeShiftChange.employeeIdFrom === employeeShiftChange.employeeIdTo">
          <div v-if="employeeShiftChange.employeeShiftChangeChangeThisShift === 1">
            Cover shift
          </div>
          <div v-else>
            Shift change personal
          </div>
        </div>
        <div v-else>
          Shift change with employee
        </div>
      </div>

      <div class="description">

        <div
          v-if="employeeShiftChange.employeeTo && employeeShiftChange.employeeShiftChangeChangeThisShift === 0 && (employeeShiftChange.employeeIdFrom !== employeeShiftChange.employeeIdTo)"
          class="employee">
          Change with
          {{ employeeShiftChange.employeeTo.employeeFirstName }}
          {{ employeeShiftChange.employeeTo.employeeLastName }}
        </div>

        <div v-if="employeeShiftChange.shiftTo && employeeShiftChange.employeeShiftChangeChangeThisShift === 0"
          class="employee-shift">
          {{ getFormattedDate(employeeShiftChange.employeeShiftChangeDateTo) }}
        </div>

        <div class="new-shift-tag">
          <Tag v-if="employeeShiftChange.employeeShiftChangeDateFromIsRestDay === 0"
            :value="employeeShiftChange.shiftFrom.shiftName" severity="secondary" />
          <Tag v-if="employeeShiftChange.employeeShiftChangeDateFromIsRestDay === 1" :value="'Rest Day'"
            severity="secondary" />
          <br v-if="!employeeShiftChange.shiftFrom.shiftName">
          <br v-if="!employeeShiftChange.shiftFrom.shiftName">
          <small v-if="!employeeShiftChange.shiftFrom.shiftName">
            {{ employeeShiftChange.shiftFrom.shiftName }}
          </small>
        </div>

        <div class="new-shift-tag" v-if="employeeShiftChange.employeeTo">
          <Tag v-if="employeeShiftChange.employeeShiftChangeDateToIsRestDay === 0"
            :value="employeeShiftChange.shiftTo.shiftName" severity="success" />
          <Tag v-if="employeeShiftChange.employeeShiftChangeDateToIsRestDay === 1" :value="'Rest Day'"
            severity="info" />
          <br v-if="!employeeShiftChange.shiftTo.shiftName">
          <br v-if="!employeeShiftChange.shiftTo.shiftName">
          <small v-if="!employeeShiftChange.shiftTo.shiftName">
            {{ employeeShiftChange.shiftTo.shiftName }}
          </small>
        </div>

        <div v-if="employeeShiftChange.employeeShiftChangeNote" class="notes">
          <p>
            <b>
              Notes:
            </b>
            {{ employeeShiftChange.employeeShiftChangeNote }}
          </p>
        </div>
      </div>

      <div class="box-tools-footer">
        <Button class="btn btn-block" @click="handlerClickOnEdit">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z"
              fill="#88a4bf" class="fill-212121 fill-303e67"></path>
          </svg>
        </Button>
        <Button v-if="canManageUserResponsible && canManageToPreviousDays" class="btn btn-block"
          @click="handlerClickOnDelete">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
              fill="#88a4bf" class="fill-212121 fill-303e67"></path>
          </svg>
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import '/resources/styles/variables.scss';

  @import './style';
</style>