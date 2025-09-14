<template>
  <div class="shift-info-form">

    <div v-if="shift" class="shift-form">
      <h1>
        {{ formTitle }}
      </h1>

      <div class="form-container">
        <div v-if="shiftName" class="input-box">
          <label for="shiftName">{{ $t('shift_name') }}</label>
          <div class="shift-name">
            {{ shift.shiftName }}
          </div>
        </div>

        <div class="input-box">
          <label>
            {{ $t('shift') }}
          </label>
          <Dropdown v-model="shift.shiftCalculateFlag" :options="flags" optionLabel="label" optionValue="value" />
        </div>

        <div class="input-box">
          <label for="shiftTimeStart">{{ $t('start_time') }}</label>
          <Calendar id="calendar-timeonly" v-model="timeToStart" timeOnly
            :invalid="submitted && !shift.shiftTimeStart" />
          <small class="p-error" v-if="submitted && !shift.shiftTimeStart">{{ $t('start_time') }} {{ $t('is_required')
            }}</small>
        </div>
        <div class="input-box">
          <label for="shiftActiveHours">{{ $t('active_hours') }}</label>
          <InputNumber id="shiftActiveHours" v-model="shiftActiveHours" :invalid="submitted && !shift.shiftActiveHours"
            :min="1" :max="72" />
          <small class="p-error" v-if="submitted && !shift.shiftActiveHours">{{ $t('active_hours') }} {{
            $t('are_required') }}</small>
        </div>
        <div class="input-box">
          <label for="shiftActiveHours">{{ $t('active_minutes_on_last_hour') }}</label>
          <InputNumber id="shiftActiveHours" v-model="temporalActiveMinutes"
            :invalid="submitted && !temporalActiveMinutes" :min="0" :max="60" />
          <small class="p-error" v-if="submitted && !temporalActiveMinutes">{{ $t('active_minutes_on_last_hour') }} {{
            $t('are_required') }}</small>
        </div>
        <div class="input-box">
          <label for="shiftTimeStart">{{ $t('end_time') }}</label>
          <Calendar id="calendar-timeonly" v-model.lazy="timeToEnd" timeOnly readonly />
        </div>
        <div v-if="shift.shiftCalculateFlag === 'estandar'" class="input-box">
          <label for="shiftRestDays">
            {{ $t('rest_days') }}
          </label>
          <MultiSelect v-model="selectedRestDays" :options="getDays" :optionLabel="'name'"
            :placeholder="`${$t('select')} ${$t('rest_days')}`" :maxSelectedLabels="2" class="w-full md:w-500" filter
            :emptyMessage="$t('no_available_options')" :emptyFilterMessage="$t('no_results_found')" />
          <small class="p-error" v-if="submitted && !shift.shiftRestDays.length">{{ $t('rest_days') }} {{
            $t('are_required') }}</small>
        </div>
        <div class="input-box">
          <label for="shiftAccumulatedFault">{{ $t('accumulated_faults') }}</label>
          <InputNumber id="shiftActiveHours" v-model="shift.shiftAccumulatedFault"
            :invalid="submitted && !shift.shiftAccumulatedFault" :min="1" />
          <small class="p-error" v-if="submitted && !shift.shiftAccumulatedFault">{{ $t('accumulated_faults') }} {{
            $t('are_required') }}</small>
        </div>

        <div class="card flex justify-center"></div>

        <div class="box-tools-footer">
          <Button :label="$t('save')" severity="primary" @click="onSave" />
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