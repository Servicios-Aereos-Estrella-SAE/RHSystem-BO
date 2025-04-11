<template>
  <div class="user-info-form">

    <h1>
      {{ isNewUser ? 'New user' : 'Update user' }}
    </h1>
    <div v-if="isReady" class="user-form">
      <div class="form-container">
        <div class="checkbox-item">
          <Checkbox v-model="activeSwicht" inputId="activeSwicht" name="activeSwicht" :binary="true" />
          <label for="activeSwicht">
            {{ activeSwicht ? 'Active' : 'Inactive' }} User Access
          </label>
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
            :disabled="!isNewUser && hasEmployee" @change="onEmployeeSelect">
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
          <div style="width: 100%;">
            <label for="password">
              Enter new password
            </label>
            <div class="password-box">
              <Password v-model="user.userPassword" toggleMask promptLabel="---" :invalid="submitted && !user.userPassword">
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
              <button class="btn" @click="generatePassword">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.664 15.735c.245.173.537.265.836.264v-.004a1.442 1.442 0 0 0 1.327-.872l.613-1.864a2.872 2.872 0 0 1 1.817-1.812l1.778-.578a1.443 1.443 0 0 0-.052-2.74l-1.755-.57a2.876 2.876 0 0 1-1.822-1.823l-.578-1.777a1.446 1.446 0 0 0-2.732.022l-.583 1.792a2.877 2.877 0 0 1-1.77 1.786l-1.777.571a1.444 1.444 0 0 0 .017 2.734l1.754.569a2.887 2.887 0 0 1 1.822 1.826l.578 1.775c.099.283.283.528.527.7Zm7.667 5.047a1.123 1.123 0 0 1-.41-.549l-.328-1.007a1.293 1.293 0 0 0-.821-.823l-.991-.323A1.148 1.148 0 0 1 13 16.997a1.143 1.143 0 0 1 .771-1.08l1.006-.326a1.3 1.3 0 0 0 .8-.819l.324-.992a1.143 1.143 0 0 1 2.157-.021l.329 1.014a1.3 1.3 0 0 0 .82.816l.992.323a1.141 1.141 0 0 1 .039 2.165l-1.014.329a1.3 1.3 0 0 0-.818.822l-.322.989c-.078.23-.226.43-.425.57a1.14 1.14 0 0 1-1.328-.005Z" fill="#88a4bf" class="fill-212121"></path></svg>
                Generate
              </button>
            </div>
            <small class="p-error" v-if="submitted && !user.userPassword">Password is required.</small>
          </div>
        </div>
        <div v-if="isNewUser || changePassword" class="input-box">
          <label for="password2">
            Confirm password
          </label>
          <Password id="password2" v-model="passwordConfirm" toggleMask :feedback="false"
            :invalid="submitted && passwordConfirm" />
          <small class="p-error"

          v-if="submitted && !passwordConfirm">Confirm password is required.</small>
        </div>
        <div class="box-tools-footer form-buttons">
          <button v-if="!isNewUser" class="btn btn-block" @click="onChangePassword">
            {{ changePassword ? 'Cancel Change Password' : 'Change Password' }}
          </button>
          <button class="btn btn-primary btn-block" @click="onSave">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z" fill="#ffffff" class="fill-212121"></path></svg>
            Save
          </button>
        </div>
      </div>
    </div>
    <div v-else class="loader">
      <ProgressSpinner />
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
