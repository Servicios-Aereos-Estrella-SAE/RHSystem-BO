<template>
  <div v-if="isReady" class="employee-shift-vacations">
    <h1>
      Manage vacations
    </h1>

    <vacationsPeriodCard hideManager class="period-info" />

    <div class="head">
      <Button class="btn btn-block">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#88a4bf" class="fill-212121"></path></svg>
        Add vacation day
      </Button>
    </div>

    <div v-if="isReady">
      <div class="vacations-wrapper">
        <vacationsControl v-for="(item, index) in 10" :key="`employee-vacation-${index}`" />
      </div>
    </div>
    <ProgressSpinner v-else />

    <!-- <transition name="page">
      <confirmDelete
        v-if="drawerShiftExceptionDelete"
        @confirmDelete="confirmDelete"
        @cancelDelete="drawerShiftExceptionDelete = false"
      />
    </transition> -->
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>