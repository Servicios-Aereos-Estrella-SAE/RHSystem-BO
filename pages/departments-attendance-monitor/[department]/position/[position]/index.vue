<template>
  <div class="dashboard-page">
    <Toast />

    <Head>
      <Title>
        Position Attendance Monitor
      </Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div v-if="department && position" class="dashboard-wrapper">
        <div class="box head-page">
          <div class="department-position">
            <h1>
              {{ department.departmentAlias || department.departmentName }}
              <small>
                {{ position.positionAlias || position.positionName }}
              </small>
            </h1>
          </div>
          <div class="input-box">
            <label for="parentDepartmentId">
              Status
            </label>
            <Dropdown v-model="statusSelected" :options="statusList" optionLabel="name" optionValue="name"
              placeholder="Select a Status" filter class="w-full md:w-14rem" />
          </div>
          <div class="input-box">
            <label for="employees">
              Employee
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
                    {{ employee?.option?.department?.departmentName || '' }}
                    /
                    {{ employee.option.position.positionAlias || employee.option.position.positionName }}
                  </div>
                </div>
              </template>
            </AutoComplete>
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
              @update:modelValue="handlerPeriodChange" showWeek />
            <Calendar
              v-if="visualizationMode && visualizationMode?.calendar_format && visualizationMode?.name === 'Custom'"
              v-model="datesSelected" :view="visualizationMode.calendar_format.mode"
              :dateFormat="visualizationMode.calendar_format.format" :minDate="minDate" hideOnRangeSelection
              selectionMode="range" :numberOfMonths="visualizationMode?.number_months"
              @update:modelValue="handlerPeriodChange" showWeek />
            <Calendar
              v-if="visualizationMode && visualizationMode?.calendar_format && visualizationMode?.name === 'Fourteen'"
              v-model="periodSelected" :view="visualizationMode.calendar_format.mode"
              :dateFormat="visualizationMode.calendar_format.format" :minDate="minDate" hideOnRangeSelection
              :numberOfMonths="visualizationMode?.number_months" @update:modelValue="handlerPeriodChange" showWeek>
              <template #date="slotProps">
                <strong v-if="isThursday(slotProps.date)">{{ slotProps.date.day }}</strong>
                <template v-else><span style="text-decoration: line-through">{{ slotProps.date.day }} </span></template>
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
          <div class="input-box">
            <Button class="btn-excel btn-block" @click="getExcel">
              <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                    fill="#fff" class="fill-000000"></path>
                </svg>
              </svg>
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
        <h2>
          Employees
        </h2>
        <div class="department-positions-wrapper">
          <div v-for="(employeeAssist, index) in filtersEmployeesByStatus(employeeDepartmentPositionList)"
            :key="`employee-position-${employeeAssist.employee?.employeeCode || Math.random()}-${index}`">
            <attendanceEmployeeInfoCard :employee="employeeAssist" />
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