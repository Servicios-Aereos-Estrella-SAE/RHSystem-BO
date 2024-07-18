<template>
  <div class="box holiday-info-form">
    <Toast />
    <div v-if="holiday" class="holiday-form">
      <div class="form-container">
        <div class="input-box">
          <label for="holidayName">holiday Name</label>
          <InputText id="holidayName" v-model="holiday.holidayName" :invalid="submitted && !holiday.holidayName" />
          <small class="p-error" v-if="submitted && !holiday.holidayName">holiday name is required.</small>
        </div>
        <div class="input-box">
          <label for="holidayIcon" class="label-container">Holiday Icon <span class="icon-preview" v-html="holiday.holidayIcon"></span></label>
          <Dropdown v-model="holiday.holidayIconId" :options="icons" optionLabel="iconName" optionValue="iconId"
            placeholder="Select Icon" class="w-full md:w-14rem" />
          <small class="p-error" v-if="submitted && !holiday.holidayIconId">Icon is required.</small>
        </div>
        <div class="input-box">
          <label for="holidayDate">Holiday Date</label>
          <Calendar v-model="holiday.holidayDate" dateFormat="yy-mm-dd" placeholder="Select Holiday" />
        </div>
        <div class="input-box" v-if="!isUpdate">
          <label for="holidayFrequency">Holiday Frequency</label>
          <InputNumber id="holidayFrequency" v-model="holiday.holidayFrequency" :invalid="submitted && !holiday.holidayFrequency" />
          <small class="p-error" v-if="submitted && !holiday.holidayFrequency">Holiday Frequency is required.</small>
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
