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
        <!-- <div class="notifications-badge">
          <Button class="btn btn-block" @click="toggleNotification">
            <svg v-if="notifications.length > 0" class="notified" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m10.429 19.924 3.562-1.512a1.999 1.999 0 0 1-3.562 1.512Zm5.432-17.83c2.086 1.14 3.652 2.603 4.682 4.387 1.03 1.784 1.515 3.872 1.459 6.248a.75.75 0 0 1-1.5-.035c.05-2.112-.372-3.928-1.258-5.463-.886-1.535-2.249-2.808-4.102-3.82a.75.75 0 1 1 .72-1.317Zm-9.15 4.421a5.824 5.824 0 0 1 7.6 2.746l.098.21 1.288 2.891 1.698 1.47c.093.08.173.174.266.325l.059.114a1.25 1.25 0 0 1-.637 1.65L6.755 20.49A1.25 1.25 0 0 1 5 19.347l-.001-2.343-1.242-2.792A5.822 5.822 0 0 1 6.71 6.515Zm8.913-.82c.967.527 1.742 1.294 2.316 2.289.574.995.851 2.05.824 3.15a.75.75 0 1 1-1.5-.036c.02-.822-.185-1.605-.623-2.364-.438-.76-1.014-1.33-1.735-1.722a.75.75 0 0 1 .718-1.317Z" fill="#3CB4E5" class="fill-212121"></path></svg>
            <svg v-else fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.042 19.003h5.916a3 3 0 0 1-5.916 0Zm2.958-17a7.5 7.5 0 0 1 7.5 7.5v4l1.418 3.16A.95.95 0 0 1 20.052 18h-16.1a.95.95 0 0 1-.867-1.338l1.415-3.16V9.49l.005-.25A7.5 7.5 0 0 1 12 2.004Z" fill="#88a4bf" class="fill-212121"></path></svg>
          </Button>
        </div> -->
        <div class="logout-box">
          <Button class="btn btn-block" @click="handlerLogout">
            <svg viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24"><g id="_icons"><path d="M20.9 11.6c-.1-.1-.1-.2-.2-.3l-3-3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l1.3 1.3H13c-.6 0-1 .4-1 1s.4 1 1 1h4.6l-1.3 1.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l3-3c.1-.1.2-.2.2-.3.1-.3.1-.5 0-.8z" fill="#88a4bf" class="fill-000000"></path><path d="M15.5 18.1c-1.1.6-2.3.9-3.5.9-3.9 0-7-3.1-7-7s3.1-7 7-7c1.2 0 2.4.3 3.5.9.5.3 1.1.1 1.4-.4.3-.5.1-1.1-.4-1.4C15.1 3.4 13.6 3 12 3c-5 0-9 4-9 9s4 9 9 9c1.6 0 3.1-.4 4.5-1.2.5-.3.6-.9.4-1.4-.3-.4-.9-.6-1.4-.3z" fill="#88a4bf" class="fill-000000"></path></g></svg>
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
    </div>

    <div class="card flex justify-content-center">
      <Sidebar v-model:visible="drawerNotifications" header="Notifications" position="right"
        class="notification-form-sidebar" :blockScroll="true" :closeOnEscape="false" :dismissable="false"
        :showCloseIcon="true">
        <notificationCard :notifications="notifications" />
      </Sidebar>
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
