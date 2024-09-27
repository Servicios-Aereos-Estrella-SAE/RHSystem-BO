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
          <div class="input-box">
            <!-- <label for="parentDepartmentId">
              Status
            </label>
            <Dropdown v-model="statusSelected" :options="statusList" optionLabel="name" optionValue="name"
              placeholder="Select a Status" filter class="w-full md:w-14rem"/> -->
          </div>
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
              :disabled="employee.employeeAssistDiscriminator === 1"
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
              :disabled="employee.employeeAssistDiscriminator === 1"
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
          <div v-if="visualizationMode" class="input-box">
            <Button v-if="employee.employeeAssistDiscriminator === 0" class="btn-excel btn-block" severity="success" @click="getExcel">
              <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z" fill="#fff" class="fill-000000"></path></svg>
            </Button>
          </div>
        </div>
        
        <div v-if="employee.employeeAssistDiscriminator === 0">
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
        <div v-else class="general-graphs">
          <div class="jumbotron">
            <div>
              <div class="icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 2.051V11h8.949c-.47-4.717-4.232-8.479-8.949-8.949zm4.969 17.953c2.189-1.637 3.694-4.14 3.98-7.004h-8.183l4.203 7.004z" fill="#303e67" class="fill-000000"></path><path d="M11 12V2.051C5.954 2.555 2 6.824 2 12c0 5.514 4.486 10 10 10a9.93 9.93 0 0 0 4.255-.964s-5.253-8.915-5.254-9.031A.02.02 0 0 0 11 12z" fill="#303e67" class="fill-000000"></path></svg>
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
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v3h8V2h2v3h1.436c.892 0 1.215.093 1.54.267.327.174.583.43.757.756.174.326.267.65.267 1.54v11.873c0 .892-.093 1.215-.267 1.54-.174.327-.43.583-.756.757-.326.174-.65.267-1.54.267H4.563c-.892 0-1.215-.093-1.54-.267a1.817 1.817 0 0 1-.757-.756c-.16-.301-.252-.6-.265-1.345L2 7.564c0-.892.093-1.215.267-1.54.174-.327.43-.583.756-.757.301-.16.6-.252 1.345-.265L6 5V2h2Zm5 16h-2v2h2v-2Zm.2-6h-2.4l.2 4.5h2l.2-4.5ZM19 7H5a1 1 0 0 0-1 1v2h16V8a1 1 0 0 0-1-1Z" fill="#303e67" fill-rule="nonzero" class="fill-000000"></path></svg>
              </div>
              <span>
                This employee does not have 
                <br>
                attendance calendar recording enabled
              </span>
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

<style lang="scss">
:deep(.graph-label) {
  color: red;
}

.graph-label {
  color: red;
}
</style>