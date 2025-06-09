<template>
  <div class="vacation-control">
    <div v-if="!displayForm" class="read-date">
      <InputText type="text" v-model="shiftExceptionsDate" readonly />
      <Button v-if="displayEditVacationDayButton && canManageUserResponsible" class="btn" @click="onEdit">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m11.52 19.575-.356 1.423H6.25A3.25 3.25 0 0 1 3 17.748V8.5h17.998v2.511a3.279 3.279 0 0 0-2.607.95l-5.902 5.902a3.684 3.684 0 0 0-.969 1.712ZM20.998 6.25A3.25 3.25 0 0 0 17.748 3H6.25A3.25 3.25 0 0 0 3 6.25V7h17.998v-.75Zm-1.9 6.419-5.901 5.901a2.685 2.685 0 0 0-.707 1.248l-.457 1.83c-.2.797.522 1.518 1.318 1.319l1.83-.458a2.685 2.685 0 0 0 1.248-.706L22.33 15.9a2.286 2.286 0 0 0-3.233-3.232Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
      </Button>
      <Button v-if="displayDestroyVacationDayButton && canManageUserResponsible" class="btn"
        @click="handlerClickOnDelete()">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
            fill="#88a4bf" class="fill-212121 fill-303e67"></path>
        </svg>
      </Button>
    </div>
    <div v-else class="form-date">
      <Calendar v-model="shiftException.shiftExceptionsDate" dateFormat="yy-mm-dd" />
      <Button v-if="canManageUserResponsible" class="btn" @click="handlerClickOnSave()"
        :disabled="!canManageVacation || isDeleted">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
      </Button>
      <Button v-if="canManageUserResponsible" class="btn" @click="cancelEdit"
        :disabled="!canManageVacation || isDeleted">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
      </Button>
    </div>
    <div class="flex-container">
      <div v-if="!shiftException.shiftExceptionId" class="input-box large-box">
        <label for="more days">
        </label>
        <div class="checkbox-item">
          <Checkbox v-model="applyToMoreThanOneDay" inputId="applyToMoreThanOneDay" name="applyToMoreThanOneDay"
            :binary="true" />
          <label for="applyToMoreThanOneDay" class="ml-2"> Apply to more than one day </label>
        </div>
      </div>
      <div v-if="applyToMoreThanOneDay" class="input-box small-box">
        <label for="description">
          Days to apply
        </label>
        <InputNumber v-model="shiftException.daysToApply" inputId="daysToApply" />
        <small class="p-error" v-if="submitted && !shiftException.daysToApply">
          Days is required.
        </small>
      </div>
    </div>


  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>