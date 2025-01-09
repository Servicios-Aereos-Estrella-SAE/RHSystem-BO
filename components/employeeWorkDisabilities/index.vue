<template>
  <div v-if="isReady" class="employee-work-disabilities">
    <employeeModalInfoCard :employee="employee"/>

    <h1>
      Employee Work Disabilities
    </h1>

    <div v-if="isReady">
      <div class="work-disabilities-wrapper">
        <div v-for="(workDisability, index) in workDisabilities" :key="`work-disability-${index}`">
          <workDisabilityInfoCard
            :isDeleted="isDeleted"
            :work-disability="workDisability"
            @manageWorkDisabilities="handlerClickManage(workDisability)"
            :can-manage-work-disability="canManageWorkDisability" 
            :canManageException="canManageWorkDisability"/>
        </div>
      </div>
    </div>

    <ProgressSpinner v-else />
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>