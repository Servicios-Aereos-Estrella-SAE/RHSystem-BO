<template>
  <div class="vacation-request-selector">
    <div class="selector-header">
      <h3>{{ $t('pending_vacation_requests') }}</h3>
      <p class="description">{{ $t('select_vacation_requests_to_authorize') }}</p>
    </div>

    <div v-if="isLoading" class="loading-container">
      <ProgressSpinner />
      <p>{{ $t('loading_pending_requests') }}</p>
    </div>

    <div v-else-if="pendingRequests.length === 0" class="no-requests">
      <div class="no-requests-icon">
        <i class="pi pi-calendar-times"></i>
      </div>
      <p>{{ $t('no_pending_vacation_requests') }}</p>
    </div>

    <div v-else class="requests-list">
      <div 
        v-for="request in pendingRequests" 
        :key="request.exceptionRequestId"
        class="request-item"
        :class="{ 'selected': selectedRequests.includes(request.exceptionRequestId) }"
        @click="toggleRequest(request.exceptionRequestId)"
      >
        <div class="request-content">
          <div class="request-date">
            <i class="pi pi-calendar"></i>
            <span>{{ formatDate(request.requestedDate) }}</span>
          </div>
          <div class="request-description">
            <i class="pi pi-info-circle"></i>
            <span>{{ request.exceptionRequestDescription || $t('vacation_request') }}</span>
          </div>
          <div class="request-status">
            <Tag :value="$t('pending')" severity="warning" />
          </div>
        </div>
        <div class="request-actions">
          <Checkbox 
            :modelValue="selectedRequests.includes(request.exceptionRequestId)"
            @update:modelValue="toggleRequest(request.exceptionRequestId)"
            :binary="true"
          />
        </div>
      </div>
    </div>

    <div v-if="pendingRequests.length > 0" class="selector-footer">
      <div class="selection-info">
        <span>{{ $t('selected_requests') }}: {{ selectedRequests.length }} / {{ pendingRequests.length }}</span>
      </div>
      <div class="selection-actions">
        <Button 
          :label="$t('select_all')" 
          icon="pi pi-check-square" 
          class="p-button-outlined p-button-sm"
          @click="selectAll"
          :disabled="selectedRequests.length === pendingRequests.length"
        />
        <Button 
          :label="$t('clear_selection')" 
          icon="pi pi-times" 
          class="p-button-outlined p-button-sm"
          @click="clearSelection"
          :disabled="selectedRequests.length === 0"
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
