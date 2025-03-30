<template>
  <div class="box department-info-card">
    <div class="department-name">
      {{ `${department.departmentName}` }}
    </div>
    <div class="department-alias">

      <span v-if="department.parentDepartment"> Dependence: {{ department.parentDepartment.departmentName }}</span>
      <span v-else> Dependence: None</span>
    </div>

    <!-- <div v-if="canReadRotation" class="line"></div>
    <div v-if="canReadRotation" class="department-rotation-index">
      <span>Rotation "General": </span>
      <span class="property-value">{{ rotationIndexGeneral }}%</span>
    </div>
    <div v-if="canReadRotation" class="department-rotation-index">
      <span>Rotation "Current year": </span>
      <span class="property-value">{{ rotationIndexCurrentYear }}%</span>
    </div>
    <div v-if="canReadRotation" class="department-rotation-index">
      <span>Rotation index "On month": </span>
      <span class="property-value">{{ rotationIndexMonth }}%</span>
    </div> -->

    <div class="box-tools-footer">
      <Button v-if="canUpdate" class="btn btn-block" @click="handlerClickOnDetail(department.departmentId)">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2.997 5.245a2.25 2.25 0 0 1 2.25-2.25h2.507a2.25 2.25 0 0 1 2.25 2.25v2.507a2.25 2.25 0 0 1-2.25 2.25H7.25v3.707c.046.035.09.073.133.116l2.79 2.791c.043.043.082.087.117.134h3.714v-.5a2.25 2.25 0 0 1 2.25-2.25h2.494a2.25 2.25 0 0 1 2.25 2.25v2.504a2.25 2.25 0 0 1-2.25 2.25h-2.494a2.25 2.25 0 0 1-2.25-2.25v-.504H10.29a1.273 1.273 0 0 1-.116.134l-2.79 2.791a1.25 1.25 0 0 1-1.769 0l-2.792-2.791a1.25 1.25 0 0 1 0-1.768l2.792-2.791c.043-.043.088-.082.135-.117v-3.706h-.503a2.25 2.25 0 0 1-2.25-2.25V5.245Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
      <Button v-if="canUpdate" class="btn btn-block" @click="handlerClickOnEdit(department.departmentId)" :disabled="department.departmentId === 999">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#88a4bf" class="fill-212121 fill-303e67"></path></svg>
      </Button>
      <Button v-if="canDelete" class="btn btn-block" @click="handlerClickOnDelete" :disabled="department.departmentId === 999">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#88a4bf" class="fill-212121 fill-303e67"></path></svg>
      </Button>
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style.scss';
</style>
