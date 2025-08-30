<template>
  <div class="exception-request-info-form">
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ isNewExceptionRequest ? $t('add_exception_request') : $t('update_exception_request') }}
    </h1>

    <div v-if="isReady" class="exception-request-form">
      <div class="form-container">
        <div v-if="!exceptionRequest.exceptionRequestId" class="input-box">
          <label for="exception-type">
          </label>
          <div class="checkbox-item">
            <Checkbox v-model="applyToMoreThanOneDay" inputId="applyToMoreThanOneDay" name="applyToMoreThanOneDay"
              :binary="true" />
            <label for="applyToMoreThanOneDay" class="ml-2"> {{ $t('apply_to_more_than_one_day') }} </label>
          </div>
        </div>
        <div v-if="applyToMoreThanOneDay" class="input-box">
          <label for="description">
            {{ $t('days_to_apply') }}
          </label>
          <InputNumber v-model="exceptionRequest.daysToApply" inputId="daysToApply" />
          <small class="p-error" v-if="submitted && !exceptionRequest.daysToApply">
            {{ $t('days_to_apply') }} {{ $t('is_required') }}
          </small>
        </div>
        <div class="input-box">
          <label for="exception-type">
            {{ $t('status') }}
          </label>
          <Dropdown v-model="exceptionRequest.exceptionRequestStatus" :options="getStatusOptions" optionLabel="label"
            optionValue="value" placeholder="Select Status" class="w-full md:w-14rem" :disabled="true" />
          <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestStatus">
            {{ $t('status') }} {{ $t('is_required') }}
          </small>
        </div>
        <div class="input-box">
          <label for="exception-type">
            {{ $t('type') }}
          </label>
          <Dropdown v-model="exceptionRequest.exceptionTypeId" :options="exceptionTypeList"
            optionLabel="exceptionTypeTypeName" optionValue="exceptionTypeId" placeholder="" filter
            class="w-full md:w-14rem" @update:model-value="handleTypeChange"
            :disabled="changeStatus || exceptionRequest.exceptionRequestStatus !== 'pending' || !canManageUserResponsible || !canManageCurrentDay" />
          <small class="p-error" v-if="submitted && !exceptionRequest.exceptionTypeId">{{ $t('type') }} {{
            $t('is_required') }}</small>
        </div>
        <div class="input-box">
          <label for="description">
            {{ $t('description') }}
          </label>
          <Textarea v-model="exceptionRequest.exceptionRequestDescription" rows="5" cols="30"
            :disabled="changeStatus || exceptionRequest.exceptionRequestStatus !== 'pending' || !canManageUserResponsible || !canManageCurrentDay" />
          <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestDescription">
            {{ $t('description') }} {{ $t('is_required') }}
          </small>
        </div>
        <div class="input-box">
          <label for="requested-date">
            {{ $t('requested_date') }}
          </label>
          <Calendar v-model="exceptionRequest.requestedDate" dateFormat="yy-mm-dd" placeholder="Select date"
            class="w-full md:w-14rem"
            :disabled="changeStatus || exceptionRequest.exceptionRequestStatus !== 'pending' || !canManageUserResponsible || !canManageCurrentDay"
            :minDate="startDateLimit" />
          <small class="p-error" v-if="submitted && !exceptionRequest.requestedDate">
            {{ $t('requested_date') }} {{ $t('is_required') }}
          </small>
        </div>
        <div v-if="needCheckInTime" class="input-box">
          <label for="check-in-time">
            {{ $t('check_in_time') }}
          </label>
          <Calendar v-model="exceptionRequest.exceptionRequestCheckInTime" timeOnly
            :disabled="changeStatus || exceptionRequest.exceptionRequestStatus !== 'pending' || !canManageUserResponsible || !canManageCurrentDay" />
          <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestCheckInTime">
            {{ $t('check_in_time') }} {{ $t('is_required') }}
          </small>
        </div>
        <div v-if="needCheckOutTime" class="input-box">
          <label for="check-out-time">
            {{ $t('check_out_time') }}
          </label>
          <Calendar v-model="exceptionRequest.exceptionRequestCheckOutTime" timeOnly
            :disabled="changeStatus || exceptionRequest.exceptionRequestStatus !== 'pending' || !canManageUserResponsible || !canManageCurrentDay" />
          <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestCheckOutTime">
            {{ $t('check_out_time') }} {{ $t('is_required') }}
          </small>
        </div>
        <div class="box-tools-footer">
          <Button
            v-if="!changeStatus && exceptionRequest.exceptionRequestStatus === 'pending' && canManageUserResponsible && canManageCurrentDay"
            class="btn btn-block btn-primary" @click="onSave">
            {{ $t('save') }}
          </Button>
          <Button v-if="changeStatus && canUpdate" icon="pi pi-check" class="box-btn" @click="handlerClickOnEdit()" />
          <Button v-if="changeStatus && canDelete" icon="pi pi-times" class="box-btn"
            @click="handlerClickOnDecline()" />
        </div>
      </div>
    </div>
    <transition name="page">
      <confirmRefuse v-if="drawerExceptionRequestDelete" :actionType="currentAction" @confirmRefuse="confirmDelete"
        @confirmAccept="confirmAccept" @cancelRefused="drawerExceptionRequestDelete = false" />
    </transition>
    <transition name="page">
      <div v-if="drawerExceptionRequestDeletes" class="modal-overlay">
        <div class="modal-content">
          <h3>{{ currentAction === 'refuse' ? $t('refuse_exception_request') : $t('accept_exception_request') }}</h3>
          <p v-if="currentAction === 'refuse'">{{ $t('please_provide_a_reason_for_refuse') }}</p>
          <textarea v-if="currentAction === 'refuse'" v-model="description"
            :placeholder="$t('enter_the_reason_for_refuse')" class="textarea"></textarea>
          <div class="modal-actions">
            <Button label="Cancel" class="btn btn-cancel" @click="drawerExceptionRequestDeletes = false" />
            <Button label="Confirm" class="btn btn-confirm"
              :disabled="currentAction === 'refuse' && !description.trim()"
              @click="currentAction === 'refuse' ? (drawerExceptionRequestDelete = true, drawerExceptionRequestDeletes = false) : confirmAccept()" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';
</style>