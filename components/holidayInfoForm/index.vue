<template>
  <div class="box holiday-info-form">
    <Toast />
    <div v-if="holiday" class="holiday-form">
      <div class="form-container" >
        <div v-show="!isVisibleIcons">
          <div class="input-box">
            <label for="holidayName">holiday Name</label>
            <InputText id="holidayName" v-model="holiday.holidayName" :invalid="submitted && !holiday.holidayName" />
            <small class="p-error" v-if="submitted && !holiday.holidayName">holiday name is required.</small>
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
          <div class="input-box">
            <label for="holidayIcon" class="label-container mt-2">
              Selected Holiday Icon 
            </label>
            <div class="icon-grid">
              <div class="icon-item selected">
                <span class="icon-preview-box" v-html="holiday.holidayIcon"></span>
                <span>{{ iconSelected?.iconName }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-show="isVisibleIcons">
          <div class="input-box mt-2">
            <label for="holidayIcon" class="label-container mt-2">
              Select Holiday Icon 
              <span class="icon-preview" v-html="holiday.holidayIcon"></span>
            </label>
            <div class="icon-grid">
              <div 
                v-for="(icon, index) in icons" 
                :key="index" 
                class="icon-item" 
                :class="{ selected: icon.iconId === holiday.holidayIconId }" 
                @click="selectIcon(icon)"
              >
                <span class="icon-preview-box" v-html="icon.iconSvg"></span>
                <span>{{ icon.iconName }}</span>
              </div>
            </div>
            <small class="p-error" v-if="submitted && !holiday.holidayIconId">Icon is required.</small>
          </div>
        </div>
        <div class="card flex justify-center">
        </div>
        <div class="box-tools-footer">
          <Button v-if="isVisibleIcons" label="Select Icon" severity="primary" @click="onSelectIcon()" />
          <Button v-if="!isVisibleIcons" label="Back to Icons" severity="primary" @click="goBackToIcons()" />
          <Button v-if="!isVisibleIcons" label="Save" severity="primary" @click="onSave()" />
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
