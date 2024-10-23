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
            :click-on-delete="() => { onDelete(proceedingFileTypeEmail, index) }" />
        </div>
        <h5 v-if="legacyProceedingFileTypeEmails.length > 0">Legacy emails</h5>
        <div v-for="(proceedingFileTypeEmail, index) in legacyProceedingFileTypeEmails" :key="`legacy-proceeding-file-type-emaiL-${index}`">
         <span>{{ proceedingFileTypeEmail.proceedingFileTypeEmailEmail }}</span>
        </div>
      </div>
      <transition name="page">
        <confirmDelete
          v-if="drawerProceedingFileTypeEmailDelete"
          @confirmDelete="confirmDelete"
          @cancelDelete="drawerProceedingFileTypeEmailDelete = false"
        />
      </transition>
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