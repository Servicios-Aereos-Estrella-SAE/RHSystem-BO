<template>
  <Toast />
  <div class="user-page">
    <Head>
      <Title>
        Users
      </Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div class="user-wrapper">
        <div class="box head-page">
          <div class="input-box">
            <label for="search">
              Buscar
            </label>
            <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchUser"
              @keyup.delete="handlerSearchUser" />
          </div>
          <div class="input-box">
            <label for="roles">
              Role
            </label>
            <AutoComplete v-model="selectedRole" :optionLabel="() => `${selectedRole.roleName}`"
              :suggestions="filteredRoles" @complete="handlerSearchRole" @item-select="handlerSearchUser">
              <template #option="role">
                <div class="item-role-filter-attendance-monitor">
                  <div class="name">
                    {{ role.option.roleName }}
                  </div>
                </div>
              </template>
            </AutoComplete>
          </div>
          <div class="input-box">
            <br/>
            <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
          </div>
          <div></div>
        </div>
        <div>
          <h2>
            Users
          </h2>
          <div class="user-card-wrapper">
            <div v-for="(user, index) in filteredUsers" :key="`user-${user.user_id}-${index}`">
              <userInfoCard :user="user" :click-on-edit="() => { onEdit(user) }"
                :click-on-delete="() => { onDelete(user) }" />
            </div>
          </div>
          <div></div>
          <Paginator class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
            @page="onPageChange" />
          <!-- Form user -->
          <div class="card flex justify-content-center">
            <Sidebar v-model:visible="drawerUserForm" header="User form" position="right" class="user-form-sidebar">
              <userInfoForm :user="user" />
            </Sidebar>
          </div>
        </div>
      </div>
      <Dialog v-model:visible="drawerUserDelete" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="user">   Are you sure you want to delete 
              <b v-if="user.person">{{`${user.person.personFirstname || ''}`.toLocaleLowerCase() }} {{ `${user.person.personLastname || ''}`.toLocaleLowerCase() }} {{ `${user.person.personSecondLastname || ''}`.toLocaleLowerCase() }}</b>
              <b v-else>{{`${user.userEmail || ''}`.toLocaleLowerCase() }}</b>
              ?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="drawerUserDelete = false"/>
            <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
        </template>
    </Dialog>
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

<style lang="scss">
  @import '/resources/styles/variables.scss';

  :deep(.graph-label) {
    color: red;
  }

  .graph-label {
    color: red;
  }

  .user-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>