<template>
  <div class="department-page">
    <Toast />

    <Head>
      <Title>
        Departments
      </Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div class="department-wrapper">
        <div class="box head-page">
          <div class="input-box">
            <label for="search">
              Search
            </label>
            <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchDepartment"
              @keyup.delete="handlerSearchDepartment" />
          </div>
          <div></div>
          <div class="input-box">
            <br />
            <Button v-if="canCreate" class="btn-box mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
          </div>
          <div class="input-box">
            <br />
            <Button v-if="canCreate" class="btn-box btn-sync mr-2" @click="syncDepartments">
              <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="icon">
                <path
                  d="M41.115 20.33C40.213 9.822 31.79 1.478 21.248.681c6.77 3.647 11.373 10.798 11.373 19.026 0 .211-.026.414-.032.623h-7.793l11.563 13.779L47.923 20.33h-6.808zM15.155 28.293c0-.234.026-.461.034-.692h8.015L11.642 13.822.077 27.601h6.579c.872 10.54 9.307 18.921 19.87 19.719-6.769-3.649-11.371-10.799-11.371-19.027z"
                  fill="#ffffff"></path>
              </svg>
            </Button>
          </div>
        </div>
        <div>
          <h2>
            Departments
          </h2>
          <div class="department-card-wrapper">
            <div v-for="(department, index) in filteredDepartments"
              :key="`department-${department.departmentId}-${index}`">
              <DepartmentInfoCard :department="department" :can-update="canUpdate" :can-delete="canDelete" :click-on-edit="() => { onEdit(department) }"  :click-on-delete="() => { onDelete(department) }" />
            </div>
          </div>

          <div></div>
          <!-- <Paginator 
              class="paginator"
              :first="first" 
              :rows="rowsPerPage" 
              :totalRecords="totalRecords" 
            /> -->
          <!-- Detail Department -->
          <div v-if="department" class="card flex justify-content-center">
            <Sidebar v-model:visible="drawerDepartmentDetail" header="Department Detail" position="right" class="department-detail-sidebar">
              <DepartmentInfoForm
                :department="department"
                @save="onSave"
              />
            </Sidebar>
          </div>
        </div>
      </div>
      <Dialog v-model:visible="drawerDepartmentDelete" :style="{ width: '450px' }" header="Confirm" :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="department">Are you sure you want to delete?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="drawerDepartmentDelete = false" />
                    <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
                </template>
            </Dialog>

            <Dialog v-model:visible="drawerDepartmentForceDelete" :style="{ width: '450px' }" header="Confirm" :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="department">There are department related employees. Are you sure you want to delete this department?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="drawerDepartmentForceDelete = false" />
                    <Button label="Yes" icon="pi pi-check" text @click="confirmForceDelete()" />
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

.department-card-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.department-detail-sidebar {
  width: 100% !important;
  max-width: 50rem !important;

  @media screen and (max-width: $sm) {
    width: 100% !important;
  }
}
</style>

<style lang="scss">
@import '/resources/styles/variables.scss';

:deep(.graph-label) {
  color: red;
}

.graph-label {
  color: red;
}
</style>
