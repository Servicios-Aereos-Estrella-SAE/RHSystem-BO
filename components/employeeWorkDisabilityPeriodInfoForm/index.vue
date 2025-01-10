<template>
  <div class="work-disability-info-form">
    <Toast />
    <employeeModalInfoCard :employee="employee"/>
    <h1>
      <br/><br/>
      {{ isNewWorkDisabilityPeriod ? 'Add work disability period' : 'Update work disability period' }}
     
    </h1>
    
    <div v-if="isReady" class="work-disability-period-form">
      <div class="form-container">
       
        <div  class="input-box">
          <label for="folio">
            Ticket folio
          </label>
          <InputText v-model="workDisabilityPeriod.workDisabilityPeriodTicketFolio"/>
          <small class="p-error" v-if="submitted && !workDisabilityPeriod.workDisabilityPeriodTicketFolio">Ticket folio is required.</small>
        </div>
        <div class="input-box">
          <label for="work-disability-type">
            Work disability type
          </label>
          <Dropdown v-model="workDisabilityPeriod.workDisabilityTypeId" :options="workDisabilityTypeList" optionLabel="workDisabilityTypeName" optionValue="workDisabilityTypeId"
          placeholder="" filter class="w-full md:w-14rem"
          />
          <small class="p-error" v-if="submitted && !workDisabilityPeriod.workDisabilityTypeId">Work disability type is required.</small>
        </div>
        <div class="input-box">
          <label for="requested-date">
              From
          </label>
          <Calendar v-model="workDisabilityPeriod.workDisabilityPeriodStartDate" dateFormat="yy-mm-dd" placeholder="Select date start"
              class="w-full md:w-14rem" />
          <small class="p-error" v-if="submitted && !workDisabilityPeriod.workDisabilityPeriodStartDate">
              Date from is required.
          </small>
      </div>
      <div class="input-box">
        <label for="requested-date">
            At
        </label>
        <Calendar v-model="workDisabilityPeriod.workDisabilityPeriodEndDate" dateFormat="yy-mm-dd" placeholder="Select date end"
            class="w-full md:w-14rem" />
        <small class="p-error" v-if="submitted && !workDisabilityPeriod.workDisabilityPeriodEndDate">
            Date from is required.
        </small>
    </div>
        <div class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            Save work disability period
          </Button>
        </div>
      </div>
    </div>
    <div v-else class="loader">
      <ProgressSpinner />
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