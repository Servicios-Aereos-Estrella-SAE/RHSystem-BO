<template>
  <div class="card-container" @click="toggleMenu(false)">
      <div class="calendar-container" :class="isExpired ? 'expired': 'next-expire'">
        <div class="calendar-header" :class="isExpired ? 'expired': 'next-expire'">{{new Date(document.proceedingFileExpirationAt).toLocaleString('en-US', { month: 'short' }) }}</div>
        <div class="calendar-day">{{ new Date(document.proceedingFileExpirationAt).getDate().toString().padStart(2, '0') }}</div>
      </div>
      <div class="card-content">
        <div class="description">{{ document.proceedingFileName }}</div>
        <div class="details">
          <span> Aircraft tail number: {{ document.aircraftProceedingFile.aircraft.aircraftRegistrationNumber }}</span>
          <span> UUID: License {{ document.proceedingFileUuid.toLocaleUpperCase() }}</span>
          <span> File: {{ document.proceedingFileType.proceedingFileTypeName }}</span>
        </div>
      </div>
    

    <div class="menu-container">
      <div class="dots-menu" @click.stop="toggleMenu(!isMenuOpen)">⋮</div>
        <div class="dropdown-menu" v-if="isMenuOpen">
          <a @click="openFile" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder-symlink-fill" viewBox="0 0 16 16">
              <path d="M13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2l.04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14h10.348a2 2 0 0 0 1.991-1.819l.637-7A2 2 0 0 0 13.81 3M2.19 3q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672a1 1 0 0 1 .707.293L7.586 3zm9.608 5.271-3.182 1.97c-.27.166-.616-.036-.616-.372V9.1s-2.571-.3-4 2.4c.571-4.8 3.143-4.8 4-4.8v-.769c0-.336.346-.538.616-.371l3.182 1.969c.27.166.27.576 0 .742"/>
            </svg>
              See document
          </a>
          <a href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
            </svg>
            Go to document manager
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
</style>./script.js