<template>
  <div class="header">
    <div class="header-wrapper">
      <div class="logo">
        <img src="https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg" alt="SAE">
      </div>
      <div class="aside-button">
        <Button class="btn-aside" @click="toggleAside">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 5.995c0-.55.446-.995.995-.995h8.01a.995.995 0 0 1 0 1.99h-8.01A.995.995 0 0 1 2 5.995ZM2 12c0-.55.446-.995.995-.995h18.01a.995.995 0 1 1 0 1.99H2.995A.995.995 0 0 1 2 12ZM2.995 17.01a.995.995 0 0 0 0 1.99h12.01a.995.995 0 0 0 0-1.99H2.995Z" fill="#8193a9" class="fill-000000"></path></svg>
        </Button>
      </div>
      <div class="back-button">
        <Button v-show="displayBackButton" class="btn-back" @click="handlerBack">
          <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M447.1 256c0 17.7-13.4 32-31.1 32H109.3l105.4 105.4c12.5 12.5 12.5 32.75 0 45.25-6.3 6.25-14.5 9.35-22.7 9.35s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L109.3 224H416c17.7 0 31.1 14.3 31.1 32z" fill="#8193a9" class="fill-000000"></path></svg>
          Back
        </Button>
      </div>
      <div class="header-content">
        <div class="notifications-badge">
          <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 32v19.2c73 14.83 128 79.4 128 156.8v18.8c0 47.1 17.3 92.4 48.5 127.6l7.4 8.3c8.4 9.5 10.5 22.9 5.3 34.4S428.6 416 416 416H32c-12.6 0-24.029-7.4-29.191-18.9-5.162-11.5-3.097-24.9 5.275-34.4l7.416-8.3C46.74 319.2 64 273.9 64 226.8V208c0-77.4 54.1-141.97 128-156.8V32c0-17.67 14.3-32 32-32s32 14.33 32 32zm-32 480c-17 0-33.3-6.7-45.3-18.7S160 464.1 160 448h128c0 16.1-6.7 33.3-18.7 45.3S240.1 512 224 512z" fill="#8193a9" class="fill-000000"></path></svg>
        </div>
        <div class="avatar">
          <div>
            <div class="avatar-name">
              {{ authUser?.person?.personFirstname || '' }}
              {{ authUser?.person?.personLastname || '' }}
              {{ authUser?.person?.personSecondLastname || '' }}
            </div>
            <div class="avatar-description">
              {{ authUser?.userEmail || '' }}
            </div>
          </div>
          <Avatar :label="avatarLetter" size="large" class="avatar-thumbnail" />
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
</style>