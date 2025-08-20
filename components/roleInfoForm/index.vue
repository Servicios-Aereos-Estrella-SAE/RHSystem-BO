<template>
  <div class="role-info-form">

    <h1>
      {{ isNewRole ? 'New role' : 'Update role' }}
    </h1>
    <div v-if="isReady" class="role-form">
      <div class="form-container">
        <div class="checkbox-item">
          <Checkbox v-model="activeSwicht" inputId="activeSwicht" name="activeSwicht" :binary="true" />
          <label for="activeSwicht">
            {{ activeSwicht ? 'Active' : 'Inactive' }}
          </label>
        </div>
        <div class="input-box">
          <label for="roleName">
            Name</label>
          <InputText id="roleName" v-model="role.roleName" :invalid="submitted && !role.roleName" />
          <small class="p-error" v-if="submitted && !role.roleName">Name is required.</small>
        </div>
        <div class="input-box">
          <label for="roleDescription">
            Description</label>
          <Textarea id="roleDescription" v-model="role.roleDescription" :invalid="submitted && !role.roleDescription"
            rows="3" autoResize />
          <small class="p-error" v-if="submitted && !role.roleDescription">Description is required.</small>
        </div>

        <div class="box-tools-footer form-buttons">
          <button class="btn btn-primary btn-block" @click="onSave">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                fill="#ffffff" class="fill-212121"></path>
            </svg>
            Save
          </button>
        </div>
      </div>
    </div>
    <div v-else class="loader">
      <ProgressSpinner />
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