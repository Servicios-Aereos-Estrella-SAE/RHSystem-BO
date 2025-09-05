<template>
  <div class="exp-card">
    <div class="exp-card-container" @click="toggleMenu(false)">
      <div class="calendar-container" :class="isExpired ? 'expired': 'next-expire'">
        <div class="calendar-header" :class="isExpired ? 'expired': 'next-expire'">
          {{new Date(document.proceedingFileExpirationAt).toLocaleString(localeToUse, { month: 'short' }) }}
        </div>
        <div class="calendar-day">
          {{ new Date(document.proceedingFileExpirationAt).getDate().toString().padStart(2, '0') }}
        </div>
      </div>

      <div class="card-content">
        <div v-if="document.proceedingFileType" class="title">
          {{
          `${capitalizeFirstLetter($t(document.proceedingFileType.proceedingFileTypeName.toLocaleLowerCase()))}`
          }}
        </div>
        <div v-else="document.isContract" class="title">
          {{ $t('contract') }}
        </div>
        <div class="details">
          <span> {{ $t('property') }}: {{ getName }}</span>
          <span> {{ $t('file') }}: {{ document.proceedingFileName }}</span>
          <span> {{ $t('date') }}: {{ expireDateFormat(document.proceedingFileExpirationAt) }}</span>
        </div>
      </div>
    </div>
    <div class="exp-card-tools">
      <nuxt-link :to="document.proceedingFilePath" target="_blank" class="btn btn-block">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.25 4.75a1.5 1.5 0 0 0-1.5 1.5v11.5a1.5 1.5 0 0 0 1.5 1.5h11.5a1.5 1.5 0 0 0 1.5-1.5v-4a1 1 0 1 1 2 0v4a3.5 3.5 0 0 1-3.5 3.5H6.25a3.5 3.5 0 0 1-3.5-3.5V6.25a3.5 3.5 0 0 1 3.5-3.5h4a1 1 0 1 1 0 2h-4Zm6.5-1a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v6.5a1 1 0 1 1-2 0V6.164l-4.793 4.793a1 1 0 1 1-1.414-1.414l4.793-4.793H13.75a1 1 0 0 1-1-1Z"
            fill="#88a4bf" class="fill-212121"></path>
        </svg>
        {{ $t('open_attached_file') }}
      </nuxt-link>
      <!-- <nuxt-link to="" class="btn btn-block">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
          <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
        </svg>
        Manage
      </nuxt-link> -->
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