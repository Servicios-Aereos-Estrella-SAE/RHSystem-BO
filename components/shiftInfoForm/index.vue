<template>
  <div class="box shift-info-form">
    <Toast />
    <div v-if="shift" class="shift-form">
      <div class="form-container">
        <div class="input-box">
          <label for="shiftName">Shift Name</label>
          <InputText id="shiftName" v-model="shift.shiftName" :invalid="submitted && !shift.shiftName" />
          <small class="p-error" v-if="submitted && !shift.shiftName">Shift name is required.</small>
        </div>
        <div class="input-box">
          <label for="shiftDayStart">Start Day</label>
          <InputNumber id="shiftDayStart" v-model="shift.shiftDayStart" :invalid="submitted && !shift.shiftDayStart" />
          <small class="p-error" v-if="submitted && !shift.shiftDayStart">Start day is required.</small>
        </div>
        <div class="input-box">
          <label for="shiftTimeStart">Start Time</label>
          <InputText id="shiftTimeStart" v-model="shift.shiftTimeStart" type="time" :invalid="submitted && !shift.shiftTimeStart" />
          <small class="p-error" v-if="submitted && !shift.shiftTimeStart">Start time is required.</small>
        </div>
        <div class="input-box">
          <label for="shiftActiveHours">Active Hours</label>
          <InputNumber id="shiftActiveHours" v-model="shift.shiftActiveHours" :invalid="submitted && !shift.shiftActiveHours" />
          <small class="p-error" v-if="submitted && !shift.shiftActiveHours">Active hours are required.</small>
        </div>
        <div class="input-box">
          <label for="shiftRestDays">Rest Days</label>
          <InputText id="shiftRestDays" v-model="shift.shiftRestDays" :invalid="submitted && !shift.shiftRestDays" />
          <small class="p-error" v-if="submitted && !shift.shiftRestDays">Rest days are required.</small>
        </div>
        <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave()" />
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
</style>
