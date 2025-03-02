<template>
  <div class="holiday-info-form">
    <Toast />
    <div v-if="holiday" class="holiday-form">
      <div v-show="isVisibleIcons">
        <h2>
          Select Holiday Icon
          <small class="p-error" v-if="submitted && !holiday.holidayIconId">Icon is required.</small>
        </h2>
        <div class="icon-grid">
          <div
            v-for="(icon, index) in icons"
            :key="index" class="icon-item"
            :class="{ selected: icon.iconId === holiday.holidayIconId }"
            v-html="icon.iconSvg"
            @click="selectIcon(icon)">
          </div>
        </div>
      </div>

      <div class="form-container">
        <div v-show="!isVisibleIcons">
          <h2>
            Set Holiday information
          </h2>
          <div class="input-box">
            <label for="holidayName">Holiday Name</label>
            <InputText id="holidayName" v-model="holiday.holidayName" :invalid="submitted && !holiday.holidayName" />
            <small class="p-error" v-if="submitted && !holiday.holidayName">holiday name is required.</small>
          </div>

          <div class="input-box">
            <label for="holidayDate">Holiday Date</label>
            <Calendar v-model="holiday.holidayDate" dateFormat="yy-mm-dd" placeholder="Select Holiday" />
          </div>
          <div class="input-box" v-if="!isUpdate">
            <label for="holidayFrequency">Holiday Frequency</label>
            <InputNumber id="holidayFrequency" v-model="holiday.holidayFrequency"
              :invalid="submitted && !holiday.holidayFrequency" />
            <small class="p-error" v-if="submitted && !holiday.holidayFrequency">Holiday Frequency is required.</small>
          </div>
          <div class="input-box">
            <label for="holidayIcon" class="label-container">
              Selected Holiday Icon
            </label>
            <div class="icon-grid">
              <div class="icon-item selected">
                <span class="icon-preview-box" v-html="holiday.holidayIcon"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="box-tools-footer">
          <button v-if="isVisibleIcons" class="btn btn-block" :disabled="!holiday.holidayIconId" @click="onSelectIcon">
            Continue
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.704 4.284a1 1 0 1 0-1.403 1.424L17.67 11H4a1 1 0 1 0 0 2h13.665L12.3 18.285a1 1 0 0 0 1.403 1.424l6.925-6.822a1.25 1.25 0 0 0 0-1.78l-6.925-6.823Z" fill="#88a4bf" class="fill-212121"></path></svg>
          </button>

          <button v-if="!isVisibleIcons && holiday.holidayId" class="btn" @click="handlerSetDelete">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
          </button>
          <button v-if="!isVisibleIcons" class="btn btn-block" @click="goBackToIcons">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10.295 19.716a1 1 0 0 0 1.404-1.425l-5.37-5.29h13.67a1 1 0 1 0 0-2H6.336L11.7 5.714a1 1 0 0 0-1.404-1.424l-6.924 6.822a1.25 1.25 0 0 0 0 1.78l6.924 6.823Z" fill="#88a4bf" class="fill-212121"></path></svg>
            Select icon
          </button>
          <button v-if="!isVisibleIcons" class="btn btn-block btn-primary" @click="onSave">
            Save Holiday
          </button>
        </div>
      </div>
    </div>

    <transition name="page">
      <confirmDelete
        v-if="alertConfirmDelete"
        @confirmDelete="handlerConfirmDelete"
        @cancelDelete="alertConfirmDelete = false"
      />
    </transition>
  </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss" scoped>
@import './style';
</style>
