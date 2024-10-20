<template>
  <div class="card-container" @click="toggleMenu(false)">
    <div class="calendar-container" :class="isExpired ? 'expired': 'next-expire'">
      <div class="calendar-header" :class="isExpired ? 'expired': 'next-expire'">
        {{new Date(document.proceedingFileExpirationAt).toLocaleString('en-US', { month: 'short' }) }}
      </div>
      <div class="calendar-day">
        {{ new Date(document.proceedingFileExpirationAt).getDate().toString().padStart(2, '0') }}
      </div>
    </div>

    <div class="card-content">
      <div class="description uppercase">
        {{ `${document.proceedingFileType.proceedingFileTypeName}`.toLocaleLowerCase() }}
      </div>
      <div class="details">
        <span> Aircraft: {{ document.aircraftProceedingFile.aircraft.aircraftRegistrationNumber }}</span>
        <span> File: {{ document.proceedingFileName }}</span>
        <span> Identifier: {{ document.proceedingFileIdentify || '---' }}</span>
      </div>
    </div>

    <div class="menu-container">
      <div class="dots-menu" @click.stop="toggleMenu(!isMenuOpen)">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM12 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM10 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </div>
        <div class="dropdown-menu" v-if="isMenuOpen">
          <a @click="openFile" href="#">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 6.25A2.25 2.25 0 0 1 4.25 4h3.956a2.25 2.25 0 0 1 1.438.52l2.381 1.98h5.725A2.25 2.25 0 0 1 20 8.75v.752H6.422a2.25 2.25 0 0 0-2.183 1.705l-1.923 7.7c.043-.171 0 .005 0 0a2.24 2.24 0 0 1-.32-1.158L2 6.25Z" fill="#88a4bf" class="fill-212121"></path><path d="M3.745 19.379A.5.5 0 0 0 4.23 20h14.24a1.75 1.75 0 0 0 1.698-1.326l1.763-7.05a.5.5 0 0 0-.485-.622H6.422a.75.75 0 0 0-.728.568L3.745 19.38Z" fill="#88a4bf" class="fill-212121"></path></svg>
            Open file
          </a>
          <a href="#">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.821 6.5h5.929a2.25 2.25 0 0 1 2.229 1.938l.016.158.005.154v8.278l-2.013-2.012a1.75 1.75 0 0 0-2.82 1.985h-2.332a1.75 1.75 0 0 0-2.822-1.98l-2.5 2.498a1.75 1.75 0 0 0 0 2.476l.005.005H4.25a2.25 2.25 0 0 1-2.245-2.096L2 17.75v-7.251l6.207.001.196-.009a2.25 2.25 0 0 0 1.088-.393l.156-.12L13.821 6.5Z" fill="#88a4bf" class="fill-212121"></path><path d="M8.207 4c.46 0 .908.141 1.284.402l.156.12 2.103 1.751-3.063 2.553-.085.061a.75.75 0 0 1-.29.106L8.206 9 2 8.999V6.25a2.25 2.25 0 0 1 2.096-2.245L4.25 4h3.957ZM13.78 16.79a.75.75 0 0 0-1.06-1.062l-2.5 2.499a.75.75 0 0 0 0 1.06l2.5 2.497a.75.75 0 1 0 1.06-1.061L12.556 19.5h6.883l-1.219 1.216a.75.75 0 1 0 1.06 1.061l2.5-2.495a.75.75 0 0 0 0-1.061l-2.5-2.499a.75.75 0 0 0-1.06 1.062L19.437 18h-6.869l1.212-1.212Z" fill="#88a4bf" class="fill-212121"></path></svg>
            Manage file
          </a>
        </div>
    </div>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style scoped lang="scss">
  @import './style';
</style>
