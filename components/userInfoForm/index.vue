<template>
  <div class="box user-info-form">
    <Toast />
    <h4>
      {{ isNewUser ? 'New user' : 'Update user' }}
    </h4>
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="input-box">
          <label for="userActive">
            {{ activeSwicht ? 'Active' : 'Inactive' }}</label>
          <InputSwitch v-model="activeSwicht" />
        </div>
        <div class="input-box">
          <label for="role">
            Role
          </label>
          <Dropdown v-model="user.roleId" :options="roles" optionLabel="roleName" optionValue="roleId"
            placeholder="Select a Role" filter class="w-full md:w-14rem" :invalid="submitted && !user.roleId" />
          <small class="p-error" v-if="submitted && !user.roleId">Role is required.</small>
        </div>
        <div class="input-box">
          <label for="role">
            Employee
          </label>
          <Dropdown v-model="user.personId" :options="employees" optionLabel="label" optionValue="personId"
            placeholder="Select a Employee" filter class="w-full md:w-14rem" :invalid="submitted && !user.personId"
            :disabled="!isNewUser && hasEmployee">
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
          <InputText id="useremail" v-model="user.userEmail" type="email"
            :invalid="submitted && (!user.userEmail || isEmailInvalid)" />
          <small class="p-error" v-if="submitted && (!user.userEmail || isEmailInvalid)">Email is required.</small>
        </div>
        <div v-if="isNewUser || changePassword" class="input-box">
          <label for="password">
            Enter new password</label>
          <div class="password-box">
            <Password v-model="user.userPassword" toggleMask promptLabel="---"
              :invalid="submitted && !user.userPassword">
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
            <Button label="Generate" severity="secondary" @click="generatePassword()" />
          </div>
          <small class="p-error" v-if="submitted && !user.userPassword">Password is required.</small>
        </div>
        <div v-if="isNewUser || changePassword" class="input-box">
          <label for="password2">
            Confirm password
          </label>
          <Password id="password2" v-model="passwordConfirm" toggleMask :feedback="false"
            :invalid="submitted && passwordConfirm" />
          <small class="p-error" v-if="submitted && !passwordConfirm">Confirm password is required.</small>
        </div>
        <div class="box-tools-footer">
          <Button v-if="!isNewUser" :label="changePassword ? 'Cancelar Cambio de contraseña' : 'Cambiar contraseña'"
            severity="secondary" @click="onChangePassword()" />
          <Button label="Save" severity="primary" @click="onSave()" />
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