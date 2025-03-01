<template>
  <div class="box user-info-card">
    <div class="avatar">
      <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.989 11.946a1.991 1.991 0 0 1-2.05 1.99l-4.738-.139-3.454 7.143c-.277.574-.86.94-1.498.94a.926.926 0 0 1-.919-1.037l.862-7.193-3.765-.11-.49 1.341a1.29 1.29 0 0 1-1.211.847.901.901 0 0 1-.901-.902V13.35l-.81-.169a1.261 1.261 0 0 1 0-2.469l.81-.168V9.066c0-.46.343-.838.788-.894l.113-.007a1.29 1.29 0 0 1 1.21.846l.492 1.34 3.751-.11-.849-7.084a.93.93 0 0 1-.005-.055l-.002-.055c0-.511.415-.926.926-.926.585 0 1.123.307 1.423.8l.075.14 3.403 7.035 4.79-.14a1.991 1.991 0 0 1 2.048 1.932l.001.058Z" fill="#88a4bf" class="fill-212121"></path></svg>
    </div>
    <div class="name">
      {{ `${aircraftMaintenance.aircraft.aircraftProperty.aircraftPropertiesName} | ${aircraftMaintenance.aircraft.aircraftRegistrationNumber }`  }}
    </div>
    <div class="line"></div>
    <div class="maintenance-number">
      {{ `Start: ${formattedStartDate}` }}
    </div>

    <div class="maintenance-number">
      {{ `End date: ${formattedEndDate}` }}
    </div>
    <div class="maintenance-number" v-if="aircraftMaintenance.aircraftMaintenanceFinishDate">
      {{ `Finish date: ${formattedFinishDate}` }}
    </div>
    <Tag 
      :style="'margin-right: .8rem; background-color:' + aircraftMaintenance.aircraftMaintenanceStatus.aircraftMaintenanceStatusBg + ';'
        + 'color:' + aircraftMaintenance.aircraftMaintenanceStatus.aircraftMaintenanceStatusColor + ';'" 
      :value="aircraftMaintenance.aircraftMaintenanceStatus.aircraftMaintenanceStatusName"
    />
    <Tag 
      :style="'background-color:' + aircraftMaintenance.maintenanceUrgencyLevel.maintenanceUrgencyLevelBg + ';'
        + 'color:' + aircraftMaintenance.maintenanceUrgencyLevel.maintenanceUrgencyLevelColor + ';'"
      :value="aircraftMaintenance.maintenanceUrgencyLevel.maintenanceUrgencyLevelName"
    />
    <div class="info">
      Maintenance Type: {{ aircraftMaintenance.maintenanceType.maintenanceTypeName }}
    </div>

    <div class="box-tools-footer">
      <Button v-if="canUpdate" class="btn" @click="handlerClickOnEdit">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
      <Button v-if="canDelete" class="btn" @click="handlerClickOnDelete">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
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