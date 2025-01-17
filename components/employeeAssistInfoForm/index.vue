<template>
  <div class="box employee-assist-info-form">
    <Toast />
    <h3 v-if="employee">{{ `${employee.employeeFirstName} ${employee.employeeLastName}` }}</h3>
    <h4>
      New employee assist
    </h4>
    <div v-if="isReady" class="employee-assist-info-form">
      <div class="form-container">
        <div class="date-box-container">
          <label>Select date time to assist</label>
          <div v-if="!displayDateCalendar" class="date-box">
            <InputText v-model="assistPunchTime" readonly class="capitalize" />
            <Button type="button" class="btn btn-block" id="display-input-expiration-at"
              @click="handlerDisplayDate">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </Button>
          </div>
          <div v-if="displayDateCalendar" class="date-box-controller">
            <Calendar v-if="displayDateCalendar" dateFormat="yy-mm-dd" showTime hourFormat="24"
              v-model.lazy="assist.assistPunchTime" placeholder="Select date time to assist" :invalid="dateInvalid" :minDate="startLimit"/>
            <Button type="button" class="btn btn-block" id="display-input-expiration-at"
              @click="displayDateCalendar = false">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </Button>
            
          </div>
              <small class="p-error" v-if="dateInvalid">Date is invalid.</small>
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