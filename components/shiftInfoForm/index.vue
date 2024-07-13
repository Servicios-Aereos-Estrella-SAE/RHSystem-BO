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
          <select id="shiftDayStart" v-model="shift.shiftDayStart" :class="{ 'p-errors': submitted && !shift.shiftDayStart }">
            <option value="" disabled>Select Day</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
            <option value="7">Sunday</option>
          </select>
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
          <MultiSelect v-model="selectedRestDays" :options="daysOfWeeks" optionLabel="name" filter placeholder="Select Rest Days"
          :maxSelectedLabels="3" class="w-full md:w-500" />
          <small class="p-error" v-if="submitted && !shift.shiftRestDays.length">Rest days are required.</small>
        </div>
        <div class="card flex justify-center">
      
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
.p-errors{
  border: 1px solid red;
}
select{
  padding: 0.75rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}
</style>
