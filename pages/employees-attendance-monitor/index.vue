<template>
  <div class="dashboard-page-employee-attendance">
    <Toast/>
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
        <div class="box head-page">
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
          <div></div>
          <div class="input-box">
            <label for="parentDepartmentId">
              Status
            </label>
            <Dropdown v-model="statusSelected" :options="statusList" optionLabel="name" optionValue="name"
              placeholder="Select a Status" filter class="w-full md:w-14rem"/>
          </div>
          <div class="input-box">
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
              @change="onInputVisualizationModeChange"
            />
          </div>
          <div class="input-box">
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
              @update:modelValue="handlerPeriodChange"
              showWeek
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
          <div v-if="visualizationMode" class="input-box">
            <Button class="btn btn-block" @click="getExcel">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5.25 20.5h13.498a.75.75 0 0 1 .101 1.493l-.101.007H5.25a.75.75 0 0 1-.102-1.494l.102-.006h13.498H5.25Zm6.633-18.498L12 1.995a1 1 0 0 1 .993.883l.007.117v12.59l3.294-3.293a1 1 0 0 1 1.32-.083l.094.084a1 1 0 0 1 .083 1.32l-.083.094-4.997 4.996a1 1 0 0 1-1.32.084l-.094-.083-5.004-4.997a1 1 0 0 1 1.32-1.498l.094.083L11 15.58V2.995a1 1 0 0 1 .883-.993L12 1.995l-.117.007Z" fill="#88a4bf" class="fill-212121"></path></svg>
            </Button>
          </div>
        </div>

        <div class="general-graphs">
          <div class="box">
            <h2>
              General behavior into period
            </h2>
            <highchart :options="generalData" style="width: 100%;" />
          </div>
          <div class="box chart-bar">
            <h2>
              {{ lineChartTitle }}
            </h2>
            <highchart :options="periodData" style="width: 100%;" />
          </div>
        </div>
        <div v-for="(item, index) in getDepartmentPositionAssistStatistics()" :key="`position-${item.department.departmentId}-${index}`">
          <div v-if="!!(item.department)">
            <h2>
              Employees into
              {{ item.department.departmentAlias || item.department.departmentName }}
            </h2>
            <div v-if="hasEmployees(item.employees)" class="department-positions-wrapper">
              <div v-for="(employeeAssist, index) in filtersEmployeesByStatus(item.employees)" :key="`employee-position-${employeeAssist.employee?.employeeCode || Math.random()}-${index}`">
                <attendanceEmployeeInfoCard
                  v-if="!!(employeeAssist) && !!(employeeAssist.employee)"
                  :employee="employeeAssist"
                />
              </div>
            </div>
            <div v-else class="jumbotron">
              No employees data list to display
            </div>
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
