<template>
  <div class="dashboard-page">
    <Head>
      <Title>
        Reporte de Asistencia
      </Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div class="dashboard-wrapper">
        <div class="box head-page">
          <div class="input-box">
            <label for="departments">
              Departamento
            </label>
            <Dropdown
              id="departments"
              v-model="departmenSelected"
              :options="departmentCollection"
              optionLabel="name"
              checkmark
              :highlightOnSelect="false"
              @change="handlerDeparmentSelect"
            />
          </div>
          <div></div>
          <div class="input-box">
            <label for="departments">
              Modo de visualización
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
          <div class="input-box">
            <label for="departments">
              Periodo
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
              Comportamiento total del periodo
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
          <div
            v-for="(position, index) in departmentPositionList"
            :key="`position-${position.code}-${index}`"
            class="box position-card"
          >
            <div class="name">
              {{ position.positionName }}
            </div>
            <div class="percentage assist">
              70%
              <small>
                Asistencia
              </small>
            </div>
            <div class="percentages">
              <div class="percentage tolerance">
                20%
                <small>
                  Tolerancia
                </small>
              </div>
              <div class="percentage delay">
                7%
                <small>
                  Retardos
                </small>
              </div>
              <div class="percentage fault">
                3%
                <small>
                  Faltas
                </small>
              </div>
            </div>
            <div class="box-tools-footer">
              <button class="box-button block">
                Ver detalles
                <svg class="feather feather-arrow-right" fill="none" stroke="#303e67" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
              </button>
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