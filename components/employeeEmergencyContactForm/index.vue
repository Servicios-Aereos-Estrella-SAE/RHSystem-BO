<template>
  <div class="employee-emergency-contact-form">
    <div class="form-header">
      <h2>{{ isEditing ? $t('edit_emergency_contact') : $t('add_emergency_contact') }}</h2>
    </div>

    <div class="form-container">
      <div class="inputs-group">
        <div class="group-1">
          <div class="input-box">
            <label for="employeeEmergencyContactFirstname">{{ $t('first_name') }}</label>
            <InputText
              v-model="formData.employeeEmergencyContactFirstname"
              :placeholder="`${$t('enter')} ${$t('first_name')}`"
              :disabled="isDeleted || !canManageUserResponsible"
              :invalid="submitted && !formData.employeeEmergencyContactFirstname"
            />
            <small class="p-error" v-if="submitted && !formData.employeeEmergencyContactFirstname">
              {{ $t('first_name') }} {{ $t('is_required') }}
            </small>
          </div>
        </div>
        <div class="group-1">
          <div class="input-box">
            <label for="employeeEmergencyContactLastname">{{ $t('last_name') }}</label>
            <InputText
              v-model="formData.employeeEmergencyContactLastname"
              :placeholder="`${$t('enter')} ${$t('last_name')}`"
              :disabled="isDeleted || !canManageUserResponsible"
              :invalid="submitted && !formData.employeeEmergencyContactLastname"
            />
            <small class="p-error" v-if="submitted && !formData.employeeEmergencyContactLastname">
              {{ $t('last_name') }} {{ $t('is_required') }}
            </small>
          </div>
          <div class="input-box">
            <label for="employeeEmergencyContactSecondLastname">{{ $t('second_last_name') }}</label>
            <InputText
              v-model="formData.employeeEmergencyContactSecondLastname"
              :placeholder="`${$t('enter')} ${$t('second_last_name')}`"
              :disabled="isDeleted || !canManageUserResponsible"
              :invalid="submitted && !formData.employeeEmergencyContactSecondLastname"
            />
            <small class="p-error" v-if="submitted && !formData.employeeEmergencyContactSecondLastname">
              {{ $t('second_last_name') }} {{ $t('is_required') }}
            </small>
          </div>
        </div>

        <div class="input-box">
          <label for="employeeEmergencyContactRelationship">{{ $t('relationship') }}</label>
          <InputText
            v-model="formData.employeeEmergencyContactRelationship"
            :placeholder="`${$t('enter')} ${$t('relationship')}`"
            :disabled="isDeleted || !canManageUserResponsible"
            :invalid="submitted && !formData.employeeEmergencyContactRelationship"
          />
          <small class="p-error" v-if="submitted && !formData.employeeEmergencyContactRelationship">
            {{ $t('relationship') }} {{ $t('is_required') }}
          </small>
        </div>

        <div class="input-box">
          <label for="employeeEmergencyContactPhone">{{ $t('phone') }}</label>
          <InputMask
            v-model="formData.employeeEmergencyContactPhone"
            mask="(999) 999 99 99"
            :placeholder="`${$t('enter')} ${$t('phone')}`"
            :disabled="isDeleted || !canManageUserResponsible"
            :invalid="submitted && !formData.employeeEmergencyContactPhone"
          />
          <small class="p-error" v-if="submitted && !formData.employeeEmergencyContactPhone">
            {{ $t('phone') }} {{ $t('is_required') }}
          </small>
        </div>
      </div>

      <div class="form-actions">
        <Button
          :label="$t('cancel')"
          class="btn btn-block"
          @click="onCancel"
          :disabled="isLoading"
        />
        <Button
          :label="isEditing ? $t('update') : $t('save')"
          class="btn btn-primary btn-block"
          @click="onSave"
          :disabled="isDeleted || !canManageUserResponsible || isLoading"
        />
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
