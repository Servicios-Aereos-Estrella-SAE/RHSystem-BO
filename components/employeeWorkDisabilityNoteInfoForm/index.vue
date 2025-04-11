<template>
  <div class="work-disability-info-form">
    <employeeModalInfoCard :employee="employee"/>
    <h1>
      {{ isNewWorkDisabilityNote ? 'Add work disability note' : 'Update work disability note' }}
    </h1>

    <div v-if="isReady" class="work-disability-note-form">
      <div class="form-container">
        <div  class="input-box">
          <label for="folio">
            Description note / comments
          </label>
          <Textarea
            id="proceedingFileObservations"
            v-model="workDisabilityNote.workDisabilityNoteDescription"
            autoResize
            rows="8"
            :disabled="!canManageWorkDisabilities" />
          <small class="p-error" v-if="submitted && !workDisabilityNote.workDisabilityNoteDescription">Description is required.</small>
        </div>
        <div class="box-tools-footer">
          <Button v-if="canManageWorkDisabilities" class="btn btn-block btn-primary" @click="onSave">
            Save work disability note
          </Button>
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
