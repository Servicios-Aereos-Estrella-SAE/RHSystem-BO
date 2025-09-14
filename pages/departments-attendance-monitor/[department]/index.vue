<template>
  <div class="dashboard-page">

    <Head>
      <Title>
        {{ $t('department_attendance_monitor') }}
      </Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div class="dashboard-wrapper">
        <div class="title">
          <h1>
            {{ $t('department_attendance_monitor') }}
          </h1>
        </div>
        <div class="box head-page">
          <div class="input-box">
            <label for="departments">
              {{ $t('select_department') }}
            </label>
            <Dropdown id="departments" v-model="departmenSelected" optionLabel="label" filter
              :options="departmentCollection" :highlightOnSelect="false" @change="handlerDeparmentSelect"
              :emptyMessage="$t('no_available_options')" :emptyFilterMessage="$t('no_results_found')" />
          </div>
          <div class="input-search">
            <div class="input-box">
              <label for="search">
                {{ $t('search_employee') }}
              </label>
              <AutoComplete v-model="selectedEmployee"
                :optionLabel="() => `${selectedEmployee.person?.personFirstname || ''} ${selectedEmployee.person?.personLastname || ''} ${selectedEmployee.person?.personSecondLastname || ''}`"
                :suggestions="filteredEmployees" @complete="handlerSearchEmployee" @item-select="onEmployeeSelect">
                <template #option="employee">
                  <div class="item-employee-filter-attendance-monitor">
                    <div class="name">
                      {{ employee.option.person?.personFirstname }}
                      {{ employee.option.person?.personLastname }}
                      {{ employee.option.person?.personSecondLastname }}
                    </div>
                    <div class="position-department">
                      {{ employee?.option?.department?.departmentName || '' }}
                      /
                      {{ employee.option.position.positionAlias || employee.option.position.positionName }}
                    </div>
                  </div>
                </template>
                <template #empty>
                  <div class="p-2 text-center text-gray-500">
                    <i class="pi pi-info-circle mr-2" />
                    {{ $t('no_results_found') }}
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
              {{ $t('status') }}
            </label>
            <Dropdown v-model="statusSelected" :options="getStatus" optionLabel="label" optionValue="name"
              :placeholder="$t('select_a_status')" filter class="w-full md:w-14rem"
              :emptyMessage="$t('no_available_options')" :emptyFilterMessage="$t('no_results_found')" />
          </div>
          <div v-if="visualizationMode" class="input-box">
            <label for="departments">
              {{ $t('visualization_mode') }}
            </label>
            <SelectButton v-model="visualizationMode" :options="getVisualizationModes" dataKey="value"
              optionLabel="label" aria-labelledby="basic" optionDisabled="selected"
              @change="onInputVisualizationModeChange" />
          </div>
          <div v-if="visualizationMode" class="input-box">
            <label for="departments">
              {{ $t('period') }}
            </label>
            <Calendar
              v-if="visualizationMode && visualizationMode?.calendar_format && visualizationMode?.name !== 'Custom' && visualizationMode?.name !== 'Payroll'"
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
              v-if="visualizationMode && visualizationMode?.calendar_format && visualizationMode?.name === 'Payroll'"
              v-model="periodSelected" :view="visualizationMode.calendar_format.mode"
              :dateFormat="visualizationMode.calendar_format.format" :minDate="minDate" hideOnRangeSelection
              :numberOfMonths="visualizationMode?.number_months" @update:modelValue="handlerPeriodChange"
              :disabledDates="disabledNoPaymentDates" :showWeek="false">
            </Calendar>
          </div>
        </div>

        <div class="btns-group">
          <div v-if="canSeeSwitchOptionGetAssist" class="input-box">
            <label for="getAssistFromSaveCalendarSwicht">
              {{ $t('get_assist') }} {{ getAssistFromSaveCalendarSwicht ? $t('from_save_calendar') :
              $t('from_api_calculate_calendar') }}
            </label>
            <InputSwitch v-model="getAssistFromSaveCalendarSwicht" />
          </div>
          <Button v-if="visualizationMode && isRangeAtLeast3Days && canSeeConsecutiveFaults" class="btn"
            :class="{ 'btn-info': employeesWithFaults.length > 0 }" severity="success"
            @click="drawerEmployeeWithFaults = true">
            {{ $t('consecutive_faults') }}
          </Button>
          <Button v-if="displayNoAssignedShiftBtn" class="btn" severity="success"
            @click="drawerEmployeeWithOutShift = true">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11ZM13 1c5.523 0 10 4.478 10 10s-4.477 10-10 10c-.335 0-.666-.017-.992-.049a6.5 6.5 0 0 0-8.96-8.96A10.003 10.003 0 0 1 3 11C3 5.478 7.477 1 13 1ZM3.716 14.589l-.07.057-.057.07a.5.5 0 0 0 0 .568l.057.07L5.793 17.5l-2.147 2.146-.057.07a.5.5 0 0 0 0 .568l.057.07.07.057a.5.5 0 0 0 .568 0l.07-.057L6.5 18.207l2.146 2.147.07.057a.5.5 0 0 0 .568 0l.07-.057.057-.07a.5.5 0 0 0 0-.568l-.057-.07L7.207 17.5l2.147-2.146.057-.07a.5.5 0 0 0 0-.568l-.057-.07-.07-.057a.5.5 0 0 0-.568 0l-.07.057L6.5 16.793l-2.146-2.147-.07-.057a.5.5 0 0 0-.492-.044l-.076.044ZM12.25 5a.75.75 0 0 0-.75.75l-.004 5.503c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25L13 5.75a.75.75 0 0 0-.75-.75Z"
                fill="#88a4bf" class="fill-212121"></path>
            </svg>
          </Button>
          <div v-if="visualizationMode" class="input-box">
            <button v-if="visualizationMode" class="btn" severity="success" @click="getVacations()">
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
        </div>

        <div class="box department-excel-report-buttons">
          <Button v-if="visualizationMode" class="btn" severity="success" @click="getExcelAllAssistance">
            {{ $t('detailed') }}
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </Button>
          <button v-if="visualizationMode" class="btn" severity="success" @click="getExcelIncidentSummary">
            {{ $t('summary') }}
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </button>
          <button v-if="visualizationMode && visualizationMode?.name === 'Payroll'" class="btn" severity="success"
            @click="getExcelIncidentSummaryPayRoll">
            {{ $t('payroll') }}
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </button>
        </div>

        <div v-if="canDisplayFrontExcel" class="box department-excel-report-buttons from-api">
          <Button v-if="visualizationMode" class="btn" severity="success" @click="getExcel('Assistance Report')">
            {{ $t('detailed') }} API
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </Button>
          <Button v-if="visualizationMode" class="btn" severity="success" @click="getExcel('Incident Summary')">
            {{ $t('summary') }} API
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </Button>
          <Button v-if="visualizationMode && visualizationMode?.name === 'Payroll'" class="btn" severity="success"
            @click="getExcel('Incident Summary Payroll')">
            {{ $t('payroll') }} API
            <svg viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.401 61.569v380.797l280.129 49.767V11.802L10.401 61.569zm160.983 270.574-23.519-61.703-23.065 58.466H92.688l37.539-81.576-34.825-79.956h33.017l21.257 55.231 25.327-59.853 31.66-1.618-39.574 85.505 41.158 88.274-36.863-2.77zM489.281 61.133H300.015v27.811h71.249v50.15h-71.249v15.081h71.249v50.15h-71.249v15.082h71.249v50.15h-71.249v15.08h71.249v50.151h-71.249v15.395h71.249v50.149h-71.249v32.182h189.267c5.357 0 9.739-4.514 9.739-10.034V71.168c0-5.52-4.382-10.035-9.74-10.035zm-23.068 339.199h-80.269v-50.149h80.269v50.149zm0-65.544h-80.269v-50.151h80.269v50.151zm0-65.231h-80.269v-50.15h80.269v50.15zm0-65.232h-80.269v-50.15h80.269v50.15zm0-65.231h-80.269v-50.15h80.269v50.15z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
          </Button>
        </div>

        <Message v-if="assistSyncStatusDate && !onSyncStatus" class="sync" :closable="false">
          {{ $t('last_attendance_recorded_at') }}
          {{ assistSyncStatusDate }}
          <br>
          ( {{ $t('checking_every_5_minutes') }} )
        </Message>

        <Message v-if="!assistSyncStatusDate && !onSyncStatus" class="sync" :closable="false" severity="warn">
          <div>
            {{ $t('the_date_and_time_of_the_last_synchronization_of_attendance_information_could_not_be_obtained.') }}
          </div>
        </Message>

        <div class="general-graphs-department">
          <div class="box">
            <h2>
              {{ $t('general_behavior_into_period') }}
            </h2>
            <highchart :options="generalData" style="width: 100%;" />
            <div v-if="isRootUser">
              <Button v-if="rotationIndex === null" class="btn btn-block" @click="getRotation">
                {{ $t('get_turnover_rate') }}
              </Button>
              <div v-else class="rotation-info">
                <div class="value">
                  {{ rotationIndex }}%
                  <label>
                    {{ $t('turnover_rate') }}
                  </label>
                </div>
                <Message class="sync" :closable="false" style="width: 100%;" icon="'aa'" severity="info">
                  <strong>
                    {{ $t('how_is_it_calculated') }}
                  </strong>
                  <br>
                  <br>
                  {{ $t('index') }} = S ÷ ((I + F) ÷ 2)
                  <br><br>
                  <div>
                    <strong>S:</strong>
                    {{ $t('number_of_departures_during_period') }}
                  </div>
                  <div>
                    <strong>I:</strong>
                    {{ $t('staff_at_start_of_period') }}
                  </div>
                  <div>
                    <strong>F:</strong>
                    {{ $t('staff_at_end_of_period') }}
                  </div>
                </Message>
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
        <h2>
          {{ $t('department_positions') }}
        </h2>
        <div class="department-positions-wrapper">
          <div v-for="(item, index) in getDepartmentPositionAssistStatistics()"
            :key="`position-${item?.position?.parentPositionId || 'abny'}-${index}`">
            <attendanceInfoCard :department="departmenSelected" :position="item?.position"
              :onTimePercentage="item?.statistics?.onTimePercentage || 0"
              :onToleracePercentage="item?.statistics?.onToleracePercentage || 0"
              :onDelayPercentage="item?.statistics?.onDelayPercentage || 0"
              :onFaultPercentage="item?.statistics?.onFaultPercentage || 0" hide-link />
          </div>
        </div>
        <h2>
          {{ $t('all_department_employees') }}
        </h2>
        <div v-if="filtersEmployeesByStatus(employeeDepartmentList).length > 0" class="department-positions-wrapper">
          <div v-for="(employeeAssist, index) in filtersEmployeesByStatus(employeeDepartmentList)"
            :key="`employee-position-${employeeAssist.employee?.employeeCode || Math.random()}-${index}`">
            <attendanceEmployeeInfoCard v-if="!!(employeeAssist) && !!(employeeAssist.employee)"
              :employee="employeeAssist" />
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
              {{ $t('no_employees_to_display') }}
              <br>
              {{ $t('existing_employees_may_be_discriminated') }}
            </div>
          </div>
        </div>

        <Sidebar v-model:visible="drawerEmployeeWithOutShift" :closeOnEscape="true" header="No assigned shift"
          position="right" class="employee-whitout-shift" :showCloseIcon="true">
          <employeeWithOutShiftList :employeesWithOutShift="employeesWithOutShift" />
        </Sidebar>

        <Sidebar v-model:visible="drawerVacations" header="Vacation form" position="right" class="vacation-form-sidebar"
          :showCloseIcon="true">
          <employeeVacationsList :dateStart="vacationDateStart" :dateEnd="vacationDateEnd"
            :departmentId="currentDepartmentId" />
        </Sidebar>

        <Sidebar v-model:visible="drawerEmployeeWithFaults" :closeOnEscape="true" header="No assigned shift"
          position="right" class="employee-whitout-shift" :showCloseIcon="true">
          <employeeWithFaultsList :employeesWithFaults="employeesWithFaults" />
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
  @import '/resources/styles/variables.scss';

  .vacation-form-sidebar {
    width: 35rem !important;
    max-width: 80rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }

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