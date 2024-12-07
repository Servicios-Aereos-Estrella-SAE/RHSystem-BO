<template>
  <div class="header">
    <div class="header-wrapper">
      <div class="aside-button">
        <Button class="btn btn-block" @click="toggleAside">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 6a1 1 0 0 1 1-1h15a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1ZM2 18a1 1 0 0 1 1-1h11a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1ZM3 11a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2H3Z"
              fill="#88a4bf" class="fill-212121"></path>
          </svg>
        </Button>
      </div>
      <div class="back-button">
        <Button v-show="displayBackButton" class="btn btn-block" @click="handlerBack">
          <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.295 19.716a1 1 0 0 0 1.404-1.425l-5.37-5.29h13.67a1 1 0 1 0 0-2H6.336L11.7 5.714a1 1 0 0 0-1.404-1.424l-6.924 6.822a1.25 1.25 0 0 0 0 1.78l6.924 6.823Z"
              fill="#88a4bf" class="fill-212121"></path>
          </svg>
        </Button>
      </div>
      <div class="logo">
        <img :src="getBackgroundImage" alt="SAE" class="img">
      </div>
      <div class="header-content">
        <div class="notifications-badge">
          <Button class="btn btn-block" @click="toggleNotification">
            <div style="position: relative;">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.042 19.003h5.916a3 3 0 0 1-5.916 0Zm2.958-17a7.5 7.5 0 0 1 7.5 7.5v4l1.418 3.16A.95.95 0 0 1 20.052 18h-16.1a.95.95 0 0 1-.867-1.338l1.415-3.16V9.49l.005-.25A7.5 7.5 0 0 1 12 2.004Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
              <div class="badge-container">
                <Badge v-if="notifications.length > 0" :value="notifications.length" severity="warning"></Badge>
              </div>
            </div>
          </Button>
        </div>
        <div class="logout-box">
          <Button class="btn btn-block" @click="handlerLogout">
            <svg data-name="Layer 2" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.54 34.75a17.25 17.25 0 0 1 0-34.5 1.25 1.25 0 0 1 0 2.5 14.75 14.75 0 0 0 0 29.5 1.25 1.25 0 0 1 0 2.5Z"
                fill="#88a4bf" class="fill-000000"></path>
              <path d="M32.927 18.75H15.25a1.25 1.25 0 0 1 0-2.5h17.677a1.25 1.25 0 0 1 0 2.5Z" fill="#88a4bf"
                class="fill-000000"></path>
              <path
                d="M26.536 26.438a1.25 1.25 0 0 1-.884-2.134l6.384-6.385a.6.6 0 0 0 0-.839l-6.384-6.38a1.25 1.25 0 1 1 1.768-1.771l6.38 6.384a3.1 3.1 0 0 1 0 4.374l-6.38 6.385a1.246 1.246 0 0 1-.884.366Z"
                fill="#88a4bf" class="fill-000000"></path>
            </svg>
            Sign Out
          </Button>
        </div>
        <div class="avatar">
          <div>
            <div class="avatar-name">
              {{ authUser?.person?.personFirstname || '' }}
              {{ authUser?.person?.personLastname || '' }}
              {{ authUser?.person?.personSecondLastname || '' }}
            </div>
            <div class="avatar-description">
              {{ authUser?.role?.roleName || '' }}
            </div>
          </div>
          <Avatar v-if="avatarImage" :image="avatarImage" size="large" class="avatar-thumbnail" />
          <Avatar v-else :label="avatarLetter" size="large" class="avatar-thumbnail" />
        </div>
      </div>
      <div class="card flex justify-content-center">
        <Sidebar v-model:visible="drawerNotifications" header="Notifications" position="right"
          class="notification-form-sidebar" :blockScroll="true" :closeOnEscape="false" :dismissable="false"
          :showCloseIcon="true">
          <notificationCard :notifications="notifications" />
        </Sidebar>
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

<style lang="scss">
@import '/resources/styles/variables.scss';

.header .header-wrapper .header-content .avatar .avatar-thumbnail {
  img {
    object-fit: cover;
    border-radius: 0.5rem;
  }
}

.notification-form-sidebar {
  width: 100% !important;
  max-width: 30rem !important;

  @media screen and (max-width: $sm) {
    width: 100% !important;
  }
}

.card.flex.justify-content-center {
  margin-top: 1rem;
}

.notifications-badge {
  position: relative; 
  display: inline-block;
}

.notifications-badge .btn {
  position: relative; 
}

.notifications-badge .badge-container {
  position: absolute;
  top: 5px; 
  left: 20px; 
  transform: translate(-50%, -50%); 
}


</style>