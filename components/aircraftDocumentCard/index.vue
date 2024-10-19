<template>
  <div class="card-container" @click="handlerClickOnCard">
    <div class="card-icon" :class="classCard">
      <span class="icon-placeholder" :class="classCard">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.989 11.946a1.991 1.991 0 0 1-2.05 1.99l-4.738-.139-3.454 7.143c-.277.574-.86.94-1.498.94a.926.926 0 0 1-.919-1.037l.862-7.193-3.765-.11-.49 1.341a1.29 1.29 0 0 1-1.211.847.901.901 0 0 1-.901-.902V13.35l-.81-.169a1.261 1.261 0 0 1 0-2.469l.81-.168V9.066c0-.46.343-.838.788-.894l.113-.007a1.29 1.29 0 0 1 1.21.846l.492 1.34 3.751-.11-.849-7.084a.93.93 0 0 1-.005-.055l-.002-.055c0-.511.415-.926.926-.926.585 0 1.123.307 1.423.8l.075.14 3.403 7.035 4.79-.14a1.991 1.991 0 0 1 2.048 1.932l.001.058Z" fill="#fff" class="fill-212121"></path></svg>
      </span>
    </div>
    <div class="card-content">
      <div class="percentage" :class="classCard">
        <span v-if="getPercentage === 0">
          Good!
        </span>
        <span v-else>
          {{ getPercentage }}%
        </span>
      </div>
      <div class="description">
        <span v-if="getPercentage === 0">
          Aircraft documents are valid
        </span>
        <span v-else>
          Aircraft documents expired
        </span>
      </div>
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