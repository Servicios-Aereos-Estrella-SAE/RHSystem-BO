<template>
  <div v-if="isGuest">

    <Head>
      <Title>
        {{ $t('login') }}
      </Title>
    </Head>
    <NuxtLayout name="guest">
      <div class="guest-page">
        <div>
          <div class="logo">
            <img :src="getBackgroundImageLogo">
          </div>
          <div class="guest-form">
            <div class="form-container">
              <div class="input-box">
                <label for="useremail">
                  {{ $t('email') }}
                </label>
                <IconField iconPosition="left">
                  <InputIcon>
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M22 8.608v8.142a3.25 3.25 0 0 1-3.066 3.245L18.75 20H5.25a3.25 3.25 0 0 1-3.245-3.066L2 16.75V8.608l9.652 5.056a.75.75 0 0 0 .696 0L22 8.608ZM5.25 4h13.5a3.25 3.25 0 0 1 3.234 2.924L12 12.154l-9.984-5.23a3.25 3.25 0 0 1 3.048-2.919L5.25 4h13.5-13.5Z"
                        fill="#88a4bf" class="fill-212121"></path>
                    </svg>
                  </InputIcon>
                  <InputText id="useremail" v-model="credentials.userEmail" type="email"
                    @keyup.enter.prevent="handlerLogin" />
                </IconField>
              </div>
              <div class="input-box">
                <label for="password">
                  {{ $t('password') }}
                </label>
                <Password id="password" v-model="credentials.userPassword" toggleMask :feedback="false"
                  @keyup.enter.prevent="handlerLogin" @keypress="resetInvalidCredentials" />
              </div>
              <Message v-show="invalidCredentials && !credentials.userPassword" severity="warn">
                {{ $t('incorrect_auth_user_credentials.') }}
                <br>
                {{ $t('try_again') }}
              </Message>
              <button class="btn btn-primary btn-block btn-block" @click="handlerLogin">
                {{ $t('login') }}
              </button>

              <div class="form-bottom">
                <nuxt-link to="/password-recovery">
                  {{ $t('forgot_your_password?_click_here_to_recover') }}
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