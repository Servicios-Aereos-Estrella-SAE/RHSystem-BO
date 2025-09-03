<template>
  <div class="employee-user-responsible-info-form">
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ isNewUserResponsibleEmployee ? $t('add_user_responsible_employee') : $t('update_user_responsible_employee') }}
    </h1>

    <div v-if="isReady" class="employee-user-responsible-form">
      <div class="form-container">
        <div class="input-box">
          <label for="user">
            {{ $t('user') }}
          </label>
          <Dropdown v-model="userResponsibleEmployee.userId" :options="usersList"
            :optionLabel="option => `${option.person.personFirstname} ${option.person.personLastname} ${option.person.personSecondLastname}`"
            optionValue="userId" :placeholder="`${$t('select')} ${$t('user')}`" filter class="w-full md:w-14rem"
            :disabled="!isNewUserResponsibleEmployee || isDeleted || !canManageUserResponsible" />
          <small class="p-error" v-if="submitted && !userResponsibleEmployee.userId">{{ $t('user') }} {{
            $t('is_required') }}</small>
        </div>

        <div class="input-box">
          <label for="readonlySwicht">
            {{ $t('readonly') }}
            ( {{ readonlySwicht ? $t('active') : $t('inactive') }} )
          </label>
          <InputSwitch v-model="readonlySwicht" :disabled="isDeleted || !canManageUserResponsible" />
        </div>
        <div class="input-box">
          <label for="directBossSwicht">
            {{ $t('direct_boss') }}
            ( {{ directBossSwicht ? $t('active') : $t('inactive') }} )
          </label>
          <InputSwitch v-model="directBossSwicht" :disabled="isDeleted || !canManageUserResponsible" />
        </div>
        <div class="box-tools-footer">
          <Button v-if="canManageUserResponsible" class="btn btn-block btn-primary" @click="onSave">
            {{ $t('save') }}
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