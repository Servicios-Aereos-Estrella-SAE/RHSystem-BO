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
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 8.608v8.142a3.25 3.25 0 0 1-3.066 3.245L18.75 20H5.25a3.25 3.25 0 0 1-3.245-3.066L2 16.75V8.608l9.652 5.056a.75.75 0 0 0 .696 0L22 8.608ZM5.25 4h13.5a3.25 3.25 0 0 1 3.234 2.924L12 12.154l-9.984-5.23a3.25 3.25 0 0 1 3.048-2.919L5.25 4h13.5-13.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
                  </InputIcon>
                  <InputText id="useremail" v-model="credentials.userEmail" type="email" @keyup.enter.prevent="handlerLogin" />
                </IconField>
              </div>
              <div class="input-box">
                <label for="password">
                  Password
                </label>
                <Password id="password" v-model="credentials.userPassword" toggleMask :feedback="false" @keyup.enter.prevent="handlerLogin" @keypress="resetInvalidCredentials" />
              </div>
              <Message v-show="invalidCredentials && !credentials.userPassword" severity="warn">
                Incorrect auth user credentials.
                <br>
                Try again
              </Message>
              <Button v-ripple label="Log In" class="btn-block" @click="handlerLogin" />
              <div class="form-bottom">
                <!-- <nuxt-link to="/recuperar-contrasena">
                  Forgot your password? click here to recover
                </nuxt-link> -->
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
