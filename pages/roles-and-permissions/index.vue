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
            <button v-if="!activeEdit" class="btn btn-block">
              <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                  fill="#88a4bf" class="fill-000000"></path>
              </svg>
              Create Role
            </button>
          </div>

          <div class="box">
            <h2>
              Modules
            </h2>
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