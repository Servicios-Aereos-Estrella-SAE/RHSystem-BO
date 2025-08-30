<template>
  <div class="work-disability-info-form">
    <employeeModalInfoCard :employee="employee" />
    <h1>
      {{ isNewWorkDisabilityNote ? $t('add_work_disability_note') : $t('update_work_disability_note') }}
    </h1>

    <div v-if="isReady" class="work-disability-note-form">
      <div class="form-container">
        <div class="input-box">
          <label for="folio">
            {{ $t('description_note_comments') }}
          </label>
          <Textarea id="proceedingFileObservations" v-model="workDisabilityNote.workDisabilityNoteDescription"
            autoResize rows="8" :disabled="!canManageWorkDisabilities || !canManageUserResponsible" />
          <small class="p-error" v-if="submitted && !workDisabilityNote.workDisabilityNoteDescription">{{
            $t('description') }} {{ $t('is_required') }}</small>
        </div>
        <div class="box-tools-footer">
          <Button v-if="canManageWorkDisabilities && canManageUserResponsible" class="btn btn-block btn-primary"
            @click="onSave">
            {{ $t('save') }}
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