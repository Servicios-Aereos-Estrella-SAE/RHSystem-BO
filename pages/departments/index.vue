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
          <div class="input-search">
            <div class="input-box">
              <label for="search">
                Search department
              </label>
              <InputText v-model="search" aria-describedby="search" @keyup.enter="handlerSearchDepartment" />
            </div>
            <button class="btn btn-block" @click="handlerSearchDepartment">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="#88a4bf" class="fill-212121"></path></svg>
            </button>
          </div>

          <div></div>
          <div></div>
          <!-- <div class="input-box">
            <br /> <br />
            <label for="departments">
              Period
            </label>
            <Calendar
            v-model="periodSelected"
            :view="'month'"
            :dateFormat="'mm/yy'"
            :minDate="minDate"
            :maxDate="maxDate"
            hideOnRangeSelection
            showWeek
            />
          </div> -->
          <div class="input-box">
            <br />
            <Button v-if="canCreate" class="btn btn-block" @click="addNew">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#88a4bf" class="fill-212121"></path></svg>
              Add department
            </Button>
          </div>
          <div class="input-box">
            <br />
            <NuxtLink to="/departments-chart" target="_blank" class="btn btn-block">
              <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="icon">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7.998 5.75A3.752 3.752 0 1 1 12.5 9.427V11.5h3.25A2.25 2.25 0 0 1 18 13.75v.824a3.754 3.754 0 0 1-.748 7.43 3.752 3.752 0 0 1-.752-7.429v-.825a.75.75 0 0 0-.75-.75h-8a.75.75 0 0 0-.75.75v.824a3.754 3.754 0 0 1-.748 7.43 3.752 3.752 0 0 1-.752-7.429v-.825a2.25 2.25 0 0 1 2.25-2.25H11V9.427A3.754 3.754 0 0 1 7.998 5.75Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <div>
          <h2>
            Departments
          </h2>

          <div v-if="filteredDepartments.length > 0" class="department-card-wrapper">
            <div v-for="(department, index) in filteredDepartments"
              :key="`department-${department.departmentId}-${index}`">
              <DepartmentInfoCard :department="department" :can-update="canUpdate" :can-delete="canDelete" :click-on-edit="() => { onEdit(department) }"  :click-on-delete="() => { onDelete(department) }" :period-selected="periodSelected"
                :can-read-rotation="canReadRotation"/>
            </div>
          </div>
          <div v-else class="empty">
            <div>
              <div class="icon">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 10a7.25 7.25 0 1 0-2.681 5.63l4.9 4.9.085.073a.75.75 0 0 0 .976-1.133l-4.9-4.901A7.22 7.22 0 0 0 17.25 10ZM11 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 2a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 9Z" fill="#88a4bf" class="fill-212121"></path></svg>
              </div>
              No department results
            </div>
          </div>
        </div>
      </div>

      <div v-if="department" class="card flex justify-content-center">
        <Sidebar v-model:visible="drawerDepartmentDetail" header="Department Detail" position="right" class="department-detail-sidebar">
          <DepartmentInfoForm
            :department="department"
            @save="onSave"
          />
        </Sidebar>
      </div>

      <transition name="page">
        <confirmDelete
          v-if="drawerDepartmentDelete"
          @confirmDelete="confirmDelete"
          @cancelDelete="drawerDepartmentDelete = false"
        />
      </transition>

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
</style>

<style lang="scss">
  @import '/resources/styles/variables.scss';

  .department-detail-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
