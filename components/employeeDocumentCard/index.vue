<template>
  <div class="card-container" @click="handlerClickOnCard">
    <div class="card-icon" :class="classCard">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person-lines-fill" viewBox="0 0 16 16">
          <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
        </svg>
      </div>
      <div class="indicator">
        Employees
      </div>
    </div>

    <div class="card-content">
      <div class="percentage" :class="classCard">
        {{ getPercentage }}%
      </div>

      <div class="description">Employee documents available</div>

      <div class="details">
        <span>
          <span class="expired">
            {{ `${proceedingFilesExpiredCount}`.padStart(2, '0') }}
          </span>
          Expired files
        </span>
        <span>
          <span class="next-expire">
            {{ `${proceedingFilesExpiringCount}`.padStart(2, '0') }}
          </span>
          Next to expire
        </span>
      </div>
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
