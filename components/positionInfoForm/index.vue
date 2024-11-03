<template>
  <div class="position-info-form">
    <Toast />

    <div class="position-form">
      <div class="form-container">
        <div>
          <div class="input-box">
            <label for="positionName">Position Name</label>
            <InputText id="positionName" v-model="position.positionName" :invalid="submitted && !position.positionName" />
            <small class="p-error" v-if="submitted && !position.positionName">
              Position name is required.
            </small>
          </div>

          <div class="input-box">
            <label for="parentPositionId">
              Dependency Position
            </label>
            <Dropdown
              id="parentPositionId"
              v-model="position.parentPositionId"
              optionLabel="positionName"
              optionValue="positionId"
              :options="positions"
              :placeholder="'Select a Parent Position'"
              :disabled="!positions.length"
            />
          </div>
        </div>

        <div class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z" fill="#ffffff" class="fill-212121"></path></svg>
            Save
          </Button>
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
