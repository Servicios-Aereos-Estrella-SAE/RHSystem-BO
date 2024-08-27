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
        <div class="pilot-wrapper">
          <div>
            <h2>
              Roles and permissions
            </h2>
            <div class="roles-and-permissions-card-wrapper">
              <Accordion>
                <AccordionTab :header="role.roleName" v-for="(role, index) in roleList" :key="`role-${role.roleId}-${index}`">
                  <DataTable :value="systemModulesList" tableStyle="min-width: 50rem">
                    <Column field="systemModuleName" header="Module">
                    </Column>
                    <Column header="Permissions">
                      <template #body="slotProps">
                        <div class="tw-flex">
                          <el-checkbox-group v-model="permissions[index]" class="tw-flex">
                            <el-checkbox v-for="(permission, indexp) in permissions" :key="`permission-${indexp}`" :label="permission.systemPermissionId" class="tw-capitalize">
                              {{ permission.systemPermissionName }}
                            </el-checkbox>
                          </el-checkbox-group>
                        </div>
                      </template>
                    </Column>
                </DataTable>
                </AccordionTab>
              </Accordion>
            </div>
          </div>
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

