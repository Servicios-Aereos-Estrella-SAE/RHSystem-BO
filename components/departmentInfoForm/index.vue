<template>
  <div class="user-info-form">
    <h4>
      {{ isNewDepartment ? $t('new_department') : $t('update_department') }}
    </h4>
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="input-box">
          <label for="parentDepartmentId">
            {{ $t('type_department') }}
          </label>
          <Dropdown v-model="prefix" :options="departmentPrefixList" optionLabel="label" optionValue="prefix" />
        </div>

        <div class="input-box">
          <label>{{ $t('department_order_position') }}</label>
          <InputNumber v-model="positionNumber" :placeholder="`${$t('enter')} ${$t('department_order_position')}`"
            :min="1" :max="99" />
        </div>

        <div class="input-box">
          <label for="departmentName">{{ $t('department_name') }}</label>
          <InputText v-model="department.departmentName" :placeholder="`${$t('enter')} ${$t('department_name')}`" />
          <small class="p-error" v-if="submitted && !(department.departmentName)">{{ $t('department_name') }} {{
            $t('is_required') }}</small>
        </div>

        <div class="input-box">
          <label for="parentDepartmentId">
            {{ $t('parent_department') }}
          </label>
          <Dropdown v-model="department.parentDepartmentId" :options="departmentsWithNone" optionLabel="departmentName"
            optionValue="departmentId" :placeholder="`${$t('select')} ${$t('department')}`" filter
            class="w-full md:w-14rem" disabled />
        </div>
        <div class="box-tools-footer">
          <button type="button" class="btn btn-primary btn-block" @click="onSave">
            {{ $t('save') }}
          </button>
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