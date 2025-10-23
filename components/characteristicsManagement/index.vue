<template>
  <div class="characteristics-management">
    <div class="management-header">
      <div class="header-info">
        <h2 class="management-title">{{ t('manage_characteristics') }}</h2>
        <p v-if="supplyType" class="management-description">{{ supplyType.supplyTypeName }}</p>
        <p v-else class="management-description">{{ t('no_supply_type_selected') }}</p>
      </div>
      <div class="header-actions">
        <Button
          :label="t('close')"
          icon="pi pi-times"
          class="p-button-secondary"
          @click="onCloseCharacteristicsManagement"
        />
        <Button
          v-if="canCreate"
          :label="t('add_characteristic')"
          icon="pi pi-plus"
          class="p-button-success"
          @click="addNewCharacteristic"
        />
      </div>
    </div>

    <div class="characteristics-list">
      <div
        v-for="characteristic in characteristics"
        :key="characteristic.supplieCaracteristicId"
        class="characteristic-item"
      >
        <CharacteristicCard
          :characteristic="characteristic"
          :can-update="canUpdate"
          :can-delete="canDelete"
          @click-edit="onEditCharacteristic"
          @click-delete="onDeleteCharacteristic"
        />
      </div>
    </div>

    <div v-if="characteristics.length === 0" class="empty-state">
      <i class="pi pi-cog empty-icon"></i>
      <h3>{{ t('no_characteristics_found') }}</h3>
      <p>{{ t('no_characteristics_found_description') }}</p>
      <Button
        v-if="canCreate"
        :label="t('add_first_characteristic')"
        icon="pi pi-plus"
        class="p-button-primary"
        @click="addNewCharacteristic"
      />
    </div>

    <!-- Characteristic Form Drawer -->
    <Sidebar
      v-model:visible="drawerCharacteristicForm"
      :header="characteristicFormTitle"
      position="right"
      :modal="true"
      class="characteristic-sidebar"
    >
      <CharacteristicForm
        v-if="selectedCharacteristic"
        :characteristic="selectedCharacteristic"
        :supply-type-id="supplyType.supplyTypeId"
        :can-update="canUpdate"
        :can-delete="canDelete"
        @save="onSaveCharacteristic"
        @close="onCloseCharacteristicForm"
      />
    </Sidebar>

    <Toast />
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
