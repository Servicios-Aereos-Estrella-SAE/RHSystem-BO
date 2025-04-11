<template>
  <div class="box user-info-form">
    <h4>
      {{ 'Assign Position' }}
    </h4>
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="input-box">
            <label for="shift">Positions</label>
            <Dropdown id="shift" v-model="positionSelected" :options="positions" optionLabel="positionName"
                placeholder="Select Position" :invalid="submitted && !positionSelected" />
            <small class="p-error" v-if="submitted && !positionSelected">Position is required.</small>
        </div>
        <div class="box-tools-footer">
          <Button label="Save" severity="primary" @click="onSave()" />
        </div>
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
  .shift-exception-sidebar {
    width: 100% !important;
    max-width: 70rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
  .shift-sidebar {
    width: 100% !important;
    max-width: 70rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
