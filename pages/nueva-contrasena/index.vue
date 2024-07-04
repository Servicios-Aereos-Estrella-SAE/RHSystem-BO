<template>
  <div>
    <NuxtLayout name="guest">
      <div class="guest-page">
        <div v-if="!validToken" class="invalid">
          <div class="icon">
            <svg fill="none" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg"><path d="m5.5 11.493.416-.278a.5.5 0 0 0-.416-.222v.5Zm2 2.998-.416.277a.5.5 0 0 0 .832 0l-.416-.277Zm2-2.998v-.5a.5.5 0 0 0-.416.222l.416.278Zm-4.416.277 2 2.998.832-.555-2-2.998-.832.555Zm2.832 2.998 2-2.998-.832-.555-2 2.998.832.555ZM9.5 11.993h4v-1h-4v1Zm4 0c.829 0 1.5-.67 1.5-1.5h-1c0 .277-.223.5-.5.5v1Zm1.5-1.5V1.5h-1v8.994h1ZM15 1.5C15 .67 14.329 0 13.5 0v1c.277 0 .5.223.5.5h1ZM13.5 0h-12v1h12V0Zm-12 0C.671 0 0 .67 0 1.5h1c0-.277.223-.5.5-.5V0ZM0 1.5v8.993h1V1.5H0Zm0 8.993c0 .83.671 1.5 1.5 1.5v-1a.499.499 0 0 1-.5-.5H0Zm1.5 1.5h4v-1h-4v1ZM7.5 9A2.5 2.5 0 0 1 5 6.5H4A3.5 3.5 0 0 0 7.5 10V9ZM10 6.5A2.5 2.5 0 0 1 7.5 9v1A3.5 3.5 0 0 0 11 6.5h-1ZM7.5 4A2.5 2.5 0 0 1 10 6.5h1A3.5 3.5 0 0 0 7.5 3v1Zm0-1A3.5 3.5 0 0 0 4 6.5h1A2.5 2.5 0 0 1 7.5 4V3Zm1.646 1.146-4 4 .708.708 4-4-.708-.708Z" fill="#303e67" class="fill-000000"></path></svg>
          </div>
          <p>
            Lo sentimos, esta página ya no puede ser accedida
            ya que el tiempo ha expirado o el acceso es inválido.
          </p>
          <div class="form-bottom">
            <nuxt-link to="/">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><path d="M13 26a1 1 0 0 1-.71-.29l-9-9a1 1 0 0 1 0-1.42l9-9a1 1 0 1 1 1.42 1.42L5.41 16l8.3 8.29a1 1 0 0 1 0 1.42A1 1 0 0 1 13 26Z" fill="#303e67" class="fill-000000"></path><path d="M28 17H4a1 1 0 0 1 0-2h24a1 1 0 0 1 0 2Z" fill="#303e67" class="fill-000000"></path></g><path d="M0 0h32v32H0z" fill="none"></path></svg>
              Regresar al inicio
            </nuxt-link>
          </div>
        </div>
        <div v-else>
          <div class="logo">
            <img src="https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg" alt="SAE">
          </div>
          <div class="guest-form">
            <div class="form-container">
              <div class="input-box">
                <label for="otp-code">
                  Enter the validation code
                  <small>
                    We have sent a verification code to the same email you used to request the password change.
                    <br>
                    Enter it to validate your identity.
                  </small>
                </label>
                <InputOtp id="otp-code" v-model="otpCode" integerOnly />
              </div>
              <br>
              <div class="input-box">
                <label for="password">
                  New Password
                </label>
                <Password v-model="newPassword" toggleMask promptLabel="---">
                  <template #header>
                    <h6>Enter new password</h6>
                  </template>
                  <template #footer>
                      <Divider />
                      <p class="mt-2">Requirements</p>
                      <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                          <li>At least one lowercase letter</li>
                          <li>At least one uppercase letter</li>
                          <li>At least one number</li>
                          <li>Minimum 8 characters</li>
                      </ul>
                  </template>
                </Password>
              </div>
              <div class="input-box">
                <label for="password">
                  Confirm new password
                </label>
                <IconField iconPosition="left">
                  <Password id="password" v-model="newPasswordConfirmed" toggleMask :feedback="false" />
                </IconField>
              </div>
              <Button v-ripple label="Confirm" class="btn-block" @click="handlerNewPasswordRequest" />
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
@import './style';
</style>
