<template>
  <div class="work-disability-info-form">
    <Toast />
    <employeeModalInfoCard :employee="employee"/>
    <h1>
      <br/><br/>
      {{ isNewWorkDisability ? 'Add work disability' : 'Update work disability' }}
     
    </h1>
    
    <div v-if="isReady" class="shift-exception-form">
      <div class="form-container">
       
        <div v-if="!isNewWorkDisability" class="input-box">
          <label for="uuid">
            UUID
          </label>
          <InputText v-model="workDisability.workDisabilityUuid" disabled/>
        </div>
        <div class="input-box">
          <label for="exception-type">
            Insurance coverage type
          </label>
          <Dropdown v-model="workDisability.insuranceCoverageTypeId" :options="insuranceCoverageTypeList" optionLabel="insuranceCoverageTypeName" optionValue="insuranceCoverageTypeId"
          placeholder="" filter class="w-full md:w-14rem"
          />
          <small class="p-error" v-if="submitted && !workDisability.insuranceCoverageTypeId">Insurance coverage type is required.</small>
        </div>
        <div class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            Save work disability
          </Button>
          <Button v-if="!isNewWorkDisability" class="btn btn-block btn-primary" @click="addNewPeriod">
            Add period
          </Button>
        </div>
        <div v-if="workDisabilityPeriodsList.length > 0" class="work-disability-periods-wrapper">
          <h1>
            Periods
          </h1>
          <div v-for="(workDisabilityPeriod, index) in workDisabilityPeriodsList" :key="`work-disability-period-${index}`">
            <workDisabilityPeriodInfoCard
              :isDeleted="isDeleted"
              :work-disability-period="workDisabilityPeriod"
              :click-on-edit="() => { onEdit(workDisabilityPeriod) }"
              :click-on-delete="() => { onDelete(workDisabilityPeriod) }"
              @manageWorkDisabilities="handlerClickManage(workDisabilityPeriod)"
              :can-manage-work-disability="canManageWorkDisability" 
              :canManageException="canManageWorkDisability"/>
          </div>
        </div>
      </div>
      <Sidebar v-model:visible="drawerWorkDisabilityPeriodForm" header="form" position="right" class="work-disability-period-form-sidebar" :showCloseIcon="true">
        <employeeWorkDisabilityPeriodInfoForm
          :can-manage-work-disability="canManageWorkDisability" 
          :workDisabilityPeriod="workDisabilityPeriod"
          :employee="employee"
          @onWorkDisabilityPeriodSave="onSavePeriod"
        />
      </Sidebar>
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