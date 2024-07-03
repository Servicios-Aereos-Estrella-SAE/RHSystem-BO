<template>
  <div class="box user-info-form">
    <div v-if="user" class="user-form">
      <div class="form-container">
<div class="input-box">
  <label for="userActive">
    {{ activeSwicht ? 'Activo' : 'Inactivo' }}</label>
    <InputSwitch v-model="activeSwicht" />
</div>
        <div class="input-box">
          <label for="useremail">
            Email</label>
            <InputText id="useremail" v-model="user.userEmail" type="email"/>
        </div>
        <div class="input-box">
          <label for="password">
            Password
          </label>
          <Password id="password" v-model="user.userPassword" toggleMask :feedback="false"/>
        </div>
        
        <div class="box-tools-footer">
          <Button label="Cancelar" severity="warning" />
          <Button label="Guardar" severity="primary"/>
          <!-- <nuxt-link to="/recuperar-contrasena">
            Forgot your password? click here to recover
          </nuxt-link> -->
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