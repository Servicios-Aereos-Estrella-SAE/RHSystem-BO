<template>
  <div class="dashboard-page">
    <Head>
      <Title>
        Department Attendance Monitor
      </Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div class="dashboard-wrapper">
        <div class="box head-page">
          <div class="input-box">
            <label for="departments">
              Department
            </label>
            <Dropdown
              id="departments"
              v-model="departmenSelected"
              optionLabel="label"
              filter
              :options="departmentCollection"
              :highlightOnSelect="false"
              @change="handlerDeparmentSelect"
            />
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
              :maxDate="maxDate"
              showWeek
              @update:modelValue="handlerPeriodChange"
            />
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
        <div class="department-positions-wrapper">
          <div v-for="(position, index) in departmentPositionCollection" :key="`position-${position.parentPositionId}-${index}`">
            <attendanceInfoCard 
              :department="departmenSelected"
              :position="position.position"
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

<style lang="scss">
:deep(.graph-label) {
  color: red;
}

.graph-label {
  color: red;
}
</style>