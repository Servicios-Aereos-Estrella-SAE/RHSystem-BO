<template>
  <div class="employee-user-assigned-info-form">
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ isNewUserAssignedEmployee ? 'Add assigned employee' : 'Update assigned employee' }}
    </h1>

    <div v-if="isReady" class="employee-user-assigned-form">
      <div class="form-container">
        <employeeModalInfoCard :employee="userAssignedEmployee.employeeAssigned" />



        <div class="input-box">
          <label for="readonlySwicht">
            Read only
            ( {{ readonlySwicht ? 'Active' : 'Inactive' }} )
          </label>
          <InputSwitch v-model="readonlySwicht" :disabled="isDeleted || !canManageUserAssigned" />
        </div>
        <div class="input-box">
          <label for="directBossSwicht">
            Direct Boss
            ( {{ directBossSwicht ? 'Active' : 'Inactive' }} )
          </label>
          <InputSwitch v-model="directBossSwicht" :disabled="isDeleted || !canManageUserAssigned" />
        </div>
        <div class="box-tools-footer">
          <Button v-if="canManageUserAssigned" class="btn btn-block btn-primary" @click="onSave">
            Save employee
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