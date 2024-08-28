<template>
  <div>
    <Toast />
    <div class="system-settings-page">

      <Head>
        <Title>
          System Settings
        </Title>
      </Head>
      <NuxtLayout name="backoffice">
        <div class="system-setting-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <label for="search">
                Search
              </label>
              <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchSystemSetting"
                @keyup.delete="handlerSearchSystemSetting" />
            </div>
            <div class="input-box">
              <br />
              <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
            </div>
          </div>
          <div>
            <h2>
              System Settings
            </h2>
            <div class="system-setting-card-wrapper">
              <div v-for="(systemSetting, index) in filteredSystemSettings" :key="`system-setting-${systemSetting.systemSettingId}-${index}`">
                <SystemSettingInfoCard :click-on-photo="() => { onPhoto(systemSetting) }" :systemSetting="systemSetting"
                  :click-on-edit="() => { onEdit(systemSetting) }" :click-on-delete="() => { onDelete(systemSetting) }" />
              </div>
            </div>
            <div></div>
            <Paginator class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
              @page="onPageChange" />
            <!-- Form Shift -->
            <div class="card flex justify-content-center">
              <Sidebar v-model:visible="drawerSystemSettingForm" header="System Setting form" position="right"
                class="system-setting-form-sidebar" :showCloseIcon="true">
                <systemSettingInfoForm :systemSetting="systemSetting" @save="onSave" />
              </Sidebar>
            </div>
          </div>
        </div>
        <Dialog v-model:visible="drawerSystemSettingDelete" :style="{width: '450px'}" header="Confirm" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="systemSetting"> Are you sure you want to delete
              ?</span>
          </div>
          <template #footer>
            <Button label="No" icon="pi pi-times" text @click="drawerSystemSettingDelete = false" />
            <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
          </template>
        </Dialog>
      </NuxtLayout>
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

<style lang="scss">
  @import '/resources/styles/variables.scss';
 
  .system-setting-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>

