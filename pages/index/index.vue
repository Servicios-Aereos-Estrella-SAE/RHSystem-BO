<template>
  <div v-if="isGuest">
    <NuxtLayout name="guest">
      <div class="guest-page">
        <div>
          <div class="logo">
            <img src="https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg" alt="SAE">
          </div>
          <div class="guest-form">
            <div class="form-container">
              <div class="input-box">
                <label for="useremail">
                  Email
                </label>
                <IconField iconPosition="left">
                  <InputIcon>
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 13"><path d="M25 31H7a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3ZM7 16a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V17a1 1 0 0 0-1-1Z" fill="#000000" class="fill-101820"></path><path d="M24 16H8a1 1 0 0 1-1-1V9a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8v6a1 1 0 0 1-1 1ZM9 14h14V9a6 6 0 0 0-6-6h-2a6 6 0 0 0-6 6ZM16 23a2 2 0 1 1 2-2 2 2 0 0 1-2 2Zm0-2Z" fill="#000000" class="fill-101820"></path><path d="M15 22h2v4h-2z" fill="#000000" class="fill-101820"></path></g></svg>
                  </InputIcon>
                  <InputText id="useremail" v-model="credentials.userEmail" type="email" @keyup.enter.prevent="handlerLogin" />
                </IconField>
              </div>
              <div class="input-box">
                <label for="password">
                  Password
                </label>
                <IconField iconPosition="left">
                  <InputIcon>
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 56"><path d="M16 31a1 1 0 0 1-.6-.2l-4-3a1 1 0 0 1-.4-.8v-9.53a9 9 0 1 1 10 0V19a1 1 0 0 1-.29.71L19.41 21l1.3 1.29a1 1 0 0 1 0 1.42L19.41 25l1.3 1.29a1 1 0 0 1 .29.78 1 1 0 0 1-.4.73l-4 3a1 1 0 0 1-.6.2Zm-3-4.5 3 2.25 2.48-1.86-1.19-1.18a1 1 0 0 1 0-1.42l1.3-1.29-1.3-1.29a1 1 0 0 1 0-1.42l1.71-1.7v-1.67a1 1 0 0 1 .5-.86 7 7 0 1 0-7 0 1 1 0 0 1 .5.86Zm7-7.5Z" fill="#000000" class="fill-101820"></path><circle cx="16" cy="8" r="1" fill="#000000" class="fill-101820"></circle><path d="M16 10a2 2 0 1 1 2-2 2 2 0 0 1-2 2Zm0-2Z" fill="#000000" class="fill-101820"></path></g></svg>
                  </InputIcon>
                  <Password id="password" v-model="credentials.userPassword" toggleMask :feedback="false" @keyup.enter.prevent="handlerLogin" @keypress="resetInvalidCredentials" />
                </IconField>
              </div>
              <Message v-show="invalidCredentials && !credentials.userPassword" severity="warn">
                Incorrect auth user credentials.
                <br>
                Try again
              </Message>
              <Button v-ripple label="Log In" class="btn-block" @click="handlerLogin" />
              <div class="form-bottom">
                <nuxt-link to="/password-recovery">
                  Forgot your password? click here to recover
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
  <div v-else></div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
@import './style';
</style>
