<template>
  <div class="user-page">


    <Head>
      <Title>
        {{ $t('users') }}
      </Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div class="user-wrapper">
        <div class="box head-page">
          <div class="input-search">
            <div class="input-box">
              <label for="search">
                {{ $t('search_user') }}
              </label>
              <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchUser"
                @keyup.delete="handlerSearchUser" />
            </div>
            <button class="btn btn-block" @click="handlerSearchUser">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                  fill="#88a4bf" class="fill-212121"></path>
              </svg>
            </button>
          </div>
          <div class="input-box">
            <label for="roles">
              {{ $t('search_user') }}
            </label>
            <Dropdown v-model="selectedRoleId" :options="filteredRoles" optionLabel="roleName" optionValue="roleId"
              placeholder="" filter class="w-full md:w-14rem" @change="handlerSearchUser" showClear
              :emptyMessage="$t('no_available_options')" :emptyFilterMessage="$t('no_results_found')" />
          </div>
          <div></div>
          <div class="buttons">
            <button v-if="canCreate" class="btn btn-block" @click="addNew">
              <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                  fill="#88a4bf" class="fill-000000"></path>
              </svg>
              {{ $t('add_new_user') }}
            </button>
          </div>
        </div>
        <div>
          <h2>
            {{ $t('users') }}
          </h2>
          <div class="user-card-wrapper">
            <div v-for="(user, index) in filteredUsers" :key="`user-${user.user_id}-${index}`">
              <userInfoCard :user="user" :click-on-edit="() => { onEdit(user) }" :can-update="canUpdate"
                :can-delete="canDelete" :click-on-delete="() => { onDelete(user) }" />
            </div>
          </div>
          <Paginator class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
            @page="onPageChange" :alwaysShow="false" />

          <!-- Form user -->
          <div class="card flex justify-content-center">
            <Sidebar v-model:visible="drawerUserForm" position="right" header="Users" class="user-form-sidebar"
              :showCloseIcon="true">
              <userInfoForm :user="user" @onUserSave="onSave" />
            </Sidebar>
          </div>
        </div>
      </div>

      <transition name="page">
        <confirmDelete v-if="drawerUserDelete" @confirmDelete="confirmDelete"
          @cancelDelete="drawerUserDelete = false" />
      </transition>
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
    max-width: 35rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>