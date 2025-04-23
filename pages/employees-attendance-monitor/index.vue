<template>
  <div class="dashboard-page-employee-attendance">


    <Head>
      <Title>
        All Employees Attendance Monitor
      </Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div class="dashboard-wrapper">
        <div class="department-position">
          <h1>
            General Employees Attendance Monitor
          </h1>
        </div>
        <div class="box head-ea-page">
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
          <div class="input-box">
            <label for="parentDepartmentId">
              Status
            </label>
            <Dropdown v-model="statusSelected" :options="statusList" optionLabel="name" optionValue="name"
              placeholder="Select a Status" filter class="w-full md:w-14rem" />
          </div>
          <div class="input-box">
            <label for="departments">
              Visualization mode
            </label>
            <SelectButton v-model="visualizationMode" :options="visualizationModeOptions" dataKey="value"
              optionLabel="name" aria-labelledby="basic" optionDisabled="selected"
              @change="onInputVisualizationModeChange" />
          </div>
          <div class="input-box">
            <label for="departments">
              Period
            </label>
            <Calendar
              v-if="visualizationMode && visualizationMode?.calendar_format && visualizationMode?.name !== 'Custom' && visualizationMode?.name !== 'Fourteen'"
              v-model="periodSelected" :view="visualizationMode.calendar_format.mode"
              :dateFormat="visualizationMode.calendar_format.format" :minDate="minDate"
              @update:modelValue="handlerPeriodChange" :showWeek="false" />
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

        <div class="head-ea-bts-group">
          <button v-if="visualizationMode" class="btn" severity="success" @click="drawerEmployeeWithOutShift = true">
            Show employees without shift
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </button>
          <button v-if="visualizationMode" class="btn" severity="success" @click="getExcel('Assistance Report')">
            Detailed
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </button>
          <button v-if="visualizationMode" class="btn" severity="success" @click="getExcel('Incident Summary')">
            Summary
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </button>
          <button v-if="visualizationMode && visualizationMode?.name === 'Fourteen'" class="btn" severity="success"
            @click="getExcel('Incident Summary Payroll')">
            Payroll
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </button>
        </div>
        <Message v-if="assistSyncStatusDate && !onSyncStatus" class="sync" :closable="false">
          <div>
            Last attendance recorded at
            {{ assistSyncStatusDate }}
            <br>
            ( Checking every 5 minutes )
          </div>
        </Message>
        <Message v-if="!assistSyncStatusDate && !onSyncStatus" class="sync" :closable="false" severity="warn">
          <div>
            No se ha logrado obtener la fecha y hora de la última sincronización de la información de asistencia.
          </div>
        </Message>

        <div class="general-graphs">
          <div class="box">
            <h2>
              General behavior into period
            </h2>
            <highchart :options="generalData" style="width: 100%;" />
            <div class="evaluated-emps">
              {{ `${evaluatedAssistEmployees}`.padStart(2, '0') }} Arrivals of
              {{ `${estimatedArrivals}`.padStart(2, '0') }} Estimated
              <br>
              <div class="employees-evaluated">
                {{ `${evaluatedEmployees}`.padStart(2, '0') }} Evaluated employees
              </div>
            </div>
          </div>
          <div class="box chart-bar">
            <h2>
              {{ lineChartTitle }}
            </h2>
            <highchart :options="periodData" style="width: 100%;" />
          </div>
        </div>
        <div v-for="(item, index) in getDepartmentPositionAssistStatistics()"
          :key="`position-${item.department.departmentId}-${index}`">
          <div v-if="!!(item.department) && filtersEmployeesByStatus(item.employees).length > 0">
            <h2>
              Employees into
              {{ item.department.departmentAlias || item.department.departmentName }}
            </h2>
            <div v-if="hasEmployees(item.employees)" class="department-positions-wrapper">
              <div v-for="(employeeAssist, index) in filtersEmployeesByStatus(item.employees)"
                :key="`employee-position-${employeeAssist.employee?.employeeCode || Math.random()}-${index}`">
                <attendanceEmployeeInfoCard v-if="!!(employeeAssist) && !!(employeeAssist?.employee)"
                  :employee="employeeAssist" />
              </div>
            </div>
            <div v-else class="jumbotron">
              No employees data list to display
            </div>
          </div>
          <Sidebar v-model:visible="drawerEmployeeWithOutShift" :closeOnEscape="true" header="Employees without shift"
            position="right" class="employee-whitout-shift" :showCloseIcon="true">
            <h3>Employees without shift</h3>
            <div v-if="employeesWithOutShift.length > 0" class="p-3">
              <div v-for="(employee, index) in employeesWithOutShift" :key="`employee-${employee.employeeId}-${index}`">
                <EmployeeInfoCard :click-on-photo="() => {  }" :employee="employee" :can-manage-shifts="false"
                  :can-update="false" :can-delete="false" :canReadOnlyFiles="false" :canManageFiles="false"
                  :click-on-edit="() => {  }" :click-on-delete="() => {  }" />
              </div>
            </div>
            <div v-else class="box">
              <div class="empty">
                <div>
                  <div class="icon">
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M13 5a1 1 0 1 0 0-2h-2a1 1 0 1 0 0 2h2ZM5 11a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2ZM4 18a1 1 0 1 1 0-2h16a1 1 0 1 1 0 2H4ZM4 21a1 1 0 1 1 0-2h16a1 1 0 1 1 0 2H4ZM20 10a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1ZM7 4a1 1 0 0 0-1-1 3 3 0 0 0-3 3 1 1 0 0 0 2 0 1 1 0 0 1 1-1 1 1 0 0 0 1-1ZM18 3a1 1 0 1 0 0 2 1 1 0 0 1 1 1 1 1 0 1 0 2 0 3 3 0 0 0-3-3Z"
                        fill="#88a4bf" class="fill-212121"></path>
                    </svg>
                  </div>
                  No employees to display.
                </div>
              </div>
            </div>
          </Sidebar>
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
  @import '/resources/styles/variables.scss';

  .employee-whitout-shift {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

  .employee-list {
    list-style: none;
    padding: 1rem;
    margin: 0;
  }

  .employee-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e0e0e0;
  }
</style>