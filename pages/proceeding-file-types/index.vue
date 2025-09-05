<template>
  <div>

    <div class="proceeding-file-types-page">

      <Head>
        <Title>
          {{ $t('proceeding_file_types') }}
        </Title>
      </Head>
      <NuxtLayout name="backoffice">
        <div class="proceeding-file-type-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <label for="search">
                {{ $t('search') }}
              </label>
              <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchProceedingFileType"
                @keyup.delete="handlerSearchProceedingFileType" />
            </div>
            <div class="input-box">
              <br />
              <Button v-if="canCreate" class="btn-add mr-2" :label="`${$t('add')} ${$t('proceeding_file_type')}`"
                icon="pi pi-plus" severity="primary" @click="addNew" />
            </div>
          </div>
          <div>
            <h2>
              {{ $t('proceeding_file_types') }}
            </h2>
            <div class="proceeding-file-type-card-wrapper">
              <div v-for="(ProceedingFileType, index) in filteredProceedingFileTypes"
                :key="`proceeding-file-type-${ProceedingFileType.proceedingFileTypeId}-${index}`">
                <proceedingFileTypeInfoCard :proceeding-file-type="ProceedingFileType" :can-update="canUpdate"
                  :can-delete="canDelete" :click-on-edit="() => { onEdit(ProceedingFileType) }"
                  :click-on-delete="() => { onDelete(ProceedingFileType) }" />
              </div>
            </div>
            <div></div>
            <Paginator class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
              @page="onPageChange" />
            <!-- Form Shift -->
            <div class="card flex justify-content-center">
              <Sidebar v-model:visible="drawerProceedingFileTypeForm"
                :header="`${$t('proceeding_file_type')} ${$t('form')}`" position="right"
                class="proceeding-file-type-form-sidebar" :showCloseIcon="true">
                <proceedingFileTypeInfoForm :proceeding-file-type="proceedingFileType" @save="onSave" />
              </Sidebar>
            </div>
          </div>
        </div>
        <Dialog v-model:visible="drawerProceedingFileTypeDelete" :style="{width: '450px'}" :header="$t('confirm')"
          :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="proceedingFileType"> {{ $t('are_you_sure_you_want_to_delete') }}</span>
          </div>
          <template #footer>
            <Button :label="$t('no')" icon="pi pi-times" text @click="drawerProceedingFileTypeDelete = false" />
            <Button :label="$t('yes')" icon="pi pi-check" text @click="confirmDelete()" />
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

  .proceeding-file-type-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>