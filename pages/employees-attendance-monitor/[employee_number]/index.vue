<template>
  <div class="dashboard-page">

    <Head>
      <Title>
        Employee Attendance Monitor
      </Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div v-if="employee" class="dashboard-wrapper">
        <div class="box employee-info-wrap">
          <employeeModalInfoCard :employee="employee" hideBottomLine />
        </div>
        <div class="box employee-attendance-head-page">
          <div class="employee-search-filter">
            <div class="input-search">
              <div class="input-box">
                <label for="search">
                  Search employee
                </label>
                <AutoComplete v-model="selectedEmployee"
                  :optionLabel="() => `${selectedEmployee.employeeFirstName} ${selectedEmployee.employeeLastName}`"
                  :suggestions="filteredEmployees" @complete="handlerSearchEmployee" @item-select="onEmployeeSelect">
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
              <button class="btn btn-block">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                    fill="#88a4bf" class="fill-212121"></path>
                </svg>
              </button>
            </div>
            <div></div>
          </div>
          <div class="employee-period-filter">
            <div v-if="visualizationMode" class="input-box">
              <label>
                Visualization mode
              </label>
              <SelectButton v-model="visualizationMode" :options="visualizationModeOptions" dataKey="value"
                optionLabel="name" aria-labelledby="basic" optionDisabled="selected"
                @change="onHandlerVisualizationModeChange" />
            </div>
            <div v-if="visualizationMode" class="input-box">
              <label>
                Period
              </label>
              <Calendar
                v-if="visualizationMode && visualizationMode?.calendar_format && visualizationMode?.name !== 'Custom' && visualizationMode?.name !== 'Fourteen'"
                v-model="periodSelected" :view="visualizationMode.calendar_format.mode"
                :dateFormat="visualizationMode.calendar_format.format" :minDate="minDate" :showWeek="false"
                @update:modelValue="handlerPeriodChange" />
              <Calendar
                v-if="visualizationMode && visualizationMode?.calendar_format && visualizationMode?.name === 'Custom'"
                v-model="datesSelected" :view="visualizationMode.calendar_format.mode"
                :dateFormat="visualizationMode.calendar_format.format" :minDate="minDate" hideOnRangeSelection
                selectionMode="range" :numberOfMonths="visualizationMode?.number_months"
                @update:modelValue="handlerPeriodChange" :showWeek="false" />
              <Calendar
                v-if="visualizationMode && visualizationMode?.calendar_format && visualizationMode?.name === 'Fourteen'"
                v-model="periodSelected" :view="visualizationMode.calendar_format.mode"
                :dateFormat="visualizationMode.calendar_format.format" :minDate="minDate" hideOnRangeSelection
                :numberOfMonths="visualizationMode?.number_months" @update:modelValue="handlerPeriodChange"
                :disabledDates="disabledNoPaymentDates" :showWeek="false">
              </Calendar>
            </div>
          </div>
        </div>

        <div class="employee-attendance-head-tools">
          <div v-if="visualizationMode">
            <button v-if="visualizationMode" class="btn" severity="success" @click="getVacations()">
              Vacations
              <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"
                enable-background="new 0 0 512 512" data-v-inspector="components/attendanceCalendarDay/index.vue:94:15"
                data-v-6de6f350="">
                <path
                  d="M443.9 109.1h-50.8V64.2c8.7-1 15.5-8.3 15.5-17.3 0-9.6-7.8-17.4-17.4-17.4h-87.6c-9.6 0-17.4 7.8-17.4 17.4 0 8.6 6.2 15.7 14.4 17.2v45.1h-55.1c-11.8 0-21.4 9.6-21.4 21.5v24.6h38c12.4 0 23.3 6.7 29.2 16.7h115.9c3.9 0 7 3.1 7 7s-3.1 7-7 7H389v9.9c0 3.9-3.1 7-7 7s-7-3.1-7-7V186h-77.9c-.4 0-.8 0-1.2-.1h-.1c.1 1.1.2 2.2.2 3.3v44.9h48.8c20.9 0 38 17 38 38v186.8c0 9.1-3.2 17.4-8.6 24H444c11.8 0 21.4-9.6 21.4-21.4v-331c-.1-11.8-9.7-21.4-21.5-21.4zm-129.3 0V64.3h64.5v44.8h-64.5zM46.7 271.9v186.8c0 13.3 10.7 24 24 24h33.6V247.9H70.7c-13.3 0-24 10.7-24 24z"
                  fill="#87a4bf" class="fill-333333" data-v-inspector="components/attendanceCalendarDay/index.vue:96:17"
                  data-v-6de6f350=""></path>
                <path
                  d="M344.7 247.9h-33.6v234.7h33.6c13.2 0 24-10.7 24-24V271.9c0-13.3-10.8-24-24-24zM176.6 247.9h62.1v234.7h-62.1z"
                  fill="#87a4bf" class="fill-333333" data-v-inspector="components/attendanceCalendarDay/index.vue:99:17"
                  data-v-6de6f350=""></path>
                <path
                  d="M281.9 247.9V189c0-11-8.9-19.9-19.9-19.9H153.4c-11 0-19.9 8.9-19.9 19.9v58.9h-15.2v234.7h44.3V247.9h-15.2V189c0-3.3 2.6-5.9 5.9-5.9H262c3.3 0 5.9 2.6 5.9 5.9v58.9h-15.2v234.7H297V247.9h-15.1z"
                  fill="#87a4bf" class="fill-333333"
                  data-v-inspector="components/attendanceCalendarDay/index.vue:102:17" data-v-6de6f350=""></path>
              </svg>
            </button>
          </div>
          <div v-if="visualizationMode && canAddAssistManual">
            <Button class="btn" severity="success" @click="addNewAssist">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11ZM21 8.5l.001 3.523a6.5 6.5 0 0 0-8.979 8.979L6.25 21A3.25 3.25 0 0 1 3 17.75V8.5h18ZM17.5 14l-.09.008a.5.5 0 0 0-.402.402L17 14.5V17h-2.5l-.09.008a.5.5 0 0 0-.402.402L14 17.5l.008.09a.5.5 0 0 0 .402.402l.09.008H17v2.5l.008.09a.5.5 0 0 0 .402.402l.09.008.09-.008a.5.5 0 0 0 .402-.402L18 20.5V18h2.5l.09-.008a.5.5 0 0 0 .402-.402L21 17.5l-.008-.09a.5.5 0 0 0-.402-.402L20.5 17H18v-2.5l-.008-.09a.5.5 0 0 0-.402-.402L17.5 14Zm.25-11A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </Button>
          </div>
          <div v-if="visualizationMode && isRangeAtLeast7Days && canSync">
            <Button class="btn" severity="success" @click="syncEmployee">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.052 5.029a1 1 0 0 0 .189 1.401 7.002 7.002 0 0 1-3.157 12.487l.709-.71a1 1 0 0 0-1.414-1.414l-2.5 2.5a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 1.414-1.414l-.843-.842A9.001 9.001 0 0 0 17.453 4.84a1 1 0 0 0-1.401.189Zm-1.93-1.736-2.5-2.5a1 1 0 0 0-1.498 1.32l.083.094.843.843a9.001 9.001 0 0 0-4.778 15.892A1 1 0 0 0 7.545 17.4a7.002 7.002 0 0 1 3.37-12.316l-.708.709a1 1 0 0 0 1.32 1.497l.094-.083 2.5-2.5a1 1 0 0 0 .083-1.32l-.083-.094Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </Button>
          </div>
        </div>

        <div class="employee-attendance-head-tools excel-reports-wrapper">
          <Button class="btn" severity="success" @click="getExcelAllAssistance">
            Detailed
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </Button>
          <button v-if="visualizationMode" class="btn" severity="success" @click="getExcelIncidentSummary">
            Summary
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </button>
          <button v-if="visualizationMode && visualizationMode?.name === 'Fourteen'" class="btn" severity="success" @click="getExcelIncidentSummaryPayRoll">
            Payroll
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </button>
        </div>

        <div v-if="canDisplayAPIExcel" class="employee-attendance-head-tools excel-reports-wrapper from-api">
          <Button v-if="visualizationMode" class="btn" severity="success" @click="getExcel('Assistance Report')">
              Detailed API
              <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                  fill="#88a4bf" class="fill-000000"></path>
              </svg>
            </Button>
          <Button v-if="visualizationMode" class="btn" severity="success" @click="getExcel('Incident Summary')">
            Summary API
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </Button>
          <Button v-if="visualizationMode && visualizationMode?.name === 'Fourteen'" class="btn" severity="success" @click="getExcel('Incident Summary Payroll')">
            Payroll API
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </Button>
        </div>

        <Message v-if="assistSyncStatusDate && !onSyncStatus" class="sync" :closable="false">
          Last attendance recorded at
          {{ assistSyncStatusDate }}
          <br>
          ( Checking every 5 minutes )
        </Message>

        <Message v-if="!assistSyncStatusDate && !onSyncStatus" class="sync" :closable="false" severity="warn">
          <div>
            No se ha logrado obtener la fecha y hora de la última sincronización de la información de asistencia.
          </div>
        </Message>

        <div>
          <div v-if="employeeCalendar.length > 0" class="general-graphs"
            :class="{ 'only-calendar': employee.employeeAssistDiscriminator === 1 }">
            <div v-if="employee.employeeAssistDiscriminator !== 1" class="box">
              <div class="pay-chart">
                <h2>
                  General behavior into period
                </h2>
                <highchart v-if="hasGeneralData" :options="generalData" style="width: 100%;" />
                <div class="no-pie-chart" v-else>
                  <span class="circle">
                    <div>
                      <div class="icon">
                        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12 2.002a3.875 3.875 0 0 0-3.875 3.875c0 2.92 1.207 6.552 1.813 8.199a2.187 2.187 0 0 0 2.064 1.423c.904 0 1.739-.542 2.063-1.418.606-1.64 1.81-5.254 1.81-8.204A3.875 3.875 0 0 0 12 2.002ZM12.001 17.001a2.501 2.501 0 1 0 0 5.002 2.501 2.501 0 0 0 0-5.002Z"
                            fill="#88a4bf" class="fill-212121"></path>
                        </svg>
                      </div>
                      There is no attendance data available
                      to generate statistics.
                    </div>
                  </span>
                </div>
              </div>
              <div class="indicators">
                <attendanceInfoCard :hideLink="true" :hidePositionTitle="true" :onTimePercentage="onTimePercentage"
                  :onToleracePercentage="onTolerancePercentage" :onDelayPercentage="onDelayPercentage"
                  :onEarlyOutPercentage="onEarlyOutPercentage" :onFaultPercentage="onFaultPercentage" />
                <div class="indicators-extra-info">
                  <div class="indicator-prop-val">
                    <span class="prop-val">
                      {{ `${faultsDelays}`.padStart(2, '0') }}
                    </span>
                    <span class="prop-label">
                      Faults from delays
                    </span>
                  </div>
                  <div class="indicator-prop-val">
                    <span class="prop-val">
                      {{ `${faultsEarlyOuts}`.padStart(2, '0') }}
                    </span>
                    <span class="prop-label">
                      Faults from early out
                    </span>
                  </div>
                  <div v-if="canReadTimeWorked" class="indicator-prop-val-work">
                    {{ workedTime }} worked
                  </div>
                  <!-- <div v-if="canReadTimeWorked" class="indicator-prop-val-work">
                    {{ workedProductiveTime }} worked productive
                  </div>
                  <div v-if="canReadTimeWorked" class="indicator-prop-val-work">
                    {{ workedActiveTime }} to work
                  </div> -->
                </div>
              </div>
            </div>
            <div v-if="visualizationMode" class="box report-wrapper">
              <div class="head">
                <h2>
                  {{ calendarTitle }}
                </h2>
              </div>
              <div class="days-wrapper">
                <div v-for="(calendarDay, index) in employeeCalendar"
                  :key="`key-calendar-day-${Math.random()}-${index}`">
                  <attendanceCalendarDay :checkAssist="calendarDay"
                    :discriminated="!!(employee.employeeAssistDiscriminator === 1)" :employee="employee" />
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
        <Sidebar v-model:visible="drawerAssistForm" header="Employee Assist Form" position="right"
          class="employee-assist-sidebar">
          <EmployeeAssistInfoForm :assist="assist" :employee="employee" @onAssistSave="onSaveAssist" />
        </Sidebar>
        <Sidebar v-model:visible="drawerVacations" header="Vacation form" position="right" class="vacation-form-sidebar"
          :showCloseIcon="true">
          <employeeVacationsList :dateStart="vacationDateStart" :dateEnd="vacationDateEnd"
            :employeeCode="employeeCode" />
        </Sidebar>
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
  @import './style';

  .employee-assist-sidebar {
    width: 100% !important;
    max-width: 32rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .vacation-form-sidebar {
    width: 35rem !important;
    max-width: 80rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>