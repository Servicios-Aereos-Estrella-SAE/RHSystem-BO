<template>
  <div class="employee-user-responsible-info-form">
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ isNewUserResponsibleEmployee ? 'Add user responsible employee' : 'Update user responsible employe' }}
    </h1>

    <div v-if="isReady" class="employee-user-responsible-form">
      <div class="form-container">
        <div class="input-box">
          <label for="user">
            User
          </label>
          <Dropdown v-model="userResponsibleEmployee.userId" :options="usersList"
            :optionLabel="option => `${option.person.personFirstname} ${option.person.personLastname} ${option.person.personSecondLastname}`"
            optionValue="userId" placeholder="Select user" filter class="w-full md:w-14rem"
            :disabled="!isNewUserResponsibleEmployee" />
          <small class="p-error" v-if="submitted && !userResponsibleEmployee.userId">User is
            required.</small>
        </div>

        <div class="input-box">
          <label for="readonlySwicht">
            Read only
            ( {{ readonlySwicht ? 'Active' : 'Inactive' }} )
          </label>
          <InputSwitch v-model="readonlySwicht" />
        </div>
        <div class="input-box">
          <label for="directBossSwicht">
            Direct Boss
            ( {{ directBossSwicht ? 'Active' : 'Inactive' }} )
          </label>
          <InputSwitch v-model="directBossSwicht" />
        </div>
        <div class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            Save user
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