<template>
  <div class="">
    <div class="file">
      <div class="menu-tools">
        <Button type="button" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"
          class="btn btn-gray btn-menu-tools">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM12 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM10 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"
              fill="#88a4bf" class="fill-212121"></path>
          </svg>
        </Button>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      </div>
      <div class="icon">
        <img :src="fileIcon" />
      </div>
      <div class="type">
        {{ `${employeeProceedingFile.proceedingFile.proceedingFileType.proceedingFileTypeName}` }}
      </div>
      <div class="file-info">
        <div class="opt-val name">
          <div class="opt">
            Name
          </div>
          <div class="val">
            {{ `${employeeProceedingFile.proceedingFile.proceedingFileName}` }}
          </div>
        </div>
        <div class="opt-val expiration">
          <div class="opt">
            Expiration at
          </div>
          <div class="val">
            <span v-if="employeeProceedingFile.proceedingFile.proceedingFileExpirationAt">
              {{ `${calendarDay}` }}
            </span>
            <span v-else>
              ---
            </span>
          </div>
        </div>
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