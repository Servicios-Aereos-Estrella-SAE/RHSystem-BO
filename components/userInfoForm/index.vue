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
  <label for="role">
    Role
  </label>
  <Dropdown v-model="user.roleId" :options="roles" optionLabel="roleName" optionValue="roleId" placeholder="Select a Role" filter class="w-full md:w-14rem" />
</div>
<div class="input-box">
  <label for="role">
    Empleado
  </label>
  <Dropdown v-model="user.personId" :options="employees" optionLabel="employeeFirstName" optionValue="personId" placeholder="Select a Employee" filter class="w-full md:w-14rem" />
</div>
        <div class="input-box">
          <label for="useremail">
            Email</label>
            <InputText id="useremail" v-model="user.userEmail" type="email" :invalid="submitted && !user.userEmail"/>
            <small class="p-error" v-if="submitted && !user.userEmail">Email is required.</small>
        </div>
        <div class="input-box">
          <label for="password">
            Password
          </label>
          <Password id="password" v-model="user.userPassword" toggleMask :feedback="false"/>
        </div>
        
        <div class="box-tools-footer">
          <Button label="Cancelar" severity="warning" />
          <Button label="Guardar" severity="primary" @click="submitted = true"/>
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