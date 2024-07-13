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
            <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchDepartment" @keyup.delete="handlerSearchDepartment" />
          </div>
        </div>
        <div>
          <h2>
            Departments
          </h2>
          <div class="department-card-wrapper">
            <div v-for="(department, index) in filteredDepartments" :key="`department-${department.departmentId}-${index}`">
              <DepartmentInfoCard
                :department="department"
              />
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
          <!-- <div class="card flex justify-content-center">
            <Sidebar v-model:visible="drawerDepartmentDetail" header="Department Detail" position="right" class="department-detail-sidebar">
              <DepartmentDetailForm
                :department="department"
              />
            </Sidebar>
          </div>  -->
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
