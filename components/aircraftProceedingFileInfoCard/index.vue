<template>
  <div class="file">
    <div class="icon">
      <img :src="fileIcon" />
    </div>
    <div class="file-info">
      <div class="opt-val name">
        {{ `${aircraftProceedingFile.proceedingFile.proceedingFileName}` }}
      </div>
      <div class="opt-val expiration">
        <div class="opt">
          Expiration at:
        </div>
        <div class="val">
          <span v-if="aircraftProceedingFile.proceedingFile.proceedingFileExpirationAt">
            {{ `${calendarDay}` }}
          </span>
          <span v-else>
            ---
          </span>
        </div>
      </div>
    </div>
    <div class="menu-tools">
      <Button type="button" @click="toggle" class="btn btn-gray btn-menu-tools" aria-haspopup="true"
        aria-controls="overlay_menu">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM12 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM10 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
      </Button>
      <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import '/resources/styles/variables.scss';

  @import './style';
</style>