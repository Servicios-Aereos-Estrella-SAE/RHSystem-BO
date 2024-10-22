<template>
  <div v-if="isReady" class="proceeding-file-type-emails">
    <h1>
      Manage emails
    </h1>
    <h1>{{`${proceedingFileType.proceedingFileTypeName || ''}` }}</h1>

    <div class="head">
      <Button class="btn btn-block" @click="addNewEmail">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
        Add email
      </Button>
    </div>

    <div v-if="isReady">
      <div class="proceeding-file-type-emails-wrapper">
        <div v-for="(proceedingFileTypeEmail, index) in proceedingFileTypeEmails" :key="`proceeding-file-type-email-${index}`">
          <proceedingFileTypeEmailControl :proceeding-file-type-email="proceedingFileTypeEmail"
            :click-on-delete="() => { onDelete(proceedingFileTypeEmail, index) }" @onSave="onSave" />
        </div>
      </div>
      <Dialog v-model:visible="drawerProceedingFileTypeEmailDelete" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="shiftException"> Are you sure you want to delete email
            <b>{{ `${emailToDelete || ''}` }}</b>
            ?</span>
        </div>
        <template #footer>
          <Button label="No" icon="pi pi-times" text @click="drawerProceedingFileTypeEmailDelete = false" />
          <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
        </template>
      </Dialog>
    </div>
    <ProgressSpinner v-else />
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>