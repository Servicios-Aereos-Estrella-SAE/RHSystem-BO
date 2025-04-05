<template>
  <div class="employee-shift-change-info-form">
    <Toast />
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ isNewEmployeeShiftChange ? 'Add shift change' : 'Update shift change' }}
    </h1>
    <span>
      {{ selectedDate }}<br />
      {{ dateRestDayFrom }}
    </span>
    <div v-if="isReady" class="employee-shift-change-form">
      <div class="form-container">
        <div class="input-box">
          <label for="employeeShiftChangeChangeThisShift">
            Change this shift
          </label>
          <Checkbox v-model="employeeShiftChange.employeeShiftChangeChangeThisShift" binary
            :disabled="!isNewEmployeeShiftChange" />
        </div>
        <div v-if="isNewEmployeeShiftChange" class="input-box">
          <label for="change-type">
            Type
          </label>
          <Dropdown v-model="changeType" :options="changeTypesList" optionLabel="label" optionValue="value"
            placeholder="" filter class="w-full md:w-14rem" @update:model-value="handleTypeChange"
            :disabled="employeeShiftChange.employeeShiftChangeChangeThisShift" />
          <small class="p-error" v-if="submitted && !changeType">Change type is required.</small>
        </div>
        <div class="input-box">
          <div class="date-box-container">
            <label>Date to</label>
            <div v-if="!isNewEmployeeShiftChange" class="date-box">
              <InputText v-model="dateTo" readonly class="capitalize" />
            </div>
            <div v-if="!displayDateToCalendar && isNewEmployeeShiftChange" class="date-box">
              <InputText :value="getDate(employeeShiftChange.employeeShiftChangeDateTo)" readonly class="capitalize" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at" @click="handlerDisplayDateTo"
                :disabled="employeeShiftChange.employeeShiftChangeChangeThisShift">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <div v-if="displayDateToCalendar && isNewEmployeeShiftChange" class="date-box-controller">
              <Calendar v-if="displayDateToCalendar" dateFormat="yy-mm-dd"
                v-model.lazy="employeeShiftChange.employeeShiftChangeDateTo" placeholder="Select start date"
                :invalid="submitted && !employeeShiftChange.employeeShiftChangeDateTo" :minDate="startDateLimit"
                :disabled="employeeShiftChange.employeeShiftChangeChangeThisShift" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at"
                @click="handlerDisplayCloseDateTo" :disabled="employeeShiftChange.employeeShiftChangeChangeThisShift">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <small class="p-error" v-if="submitted && !employeeShiftChange.employeeShiftChangeDateTo">Date to
              is required.
            </small>
          </div>
        </div>
        <div v-if="!isPersonal" class="input-box">
          <label for="search">
            Employee To
          </label>
          <AutoComplete v-if="isNewEmployeeShiftChange" v-model="selectedEmployee"
            :optionLabel="() => `${selectedEmployee.employeeFirstName} ${selectedEmployee.employeeLastName}`"
            :suggestions="filteredEmployees" @complete="handlerSearchEmployee" @item-select="onEmployeeToSelect"
            :disabled="employeeShiftChange.employeeShiftChangeChangeThisShift">
            <template #option="employee">
              <div class="item-employee-filter-attendance-monitor">
                <div class="name">
                  {{ employee.option.employeeFirstName }}
                  {{ employee.option.employeeLastName }}
                </div>
                <div class="position-department">
                  {{ employee.option.department.departmentAlias || employee.option.department.departmentName }}
                  /
                  {{ employee.option.position.positionAlias || employee.option.position.positionName }}
                </div>
              </div>
            </template>
          </AutoComplete>
          <InputText v-else v-model="employeeToSelectedName" readonly />
          <small class="p-error" v-if="submitted && !employeeShiftChange.employeeIdTo">Employee to is required.</small>
        </div>
        <div class="input-box">
          <label for="shift">
            Day to
          </label>
          <InputText :value="dateRestDayTo" readonly class="capitalize" />
        </div>
        <div class="input-box">
          <label for="shift">
            Shift
          </label>
          <Dropdown v-model="employeeShiftChange.shiftIdTo" :options="shiftList" optionLabel="shiftName"
            optionValue="shiftId" placeholder="" filter class="w-full md:w-14rem" readonly
            :disabled="!employeeShiftChange.employeeShiftChangeChangeThisShift || !isNewEmployeeShiftChange" />
          <small class="p-error" v-if="submitted && !employeeShiftChange.shiftIdTo">Shift to is required.</small>
        </div>
        <div class="input-box">
          <label for="employeeShiftChangeNote">Note</label>
          <Textarea id="employeeShiftChangeNote" v-model="employeeShiftChange.employeeShiftChangeNote" rows="3"
            :disabled="!isNewEmployeeShiftChange" />
        </div>
        <div v-if="isNewEmployeeShiftChange" class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            Save
          </Button>
        </div>
      </div>

    </div>
    <div v-else class="loader">
      <ProgressSpinner />
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