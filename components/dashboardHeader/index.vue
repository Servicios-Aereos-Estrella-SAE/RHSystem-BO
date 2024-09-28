<template>
  <div class="header">
    <div class="header-wrapper">
      <div class="logo">
        <img :src="getBackgroundImage" alt="SAE" class="img">
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
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.042 19.003h5.916a3 3 0 0 1-5.916 0Zm2.958-17a7.5 7.5 0 0 1 7.5 7.5v4l1.418 3.16A.95.95 0 0 1 20.052 18h-16.1a.95.95 0 0 1-.867-1.338l1.415-3.16V9.49l.005-.25A7.5 7.5 0 0 1 12 2.004Z" fill="#88a4bf" class="fill-212121"></path></svg>
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