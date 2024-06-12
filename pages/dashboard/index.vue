<template>
  <div class="dashboard-page">
    <Head>
      <Title>
        Dashboard
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
          <div class="box">
            <h2>
              {{ lineChartTitle }}
            </h2>
            <highchart :options="periodData" style="width: 100%;" />
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
