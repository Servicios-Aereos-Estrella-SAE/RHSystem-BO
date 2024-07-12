<template>
  <div class="dashboard-page">
    <Toast />
    <Head>
      <Title>
        Employee Attendance Monitor
      </Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div v-if="employee" class="dashboard-wrapper">
        <div class="box head-page">
          <div class="employee-wrapper">
            <div class="avatar">
              <svg viewBox="0 0 500 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M415.762 346.214c-19.078-24.896-42.156-41.063-75.223-50.236l-30.983 108.475c0 9.992-8.181 18.172-18.172 18.172-9.988 0-18.169-8.18-18.169-18.172v-86.311c0-12.536-10.178-22.715-22.715-22.715-12.536 0-22.713 10.179-22.713 22.715v86.311c0 9.992-8.181 18.172-18.17 18.172-9.992 0-18.173-8.18-18.173-18.172l-30.983-108.475c-33.068 9.262-56.145 25.34-75.221 50.236-7.542 9.812-11.64 29.527-11.908 40.07.09 2.725 0 5.906 0 9.082v36.345c0 20.078 16.264 36.34 36.343 36.34h281.648c20.078 0 36.345-16.262 36.345-36.34v-36.345c0-3.176-.089-6.357 0-9.082-.275-10.543-4.368-30.259-11.906-40.07zm-260.66-218.141c0 53.059 33.078 131.013 95.398 131.013 61.237 0 95.396-77.954 95.396-131.013 0-53.057-42.702-96.124-95.396-96.124s-95.398 43.067-95.398 96.124z" fill="#87a4bf" fill-rule="evenodd" class="fill-010101"></path></svg>
            </div>
            <h1 class="capitalize">
              {{ `${employee.employeeFirstName || ''}`.toLocaleLowerCase() }}
              {{ `${employee.employeeLastName || ''}`.toLocaleLowerCase() }}
              <span class="name-emp-code">
                ( Emp. Code: {{ employee.employeeCode }} )
              </span>
              <small>
                {{ employee.department.departmentAlias || employee.department.departmentName }}
                /
                {{ employee.position.positionAlias || employee.position.positionName }}
              </small>
              <small class="emp-code">
                Emp. Code: {{ employee.employeeCode }}
              </small>
            </h1>
          </div>
          <div></div>
          <div class="input-box">
            <label for="employees">
              Employee
            </label>
            <AutoComplete
              v-model="selectedEmployee"
              :optionLabel="() => `${selectedEmployee.employeeFirstName} ${selectedEmployee.employeeLastName}`"
              :suggestions="filteredEmployees"
              @complete="handlerSearchEmployee"
              @item-select="onEmployeeSelect"
            >
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
          </div>
          <div v-if="visualizationMode" class="input-box">
            <label for="departments">
              Visualization mode
            </label>
            <SelectButton
              v-model="visualizationMode"
              :options="visualizationModeOptions"
              dataKey="value"
              optionLabel="name"
              aria-labelledby="basic"
              optionDisabled="selected"
              @change="handlerVisualizationModeChange"
            />
          </div>
          <div v-if="visualizationMode" class="input-box">
            <label for="departments">
              Period
            </label>
            <Calendar
              v-model="periodSelected"
              :view="visualizationMode.calendar_format.mode"
              :dateFormat="visualizationMode.calendar_format.format"
              :minDate="minDate"
              :maxDate="maxDate"
              showWeek
              @update:modelValue="handlerPeriodChange"
            />
          </div>
          <div v-if="visualizationMode" class="input-box">
            <Button class="btn-excel btn-block" severity="success" @click="getExcel">
              <svg viewBox="0 0 20 20" xmlns="
            http://www.w3.org/2000/svg">
                <path
                  d="M0 2C0 .9.9 0 2 0h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm14 12h4V2H2v12h4c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2zM9 8V5h2v3h3l-4 4-4-4h3z"
                  fill="#ffffff" class="fill-000000"></path>
              </svg>
            </Button>
          </div>
        </div>
        <div v-if="employeeCalendar.length > 0" class="general-graphs">
          <div class="box">
            <div class="pay-chart">
              <h2>
                General behavior into period
              </h2>
              <highchart :options="generalData" style="width: 100%;" />
            </div>
            <div class="indicators">
              <attendanceInfoCard
                :hideLink="true"
                :hidePositionTitle="true"
                :onTimePercentage="onTimePercentage"
                :onToleracePercentage="onTolerancePercentage"
                :onDelayPercentage="onDelayPercentage"
                :onFaultPercentage="onFaultPercentage"
              />
            </div>
          </div>
          <div v-if="visualizationMode" class="box report-wrapper">
            <div class="head">
              <h2>
                {{ calendarTitle }}
              </h2>
            </div>
            <div class="days-wrapper">
              <div v-for="(calendarDay, index) in employeeCalendar" :key="`key-calendar-day-${Math.random()}-${index}`">
                <attendanceCalendarDay
                  :checkAssist="calendarDay"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="box">
          <div class="empty">
            Empty assist list to display data.
            <br>
            Select other date range in Weekly visualization mode
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
@import './style';
</style>

<style lang="scss">
:deep(.graph-label) {
  color: red;
}

.graph-label {
  color: red;
}
</style>