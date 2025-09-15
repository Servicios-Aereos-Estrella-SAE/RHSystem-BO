<template>
  <div class="employee-shift-change-info-form">
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ isNewEmployeeShiftChange ? $t('add_shift_change') : $t('update_shift_change') }}
    </h1>
    <div class="selected-day">
      <span class="selected-day-date">{{ selectedDate }}</span>
      <span class="selected-day-type">
        <Tag severity="secondary" :value="dateRestDayFrom" />
      </span>
    </div>
    <div v-if="isReady" class="employee-shift-change-form">
      <div class="form-container">
        <div class="checkbox-group">
          <Checkbox v-model="employeeShiftChange.employeeShiftChangeChangeThisShift" binary
            :disabled="!isNewEmployeeShiftChange || !canManageUserResponsible" />
          <label>
            {{ $t('cover_shift') }}
          </label>
        </div>
        <div v-if="isNewEmployeeShiftChange" class="input-box">
          <label for="change-type">
            {{ $t('type') }}
          </label>
          <Dropdown v-model="changeType" :options="getChangeTypesList" optionLabel="label" optionValue="value"
            placeholder="" filter class="w-full md:w-14rem" @update:model-value="handleTypeChange"
            :disabled="!canManageUserResponsible" />
          <small class=" p-error" v-if="submitted && !changeType">{{ $t('type') }} {{ $t('is_required') }}</small>
        </div>
        <div class="input-box">
          <div class="date-box-container">
            <label>{{ $t('date_to') }}</label>
            <div v-if="!isNewEmployeeShiftChange" class="date-box">
              <InputText v-model="dateTo" class="capitalize"
                :disabled="!isNewEmployeeShiftChange|| !canManageUserResponsible" />
            </div>
            <div v-if="!displayDateToCalendar && isNewEmployeeShiftChange" class="date-box">
              <InputText :value="getDate(employeeShiftChange.employeeShiftChangeDateTo)" readonly class="capitalize"
                :disabled="!canManageUserResponsible" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at" @click="handlerDisplayDateTo"
                :disabled="employeeShiftChange.employeeShiftChangeChangeThisShift || !canManageUserResponsible || !canUseCalendar">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <div v-if="displayDateToCalendar && isNewEmployeeShiftChange" class="date-box-controller">
              <Calendar v-if="displayDateToCalendar" dateFormat="yy-mm-dd"
                v-model.lazy="employeeShiftChange.employeeShiftChangeDateTo" :placeholder="$t('select_start_date')"
                :invalid="submitted && !employeeShiftChange.employeeShiftChangeDateTo" :minDate="startDateLimit"
                :disabled="employeeShiftChange.employeeShiftChangeChangeThisShift || !canManageUserResponsible" />
              <Button type="button" class="btn btn-block" id="display-input-expiration-at"
                @click="handlerDisplayCloseDateTo" :disabled="employeeShiftChange.employeeShiftChangeChangeThisShift">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </Button>
            </div>
            <small class="p-error" v-if="submitted && !employeeShiftChange.employeeShiftChangeDateTo">{{ $t('date_to')
              }}
              {{ $t('is_required') }}
            </small>
          </div>
        </div>
        <div v-if="!isPersonal" class="input-box">
          <label for="search">
            {{ $t('employee_to') }}
          </label>
          <AutoComplete v-if="isNewEmployeeShiftChange" v-model="selectedEmployee"
            :optionLabel="() => `${selectedEmployee.person?.personFirstname || ''} ${selectedEmployee.person?.personLastname || ''} ${selectedEmployee.person?.personSecondLastname || ''}`"
            :suggestions="filteredEmployees" @complete="handlerSearchEmployee" @item-select="onEmployeeToSelect"
            class="uppercase" :disabled="!canManageUserResponsible">
            <template #option="employee">
              <div class="item-employee-filter-attendance-monitor">
                <div class="name uppercase">
                  {{ employee.option.person?.personFirstname }}
                  {{ employee.option.person?.personLastname }}
                  {{ employee.option.person?.personSecondLastname }}
                </div>
                <div class="position-department">
                  {{ employee.option.department.departmentAlias || employee.option.department.departmentName }}
                  /
                  {{ employee.option.position.positionAlias || employee.option.position.positionName }}
                </div>
              </div>
            </template>
          </AutoComplete>
          <InputText v-else v-model="employeeToSelectedName" readonly class="uppercase"
            :disabled="!isNewEmployeeShiftChange|| !canManageUserResponsible" />
          <small class="p-error" v-if="submitted && !employeeShiftChange.employeeIdTo">{{ $t('employee_to') }} {{
            $t('is_required') }}</small>
        </div>
        <div class="input-box">
          <label for="shift">
            {{ $t('day_to') }}
          </label>
          <InputText :value="dateRestDayTo" class="capitalize"
            :disabled="!isNewEmployeeShiftChange|| !canManageUserResponsible" />
        </div>
        <div class="input-box">
          <label for="shift">
            {{ $t('shift_to') }}
          </label>
          <Dropdown v-model="employeeShiftChange.shiftIdTo" :options="shiftList" optionLabel="shiftName"
            optionValue="shiftId" placeholder="" filter class="w-full md:w-14rem" readonly
            :disabled="!employeeShiftChange.employeeShiftChangeChangeThisShift || !isNewEmployeeShiftChange || !canManageUserResponsible" />
          <small class="p-error" v-if="submitted && !employeeShiftChange.shiftIdTo">{{ $t('shift_to') }} {{
            $t('is_required')
            }}</small>
        </div>
        <div v-if="isNewEmployeeShiftChange" class="input-box">
          <button v-if="canCreateShift" class="btn" @click="addNewShift">
            <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
            {{ $t('create_shift') }}
          </button>
        </div>
        <div class="input-box">
          <label for="employeeShiftChangeNote">{{ $t('note') }}</label>
          <Textarea id="employeeShiftChangeNote" v-model="employeeShiftChange.employeeShiftChangeNote" rows="3"
            :disabled="!isNewEmployeeShiftChange|| !canManageUserResponsible" />
        </div>
        <div v-if="isNewEmployeeShiftChange && canManageUserResponsible" class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            {{ $t('save') }}
          </Button>
        </div>
      </div>

    </div>
    <div v-else class="loader">
      <ProgressSpinner />
    </div>
    <Sidebar v-model:visible="drawerShiftForm" header="Shift form" position="right" class="shift-form-sidebar"
      :showCloseIcon="true">
      <shiftInfoForm :shift="shiftTemp" @onShiftSave="onSaveShift" />
    </Sidebar>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';

  .shift-form-sidebar {
    width: 100% !important;
    max-width: 25rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>