<template>
  <div>
    <Toast />
    <div class="roles-and-permission-page">

      <Head>
        <Title>
          Roles and permissions
        </Title>
      </Head>
      <NuxtLayout name="backoffice">
        <div class="roles-and-permissions-wrapper">
          <div>
            <h2>
              Roles and permissions
            </h2>
            <div class="roles-and-permissions-card-wrapper">
              <Accordion v-model:activeIndex="roleSelected">
                <AccordionTab :header="role.roleName" v-for="(role, index) in roleList" :key="`role-${role.roleId}-${index}`">
                  <DataTable :value="systemModulesList" tableStyle="min-width: 50rem">
                    <Column field="systemModuleName" header="Module">
                        <template #body="slotProps">
                          <strong>{{ slotProps.data.systemModuleName }}</strong>
                        </template>
                    </Column>
                    <Column header="Permissions">
                      <template #body="slotProps" >
                        <div class="permissions">
                          <div v-for="(permission, indexP) in slotProps.data.systemPermissions" :key="`permission-${index}-${indexP}`" class="permission">
                            <Checkbox v-model="permissions[index]" name="permission" :disabled="!canUpdate" :value="permission.systemPermissionId"/>
                            <label> {{ permission.systemPermissionName }}</label>
                          </div>
                        </div>
                      </template>
                    </Column>
                </DataTable>
                </AccordionTab>
              </Accordion>
            </div>
          </div>
        </div>
        <div class="box-tools-footer">
          <Button v-if="canUpdate" label="Save" severity="primary" @click="onSave()" />
        </div>
      </NuxtLayout>
    </div>
  </div>
</template>
<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
  @import './style';
</style>

<style lang="scss">
  @import '/resources/styles/variables.scss';
</style>

