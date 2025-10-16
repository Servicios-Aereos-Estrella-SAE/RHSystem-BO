<template>
  <div class="shift-exception-form">
    <div class="form-header">
      <h3>{{ $t('create_vacation_request') }}</h3>
      <p class="description">{{ $t('create_new_vacation_request_for_employee') }}</p>
    </div>

    <div v-if="isLoading" class="loading-container">
      <ProgressSpinner />
      <p>{{ $t('loading_form_data') }}</p>
    </div>

    <div v-else class="form-content">
      <div class="form-container">
        <!-- Tipo de excepción (predeterminado a vacaciones) -->
        <div class="input-box">
          <label for="exception-type">
            {{ $t('type') }}
          </label>
          <Dropdown
            v-model="exceptionRequest.exceptionTypeId"
            :options="exceptionTypeList"
            optionLabel="exceptionTypeTypeName"
            optionValue="exceptionTypeId"
            placeholder=""
            class="w-full"
            :disabled="true"
          />
          <small class="p-info">
            {{ $t('vacation_request_type_predetermined') }}
          </small>
        </div>

        <!-- Descripción -->
        <div class="input-box">
          <label for="description">
            {{ $t('description') }}
          </label>
          <Textarea
            v-model="exceptionRequest.exceptionRequestDescription"
            rows="3"
            cols="30"
            :placeholder="$t('enter_vacation_request_description')"
          />
          <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestDescription">
            {{ $t('description') }} {{ $t('is_required') }}
          </small>
        </div>

        <!-- Fecha solicitada -->
        <div class="input-box">
          <label for="requested-date">
            {{ $t('requested_date') }}
          </label>
          <Calendar
            v-model="exceptionRequest.requestedDate"
            dateFormat="yy-mm-dd"
            placeholder="Select date"
            class="w-full"
            :minDate="startDateLimit"
          />
          <small class="p-error" v-if="submitted && !exceptionRequest.requestedDate">
            {{ $t('requested_date') }} {{ $t('is_required') }}
          </small>
        </div>

        <!-- Aplicar a más de un día -->
        <div class="input-box">
          <div class="checkbox-item">
            <Checkbox
              v-model="applyToMoreThanOneDay"
              inputId="applyToMoreThanOneDay"
              name="applyToMoreThanOneDay"
              :binary="true"
            />
            <label for="applyToMoreThanOneDay" class="ml-2">
              {{ $t('apply_to_more_than_one_day') }}
            </label>
          </div>
        </div>

        <!-- Días a aplicar -->
        <div v-if="applyToMoreThanOneDay" class="input-box">
          <label for="days-to-apply">
            {{ $t('days_to_apply') }}
          </label>
          <InputNumber
            v-model="exceptionRequest.daysToApply"
            inputId="daysToApply"
            :min="1"
            :max="30"
          />
          <small class="p-error" v-if="submitted && applyToMoreThanOneDay && !exceptionRequest.daysToApply">
            {{ $t('days_to_apply') }} {{ $t('is_required') }}
          </small>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="form-actions">
        <Button
          :label="$t('create_request')"
          icon="pi pi-plus"
          class="p-button-success"
          :loading="isCreating"
          @click="createExceptionRequest"
        />
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
