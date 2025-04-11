<template>
  <div class="box aircraft-info-form">
    <div v-if="aircraft" class="aircraft-form">
      <div class="form-container">
        <div>
          <div class="input-box">
            <label for="aircraftRegistrationNumber">Registration Number</label>
            <InputText id="aircraftRegistrationNumber" v-model="aircraft.aircraftRegistrationNumber"
              :invalid="submitted && !aircraft.aircraftRegistrationNumber" />
            <small class="p-error" v-if="submitted && !aircraft.aircraftRegistrationNumber">
              Registration number is required.
            </small>
          </div>
          <div class="input-box">
            <label for="aircraftSerialNumber">Serial Number</label>
            <InputText id="aircraftSerialNumber" v-model="aircraft.aircraftSerialNumber"
              :invalid="submitted && !aircraft.aircraftSerialNumber" />
            <small class="p-error" v-if="submitted && !aircraft.aircraftSerialNumber">
              Serial number is required.
            </small>
          </div>

          <div class="input-box">
            <label for="airportId">Airport</label>
            <Dropdown id="airportId" v-model="aircraft.airportId" :options="airportOptions" optionLabel="name"
              optionValue="id" :invalid="submitted && !aircraft.airportId" />
            <small class="p-error" v-if="submitted && !aircraft.airportId">
              Airport is required.
            </small>
          </div>

          <div class="input-box">
            <label for="aircraftPropertiesId">Aircraft Properties</label>
            <Dropdown id="aircraftPropertiesId" v-model="aircraft.aircraftPropertiesId"
              :options="aircraftPropertiesOptions" optionLabel="name" optionValue="id"
              :invalid="submitted && !aircraft.aircraftPropertiesId" />
            <small class="p-error" v-if="submitted && !aircraft.aircraftPropertiesId">
              Aircraft properties are required.
            </small>
          </div>

          <div class="input-box">
            <label for="aircraftPilotPic">PIC</label>
            <Dropdown showClear id="aircraftPilotPic" v-model="pilotPicId" :options="formatPilots"
              optionLabel="pilotName" optionValue="pilotId" />
          </div>

          <div class="input-box">
            <label for="aircraftPropertiesId">SIC</label>
            <Dropdown id="aircraftPropertiesId" v-model="pilotSicId" showClear optionValue="pilotId"
              :options="formatPilots" optionLabel="pilotName"
              :invalid="submitted && (pilotSicId === pilotPicId && pilotSicId !== null)" />
            <small class="p-error" v-if="submitted && (pilotSicId === pilotPicId && pilotSicId !== null)">
              Pilot SIC and Pilot PIC can't be the same.
            </small>
          </div>

          <div class="input-box">
            <label for="aircraftOperatorId">Operator</label>
            <Dropdown id="aircraftOperatorId" v-model="aircraft.aircraftOperatorId" :options="aircraftOperator"
              optionLabel="aircraftOperatorName" optionValue="aircraftOperatorId" />
            <small class="p-error" v-if="submitted && !aircraft.aircraftOperatorId">
              Operator is required.
            </small>
          </div>

          <div class="input-box">
            <label for="aircraftActive">Active</label>
            <ToggleButton v-model="isAircraftActive" onLabel="Active" offLabel="Inactive" />
          </div>
        </div>

        <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave()" />
          <!-- <Button label="Proceeding files" severity="primary" @click="getProceedingFiles()" /> -->

        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';

  .proceeding-file-sidebar {
    width: 100% !important;
    max-width: 90rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
