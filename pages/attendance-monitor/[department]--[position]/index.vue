<template>
  <div class="dashboard-page">
    <Toast/>
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
              v-model="periodSelected"
              :view="visualizationMode.calendar_format.mode"
              :dateFormat="visualizationMode.calendar_format.format"
              :minDate="minDate"
              :maxDate="maxDate"
              @update:modelValue="handlerPeriodChange"
              showWeek
            />
          </div>
          <div class="input-box">
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
          <div v-for="(employeeAssist, index) in employeeDepartmentPositionList" :key="`employee-position-${employeeAssist.employee?.employeeCode || Math.random()}-${index}`">
            <attendanceEmployeeInfoCard
              :employee="employeeAssist"
            />
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
