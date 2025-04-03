<template>
  <div class="shift-info-form">
    <Toast />
    <div v-if="shift" class="shift-form">
      <h1>
        {{ formTitle }}
      </h1>

      <div class="form-container">
        <div v-if="shiftName" class="input-box">
          <label for="shiftName">Shift Name</label>
          <div class="shift-name">
            {{ shift.shiftName }}
          </div>
        </div>

        <div class="input-box">
          <label>
            Shift
          </label>
          <Dropdown v-model="shift.shiftCalculateFlag" :options="flags" optionLabel="label" optionValue="value" />
        </div>

        <div class="input-box">
          <label for="shiftTimeStart">Start Time</label>
          <Calendar id="calendar-timeonly" v-model="timeToStart" timeOnly
            :invalid="submitted && !shift.shiftTimeStart" />
          <small class="p-error" v-if="submitted && !shift.shiftTimeStart">Start time is required.</small>
        </div>
        <div class="input-box">
          <label for="shiftActiveHours">Active Hours</label>
          <InputNumber id="shiftActiveHours" v-model="shiftActiveHours" :invalid="submitted && !shift.shiftActiveHours"
            :min="1" :max="72" />
          <small class="p-error" v-if="submitted && !shift.shiftActiveHours">Active hours are required.</small>
        </div>
        <div class="input-box">
          <label for="shiftActiveHours">Active Minutes on last hour</label>
          <InputNumber id="shiftActiveHours" v-model="temporalActiveMinutes"
            :invalid="submitted && !shift.shiftActiveHours" :min="0" :max="60" />
          <small class="p-error" v-if="submitted && !shift.shiftActiveHours">Active hours are required.</small>
        </div>
        <div class="input-box">
          <label for="shiftTimeStart">End Time</label>
          <Calendar id="calendar-timeonly" v-model.lazy="timeToEnd" timeOnly readonly />
        </div>
        <div v-if="shift.shiftCalculateFlag === 'estandar'" class="input-box">
          <label for="shiftRestDays">
            Rest Days
          </label>
          <MultiSelect v-model="selectedRestDays" :options="daysOfWeeks" :optionLabel="'name'"
            :placeholder="'Select Rest Days'" :maxSelectedLabels="2" class="w-full md:w-500" filter />
          <small class="p-error" v-if="submitted && !shift.shiftRestDays.length">Rest days are required.</small>
        </div>
        <div class="input-box">
          <label for="shiftAccumulatedFault">Accumulated Faults</label>
          <InputNumber id="shiftActiveHours" v-model="shift.shiftAccumulatedFault"
            :invalid="submitted && !shift.shiftAccumulatedFault" :min="1" />
          <small class="p-error" v-if="submitted && !shift.shiftAccumulatedFault">Accumulated faults are
            required.</small>
        </div>

        <div class="card flex justify-center"></div>

        <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave" />
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

  .p-errors {
    border: 1px solid red;
  }

  select {
    padding: 0.75rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
  }
</style>