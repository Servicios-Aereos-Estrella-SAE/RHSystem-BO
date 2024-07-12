<template>
  <div class="box user-info-form">
    <Toast />
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="input-box">
          <label for="employeePhoto">Employee Photo</label>
          <FileUpload name="photo" url="your-upload-url" accept="image/*" maxFileSize="1000000"
            @upload="onUpload" @select="onSelect" />
        </div>
        <!-- <div class="box-tools-footer">
          <Button label="Guardar" severity="primary" @click="onSave()" />
        </div> -->
      </div>
    </div>
  </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';
</style>