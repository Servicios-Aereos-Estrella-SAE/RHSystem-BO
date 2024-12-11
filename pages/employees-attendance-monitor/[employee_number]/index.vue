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
              <img v-if="employee.employeePhoto" :src="employee.employeePhoto" alt="Employee Photo" class="employee-photo" @click="onClickPhoto" />
              <svg v-else viewBox="0 0 500 500" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M415.762 346.214c-19.078-24.896-42.156-41.063-75.223-50.236l-30.983 108.475c0 9.992-8.181 18.172-18.172 18.172-9.988 0-18.169-8.18-18.169-18.172v-86.311c0-12.536-10.178-22.715-22.715-22.715-12.536 0-22.713 10.179-22.713 22.715v86.311c0 9.992-8.181 18.172-18.17 18.172-9.992 0-18.173-8.18-18.173-18.172l-30.983-108.475c-33.068 9.262-56.145 25.34-75.221 50.236-7.542 9.812-11.64 29.527-11.908 40.07.09 2.725 0 5.906 0 9.082v36.345c0 20.078 16.264 36.34 36.343 36.34h281.648c20.078 0 36.345-16.262 36.345-36.34v-36.345c0-3.176-.089-6.357 0-9.082-.275-10.543-4.368-30.259-11.906-40.07zm-260.66-218.141c0 53.059 33.078 131.013 95.398 131.013 61.237 0 95.396-77.954 95.396-131.013 0-53.057-42.702-96.124-95.396-96.124s-95.398 43.067-95.398 96.124z" fill="#87a4bf" fill-rule="evenodd" class="fill-010101"></path></svg>
            </div>
            <h1 class="capitalize">
              <div :class="employee.deletedAt ? 'deleted': ''">
                {{ `${employee.employeeFirstName || ''}`.toLocaleLowerCase() }}
                {{ `${employee.employeeLastName || ''}`.toLocaleLowerCase() }}
                <span class="name-emp-code">
                  ( Emp. Code: {{ employee.employeeCode }} )
                </span>
              </div>
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
          <div class="input-search">
            <div class="input-box">
              <label for="search">
                Search employee
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
            <button class="btn btn-block">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </button>
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
              v-if="visualizationMode && visualizationMode?.calendar_format && visualizationMode?.name !== 'Custom' && visualizationMode?.name !== 'Fourteen'"
              v-model="periodSelected"
              :view="visualizationMode.calendar_format.mode"
              :dateFormat="visualizationMode.calendar_format.format"
              :minDate="minDate"
              :maxDate="maxDate"
              showWeek
              @update:modelValue="handlerPeriodChange"
            />
            <Calendar
              v-if="visualizationMode && visualizationMode?.calendar_format && visualizationMode?.name === 'Custom'"
              v-model="datesSelected"
              :view="visualizationMode.calendar_format.mode"
              :dateFormat="visualizationMode.calendar_format.format"
              :minDate="minDate"
              :maxDate="maxDate"
              hideOnRangeSelection
              selectionMode="range"
              :numberOfMonths="visualizationMode?.number_months"
              @update:modelValue="handlerPeriodChange"
              showWeek
            />

            <Calendar
              v-if="visualizationMode && visualizationMode?.calendar_format && visualizationMode?.name === 'Fourteen'"
              v-model="periodSelected"
              :view="visualizationMode.calendar_format.mode"
              :dateFormat="visualizationMode.calendar_format.format"
              :minDate="minDate"
              hideOnRangeSelection
              :numberOfMonths="visualizationMode?.number_months"
              @update:modelValue="handlerPeriodChange"
              showWeek
            >
              <template #date="slotProps">
                <strong v-if="isThursday(slotProps.date)" >{{ slotProps.date.day }}</strong>
                <template v-else ><span style="text-decoration: line-through" >{{ slotProps.date.day }} </span></template>
              </template>
            </Calendar>
          </div>
        </div>

        <div class="box head-page sync">
          <h6>
            <span>
              Last attendance recorded at
              {{ assistSyncStatusDate }}
              <small>
                ( Checking every 5 minutes )
              </small>
            </span>
          </h6>
          <div class="subhead-tools">
            <div v-if="visualizationMode && isRoot" class="input-box">
              <Button class="btn btn-block" severity="success" @click="addNewAssist">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11ZM21 8.5l.001 3.523a6.5 6.5 0 0 0-8.979 8.979L6.25 21A3.25 3.25 0 0 1 3 17.75V8.5h18ZM17.5 14l-.09.008a.5.5 0 0 0-.402.402L17 14.5V17h-2.5l-.09.008a.5.5 0 0 0-.402.402L14 17.5l.008.09a.5.5 0 0 0 .402.402l.09.008H17v2.5l.008.09a.5.5 0 0 0 .402.402l.09.008.09-.008a.5.5 0 0 0 .402-.402L18 20.5V18h2.5l.09-.008a.5.5 0 0 0 .402-.402L21 17.5l-.008-.09a.5.5 0 0 0-.402-.402L20.5 17H18v-2.5l-.008-.09a.5.5 0 0 0-.402-.402L17.5 14Zm.25-11A3.25 3.25 0 0 1 21 6.25V7H3v-.75A3.25 3.25 0 0 1 6.25 3h11.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </Button>
            </div>
            <div v-if="visualizationMode" class="input-box">
              <Button class="btn btn-block" severity="success" @click="syncEmployee">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.052 5.029a1 1 0 0 0 .189 1.401 7.002 7.002 0 0 1-3.157 12.487l.709-.71a1 1 0 0 0-1.414-1.414l-2.5 2.5a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 1.414-1.414l-.843-.842A9.001 9.001 0 0 0 17.453 4.84a1 1 0 0 0-1.401.189Zm-1.93-1.736-2.5-2.5a1 1 0 0 0-1.498 1.32l.083.094.843.843a9.001 9.001 0 0 0-4.778 15.892A1 1 0 0 0 7.545 17.4a7.002 7.002 0 0 1 3.37-12.316l-.708.709a1 1 0 0 0 1.32 1.497l.094-.083 2.5-2.5a1 1 0 0 0 .083-1.32l-.083-.094Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </Button>
            </div>
            <div v-if="visualizationMode" class="input-box">
              <Button class="btn btn-block" severity="success" @click="getExcel">
                <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z" fill="#88a4bf" class="fill-000000"></path></svg>
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <div v-if="employeeCalendar.length > 0" class="general-graphs" :class="{ 'only-calendar': employee.employeeAssistDiscriminator === 1 }">
            <div v-if="employee.employeeAssistDiscriminator !== 1" class="box">
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
                <h2 class="align-right">
                  Faults from delays: {{ `${faultsDelays}`.padStart(2, '0') }}
                </h2>
              </div>
              <div v-if="canReadTimeWorked" class="head-worked">
                <h2>
                </h2>
                <h2 class="align-right">
                  Worked: {{ workedTime }}
                </h2>
              </div>
              <div class="days-wrapper">
                <div v-for="(calendarDay, index) in employeeCalendar" :key="`key-calendar-day-${Math.random()}-${index}`">
                  <attendanceCalendarDay
                    :checkAssist="calendarDay"
                    :discriminated="!!(employee.employeeAssistDiscriminator === 1)"
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
        <!-- <div v-else class="general-graphs">
          <div class="jumbotron">
            <div>
              <div class="icon">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999Zm-.004 8.25a1 1 0 0 0-.992.885l-.007.116.003 5.502.007.117a1 1 0 0 0 1.987-.002L13 16.75l-.003-5.501-.007-.117a1 1 0 0 0-.994-.882ZM12 6.5a1.251 1.251 0 1 0 0 2.503A1.251 1.251 0 0 0 12 6.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </div>
              <span>
                This employee does not have
                <br>
                attendance statistics enabled
              </span>
            </div>
          </div>
          <div class="jumbotron">
            <div>
              <div class="icon">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999Zm-.004 8.25a1 1 0 0 0-.992.885l-.007.116.003 5.502.007.117a1 1 0 0 0 1.987-.002L13 16.75l-.003-5.501-.007-.117a1 1 0 0 0-.994-.882ZM12 6.5a1.251 1.251 0 1 0 0 2.503A1.251 1.251 0 0 0 12 6.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </div>
              <span>
                This employee does not have 
                <br>
                attendance calendar recording enabled
              </span>
            </div>
          </div>
        </div> -->
        <Sidebar v-model:visible="drawerAssistForm" header="Employee Assist Form" position="right" class="employee-assist-sidebar">
          <EmployeeAssistInfoForm
            :assist="assist"
            :employee="employee"
            @onAssistSave="onSaveAssist"
          />
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
    max-width: 35rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
:deep(.graph-label) {
  color: red;
}

.graph-label {
  color: red;
}
</style>