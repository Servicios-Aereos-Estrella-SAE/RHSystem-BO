<template>
  <div class="box user-info-form">
    <Toast />
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div v-if="currentPhotoUrl">
          <img :src="currentPhotoUrl" alt="Employee Photo" style="max-width: 200px;" />
        </div>
        <div class="input-box">
          <label for="employeePhoto">Employee Photo</label>
          <FileUpload name="photo" accept="image/*" :maxFileSize="maxFileSize"
            @upload="onUpload" @select="onSelect" />
        </div>
        <!-- <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave()" />
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