<template>
  <div class="folder-container">
    <div class="folder" @click="handlerDoubleClick">
      <div class="icon">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.821 6.5h5.929a2.25 2.25 0 0 1 2.229 1.938l.016.158.005.154v9a2.25 2.25 0 0 1-2.096 2.245L19.75 20H4.25a2.25 2.25 0 0 1-2.245-2.096L2 17.75v-7.251l6.207.001.196-.009a2.25 2.25 0 0 0 1.088-.393l.156-.12L13.821 6.5ZM8.207 4c.46 0 .908.141 1.284.402l.156.12 2.103 1.751-3.063 2.553-.085.061a.75.75 0 0 1-.29.106L8.206 9 2 8.999V6.25a2.25 2.25 0 0 1 2.096-2.245L4.25 4h3.957Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
      </div>
      <div class="folder-name">
        {{
        folder.proceedingFileTypeName ? `${capitalizeFirstLetter($t(folder.proceedingFileTypeName.toLocaleLowerCase()))}` : ''
        }}
      </div>
    </div>
    <!-- <div v-if="canManageFiles" class="folder-actions">
      <Button class="btn btn-add-subfolder" @click.stop="addSubfolder" v-tooltip="$t('add_subfolder')">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2.5a1.5 1.5 0 0 1 1.5 1.5v1.5h3.75a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5H6.75a1.5 1.5 0 0 1-1.5-1.5V6a1.5 1.5 0 0 1 1.5-1.5H10.5V4a1.5 1.5 0 0 1 1.5-1.5ZM12 6H6.75v12h10.5V6H12Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
      </Button>
    </div> -->
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>
