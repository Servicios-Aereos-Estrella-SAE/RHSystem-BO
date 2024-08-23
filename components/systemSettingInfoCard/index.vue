<template>
  <div class="box system-setting-info-card">
    <div class="avatar" @click="onClickPhoto">
      <img v-if="systemSetting.systemSettingLogo" :src="systemSetting.systemSettingLogo" alt="System Setting Logo"
        class="system-setting-logo" />
      <svg v-else class="bi bi-image-alt" fill="#87a4bf" viewBox="0 0 16 16" xmlns="
http://www.w3.org/2000/svg">
        <path
          d="M7 2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm4.225 4.053a.5.5 0 0 0-.577.093l-3.71 4.71-2.66-2.772a.5.5 0 0 0-.63.062L.002 13v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4.5l-4.777-3.947z">
        </path>
      </svg>
    </div>
    <div class="name capitalize">
      {{ `${systemSetting.systemSettingTradeName || ''}` }}
    </div>
    <div class="line">
    </div>
    <div class="info info-color">
      <label for="color"> Sidebar color</label>
      <div class="color" :style="{ backgroundColor: '#' + systemSetting.systemSettingSidebarColor }"></div>
    </div>
    <div class="info status">
      <label for="status">Status</label>
      <span> {{ systemSetting.systemSettingActive ? 'Active' : 'Inactive' }}</span>
    </div>
    <div class="box-tools-footer">
      <Button icon="pi pi-pencil" class="box-btn" @click="handlerClickOnEdit()" />
      <Button icon="pi pi-trash" class="box-btn btn-red" @click="handlerClickOnDelete()" />
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