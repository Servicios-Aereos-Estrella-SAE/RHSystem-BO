<template>
  <div class="position-info-form">


    <div class="position-form">
      <div class="form-container">
        <div>
          <div class="input-box">
            <label for="parentDepartmentId">
              {{ $t('type_position') }}
            </label>
            <Dropdown v-model="prefix" :options="prefixList" optionLabel="label" optionValue="prefix" />
          </div>

          <div class="input-box">
            <label>{{ $t('position_order_position') }}</label>
            <InputNumber v-model="positionNumber" :placeholder="$t('enter_department_position') " :min="1" :max="99" />
          </div>

          <div class="input-box">
            <label for="positionName">{{ $t('position_name') }}</label>
            <InputText id="positionName" v-model="position.positionName"
              :invalid="submitted && !position.positionName" />
            <small class="p-error" v-if="submitted && !position.positionName">
              {{ $t('position_name') }} {{ $t('is_required') }}
            </small>
          </div>

          <div v-if="position.parentPositionId" class="input-box">
            <label for="parentPositionId">
              {{ $t('dependency_position') }}
            </label>
            <Dropdown id="parentPositionId" v-model="position.parentPositionId" optionLabel="positionName"
              optionValue="positionId" :options="positions" :placeholder="$t('select_a_parent_position')"
              :disabled="!positions.length" />
          </div>
        </div>

        <div class="box-tools-footer">
          <Button class="btn btn-block btn-primary" @click="onSave">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                fill="#ffffff" class="fill-212121"></path>
            </svg>
            {{ $t('save') }}
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