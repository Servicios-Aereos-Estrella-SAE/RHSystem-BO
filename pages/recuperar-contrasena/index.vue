<template>
  <div>
    <NuxtLayout name="guest">
      <div class="guest-page">
        <div>
          <div class="logo">
            <img src="https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg" alt="SAE">
          </div>
          <div class="guest-form">
            <h1>
              ¿Olvidaste tu contraseña?
            </h1>
            <p>
              Para recuperar tu contraseña es necesario que ingreses el correo electrónico con el cual te encuentras registrado.
              <br>
              <br>
              Se te enviará un correo electrónico con los pasos a seguir para cambiar tu contraseña.
            </p>
            <div class="form-container">
              <div class="input-box">
                <label for="useremail">
                  Correo electrónico
                </label>
                <IconField iconPosition="left">
                  <InputIcon>
                    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 13"><path d="M25 31H7a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3ZM7 16a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V17a1 1 0 0 0-1-1Z" fill="#000000" class="fill-101820"></path><path d="M24 16H8a1 1 0 0 1-1-1V9a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8v6a1 1 0 0 1-1 1ZM9 14h14V9a6 6 0 0 0-6-6h-2a6 6 0 0 0-6 6ZM16 23a2 2 0 1 1 2-2 2 2 0 0 1-2 2Zm0-2Z" fill="#000000" class="fill-101820"></path><path d="M15 22h2v4h-2z" fill="#000000" class="fill-101820"></path></g></svg>
                  </InputIcon>
                  <InputText id="useremail" type="email" />
                </IconField>
              </div>
              <Button v-ripple label="Enviar" class="btn-block" @click="handlerPasswordRequest" />
              <div class="form-bottom">
                <nuxt-link to="/">
                  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g data-name="Layer 2"><path d="M13 26a1 1 0 0 1-.71-.29l-9-9a1 1 0 0 1 0-1.42l9-9a1 1 0 1 1 1.42 1.42L5.41 16l8.3 8.29a1 1 0 0 1 0 1.42A1 1 0 0 1 13 26Z" fill="#303e67" class="fill-000000"></path><path d="M28 17H4a1 1 0 0 1 0-2h24a1 1 0 0 1 0 2Z" fill="#303e67" class="fill-000000"></path></g><path d="M0 0h32v32H0z" fill="none"></path></svg>
                  Regresar al inicio de sesión
                </nuxt-link>
              </div>
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
