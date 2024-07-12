<template>
  <div class="dashboard-page">
    <Toast/>
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
              @change="onInputVisualizationModeChange"
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
        <div class="box head-page sync">
          <h6>
            Last attendance sync on
            {{ assistSyncStatusDate }}
            <small>
              ( Every 3 minutes )
            </small>
          </h6>
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
          Department positions
        </h2>
        <div class="department-positions-wrapper">
          <div v-for="(item, index) in getDepartmentPositionAssistStatistics()" :key="`position-${item.position.parentPositionId}-${index}`">
            <attendanceInfoCard
              :department="departmenSelected"
              :position="item?.position"
              :onTimePercentage="item?.statistics?.onTimePercentage || 0"
              :onToleracePercentage="item?.statistics?.onToleracePercentage || 0"
              :onDelayPercentage="item?.statistics?.onDelayPercentage || 0"
              :onFaultPercentage="item?.statistics?.onFaultPercentage || 0"
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