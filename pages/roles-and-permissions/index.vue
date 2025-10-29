<template>
  <div>

    <Head>
      <Title>
        Roles and permissions
      </Title>
    </Head>
    <NuxtLayout name="backoffice">

      <div class="roles-and-permissions-page">
        <div class="module-permissions-wrapper">
          <div class="box roles-wrapper">
            <h2>
              Roles
            </h2>
            <div v-for="(rol, rIndex) in roleList" :key="`role-${rIndex}-${rol.roleId}`" class="role"
              :class="{ active: roleSelected === rIndex }" @click="handlerSelectRole(rIndex)">
              <div class="role-name">
                {{ rol.roleName }}
              </div>
              <div class="buttons">
                <button v-if="!activeEdit" class="btn btn-to-edit" @click="onDelete(rol)">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </button>
                <button v-if="!activeEdit" class="btn btn-to-edit" @click="activeEdit = true">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </button>
                <button v-if="activeEdit" class="btn btn-to-edit" @click="onCancelEdit">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m4.21 4.387.083-.094a1 1 0 0 1 1.32-.083l.094.083L12 10.585l6.293-6.292a1 1 0 1 1 1.414 1.414L13.415 12l6.292 6.293a1 1 0 0 1 .083 1.32l-.083.094a1 1 0 0 1-1.32.083l-.094-.083L12 13.415l-6.293 6.292a1 1 0 0 1-1.414-1.414L10.585 12 4.293 5.707a1 1 0 0 1-.083-1.32l.083-.094-.083.094Z"
                      fill="#88a4bf" class="fill-212121"></path>
                  </svg>
                </button>
                <button v-if="activeEdit" class="btn btn-to-edit" @click="onSave">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="m8.5 16.586-3.793-3.793a1 1 0 0 0-1.414 1.414l4.5 4.5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0-1.414-1.414L8.5 16.586Z"
                      fill="#88a4bf" class="fill-212121 fill-ffffff"></path>
                  </svg>
                </button>
              </div>
            </div>
            <button v-if="!activeEdit && canCreate" class="btn btn-block" @click="addNew">
              <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                  fill="#88a4bf" class="fill-000000"></path>
              </svg>
              Create Role
            </button>
          </div>

          <div class="box" v-if="role">
            <h2>
              Modules
            </h2>
            <div class="form-row">
              <div class="form-group status">
                <label for="activeSwicht">Status</label>
                <div class="checkbox-wrapper">
                  <Checkbox v-model="activeSwicht" inputId="activeSwicht" name="activeSwicht" :binary="true"
                    :disabled="!canUpdate || !activeEdit" />
                  <label for="activeSwicht">{{ activeSwicht ? 'Active' : 'Inactive' }}</label>
                </div>
              </div>

              <div class="form-group name">
                <label for="roleName">Name</label>
                <InputText id="roleName" v-model="role.roleName" :invalid="submitted && !role.roleName"
                  :disabled="!canUpdate || !activeEdit" />
                <small class="p-error" v-if="submitted && !role.roleName">Name is required.</small>
              </div>

              <div class="form-group description">
                <label for="roleDescription">Description</label>
                <Textarea id="roleDescription" v-model="role.roleDescription" rows="3"
                  :disabled="!canUpdate || !activeEdit" />

              </div>
            </div>


            <br>
            <div class="modules-wrapper">
              <div class="input-box module">
                <label for="userActive">
                  Status
                  ( {{ roleManagementWithOutLimit ? 'With Out Limit' : 'With Limit' }} )
                </label>
                <InputSwitch v-model="roleManagementWithOutLimit" :disabled="!canUpdate || !activeEdit" />
              </div>
              <div class="input-box module">
                <label for="roleManagementDays">Management Previous Days</label>
                <InputNumber id="roleManagementDays" v-model="roleManagementDays"
                  :disabled="roleManagementWithOutLimit || !canUpdate || !activeEdit" :min="0" />
              </div>
            </div>
            <br>

            <div class="modules-wrapper">

              <div v-for="(sModule,  smIndex) in systemModulesList"
                :key="`system-module-${smIndex}-${sModule.systemModuleId}`" class="module">
                <h3>
                  {{ sModule.systemModuleName }}
                </h3>
                <div class="permissions-wrapper">
                  <div v-for="(permission, indexP) in sModule.systemPermissions" :key="`permission-${indexP}`"
                    class="permission">
                    <Checkbox v-model="permissions[roleSelected]" name="permission"
                      :disabled="!canUpdate || !activeEdit" :value="permission.systemPermissionId" />
                    <label>
                      {{ permission.systemPermissionName }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <!-- Form role -->
      <div class="card flex justify-content-center">
        <Sidebar v-model:visible="drawerRoleForm" position="right" header="Roles" class="role-form-sidebar"
          :showCloseIcon="true">
          <roleInfoForm :role="newRole" @onRoleSave="onSaveRole" />
        </Sidebar>
      </div>
      <transition name="page">
        <confirmDelete v-if="drawerRoleDelete" @confirmDelete="confirmDelete"
          @cancelDelete="drawerRoleDelete = false" />
      </transition>
    </NuxtLayout>
  </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
  @import './style';

  .role-form-sidebar {
    width: 100% !important;
    max-width: 40rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
