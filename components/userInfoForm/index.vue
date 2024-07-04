<template>
  <div class="box user-info-form">
      <Toast />
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
          <Dropdown v-model="user.roleId" :options="roles" optionLabel="roleName" optionValue="roleId"
            placeholder="Select a Role" filter class="w-full md:w-14rem" :invalid="submitted && !user.roleId"/>
          <small class="p-error" v-if="submitted && !user.roleId">Role is required.</small>
        </div>
        <div class="input-box">
          <label for="role">
            Empleado
          </label>
          <Dropdown v-model="user.personId" :options="employees" optionLabel="label" optionValue="personId"
            placeholder="Select a Employee" filter class="w-full md:w-14rem" :invalid="submitted && !user.personId"
            :disabled="user.userId" >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.employeeFirstName">
                {{ slotProps.employeeFirstName }}s
              </div>

            </template>
          </Dropdown>
          <small class="p-error" v-if="submitted && !user.personId">Employee is required.</small>
        </div>
        <div class="input-box">
          <label for="useremail">
            Email</label>
          <InputText id="useremail" v-model="user.userEmail" type="email" :invalid="submitted && !user.userEmail" />
          <small class="p-error" v-if="submitted && !user.userEmail">Email is required.</small>
        </div>
        <div v-if="!user.userId || changePassword" class="input-box">
          <label for="password">
            Password
          </label>
          <Password id="password" v-model="user.userPassword" toggleMask :feedback="false" :invalid="submitted && !user.userPassword" />
          <small class="p-error" v-if="submitted && !user.userPassword">Password is required.</small>
        </div>
        <div v-if="!user.userId || changePassword" class="input-box">
          <label for="password2">
            Confirm password
          </label>
          <Password id="password2" v-model="passwordConfirm" toggleMask :feedback="false" :invalid="submitted && passwordConfirm" />
          <small class="p-error" v-if="submitted && !passwordConfirm">Confirm password is required.</small>
        </div>
        <div class="box-tools-footer">
          <Button v-if="user.userId" :label="changePassword ? 'Cancelar Cambio de contraseña' : 'Cambiar contraseña'" severity="secondary" @click="onChangePassword()" />
          <Button label="Guardar" severity="primary" @click="onSave()" />
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