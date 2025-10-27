<template>
  <div class="characteristic-card">
    <div class="card-header">
      <div class="characteristic-info">
        <h4 class="characteristic-name">{{ characteristic.supplieCaracteristicName }}</h4>
        <p class="characteristic-type">{{ getTypeLabel(characteristic.supplieCaracteristicType) }}</p>
      </div>
    </div>

    <div class="card-actions">
      <Button
        v-if="canUpdate"
        :label="t('edit')"
        icon="pi pi-pencil"
        class="btn btn-block"
        @click="handlerClickOnEdit"
      />
      <Button
        v-if="canDelete"
        :label="t('delete')"
        icon="pi pi-trash"
        class="btn btn-block"
        @click="handlerClickOnDelete"
      />
    </div>

  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
