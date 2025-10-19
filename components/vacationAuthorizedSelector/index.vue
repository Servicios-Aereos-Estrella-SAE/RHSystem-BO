<template>
  <div class="vacation-authorized-selector">
    <div class="selector-header">
      <h3>{{ $t('authorized_vacations_without_signature') }}</h3>
      <p class="description">{{ $t('select_vacations_to_authorize') }}</p>
    </div>

    <div v-if="loading" class="loading-container">
      <ProgressSpinner />
      <p>{{ $t('loading_vacations') }}</p>
    </div>

    <div v-else-if="shiftExceptions.length === 0" class="no-requests">
      <div class="no-requests-icon">
        <i class="pi pi-calendar-times"></i>
      </div>
      <p>{{ $t('no_authorized_vacations_without_signature') }}</p>
    </div>

    <div v-else class="requests-list">
      <div
        v-for="shiftException in shiftExceptions"
        :key="shiftException.shiftExceptionId"
        class="request-item"
        :class="{ 'selected': selectedShiftExceptions.includes(shiftException.shiftExceptionId) }"
        @click="toggleSelection(shiftException.shiftExceptionId)"
      >
        <div class="request-content">
          <div class="request-date">
            <i class="pi pi-calendar"></i>
            <span>{{ formatDate(shiftException.shiftExceptionsDate) }}</span>
          </div>
          <div class="request-description">
            <i class="pi pi-info-circle"></i>
            <span>{{ shiftException.shiftExceptionsDescription || $t('vacation_request') }}</span>
          </div>
          <div class="request-status">
            <Tag :value="$t('accepted')" severity="success" />
          </div>
        </div>
        <div class="request-actions">
          <Checkbox
            :modelValue="selectedShiftExceptions.includes(shiftException.shiftExceptionId)"
            @update:modelValue="toggleSelection(shiftException.shiftExceptionId)"
            :binary="true"
          />
        </div>
      </div>
    </div>

    <div v-if="shiftExceptions.length > 0" class="selector-footer">
      <div class="selection-info">
        <span>{{ $t('selected_requests') }}: {{ selectedShiftExceptions.length }} / {{ shiftExceptions.length }}</span>
      </div>
      <div class="selection-actions">
        <Button
          :label="$t('select_all')"
          icon="pi pi-check-square"
          class="p-button-outlined p-button-sm"
          @click="selectAll"
          :disabled="selectedShiftExceptions.length === shiftExceptions.length"
        />
        <Button
          :label="$t('clear_selection')"
          icon="pi pi-times"
          class="p-button-outlined p-button-sm"
          @click="clearSelection"
          :disabled="selectedShiftExceptions.length === 0"
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
