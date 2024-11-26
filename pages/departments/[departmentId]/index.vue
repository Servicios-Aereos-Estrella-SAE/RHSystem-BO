<template>
  <div class="department-page">
    <Toast />

    <Head>
      <Title>
        Detail Departments
      </Title>
    </Head>

    <NuxtLayout name="backoffice">
      <div class="department-wrapper">
        <div class="box head-page">
          <h1>
            {{ department.departmentName }}
          </h1>
        </div>

        <div class="box head-page">
          <div class="input-search">
            <div class="input-box">
              <label for="search">
                Search
              </label>
              <InputText v-model="search" aria-describedby="search" @keyup.enter="handlerSearchPosition" />
            </div>
            <button class="btn btn-block" @click="handlerSearchPosition">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="#88a4bf" class="fill-212121"></path></svg>
            </button>
          </div>
          <div></div>
        </div>

        <div v-if="canRead">
          <div class="page-wrapper">
            <div class="container-wrapper">
              <div class="section-head">
                <h2>
                  Sub Departments
                </h2>
                <div class="input-box">
                  <br>
                  <Button v-if="canCreate" class="btn btn-block" @click="newDepartment">
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#88a4bf" class="fill-212121"></path></svg>
                    Add department
                  </Button>
                </div>
              </div>
              <div v-if="subdepartmentList.length > 0" class="subdepartment-wrapper">
                <div v-for="(department, index) in subdepartmentList" :key="`department-${department.departmentId}-${index}`">
                  <DepartmentInfoCard
                    :department="department"
                    :click-on-edit="() => { onEditDepartment(department) }"  :click-on-delete="() => { onDeleteDepartment(department) }"
                    :can-update="canUpdate"
                    :can-delete="canDelete"
                  />
                </div>
              </div>
              <div v-else class="empty">
                <div>
                  <div class="icon">
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 10a7.25 7.25 0 1 0-2.681 5.63l4.9 4.9.085.073a.75.75 0 0 0 .976-1.133l-4.9-4.901A7.22 7.22 0 0 0 17.25 10ZM11 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 2a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 9Z" fill="#88a4bf" class="fill-212121"></path></svg>
                  </div>
                  No sub department results
                </div>
              </div>
            </div>
            <div class="container-wrapper">
              <div class="section-head">
                <h2>
                  Department positions
                </h2>
                <div class="input-box">
                  <br>
                  <Button v-if="canCreate" class="btn btn-block" @click="newPositionDepartment">
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z" fill="#88a4bf" class="fill-212121"></path></svg>
                    Add position
                  </Button>
                </div>
              </div>
              <div v-if="positions.length > 0" class="department-card-wrapper">
                <div v-for="(position, index) in positions" :key="`position-${position.positionId}-${index}`">
                  <positionInfoCard
                    v-if="department && position"
                    :department-id="department.departmentId"
                    :position="position"
                    :can-delete="canDelete"
                    @clickOnDelete="onDeletePosition(position)"
                    @clickOnEdit="onEdit(position)"
                  />
                </div>
              </div>
              <div v-else class="empty">
                <div>
                  <div class="icon">
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.25 10a7.25 7.25 0 1 0-2.681 5.63l4.9 4.9.085.073a.75.75 0 0 0 .976-1.133l-4.9-4.901A7.22 7.22 0 0 0 17.25 10ZM11 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 2a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 9Z" fill="#88a4bf" class="fill-212121"></path></svg>
                  </div>
                  No position results
                </div>
              </div>
            </div>
          </div>

          <Sidebar
            v-model:visible="drawerNewPositionForm"
            header="New position"
            position="right"
            class="sidebar-form-position"
            :showCloseIcon="true"
          >
            <PositionInfoForm
              :position="position"
              :department="department"
              @saved="onPositionSaved"
            />
          </Sidebar>

          <Sidebar v-model:visible="drawerNewDepartmentForm" header="Department Detail" position="right" class="department-detail-sidebar">
            <DepartmentInfoForm
              :department="subDepartment"
              @save="onSave"
            />
          </Sidebar>

          <transition name="page">
            <confirmDelete
              v-if="drawerPositionDelete"
              @confirmDelete="confirmDelete"
              @cancelDelete="drawerPositionDelete = false"
            />
          </transition>

          <Dialog v-model:visible="drawerSoftPositionDelete" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="confirmation-content">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
              <span v-if="position"> Are you sure you want to delete ?</span>
            </div>
            <template #footer>
              <Button label="No" icon="pi pi-times" text @click="drawerSoftPositionDelete = false" />
              <Button label="Yes" icon="pi pi-check" text @click="confirmSoftDelete()" />
            </template>
          </Dialog>

          <Dialog v-model:visible="alertDeletePosition" :style="{ width: '450px' }" header="Delete Department Position"
            :modal="true">
            <div class="confirmation-content">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
              <span class="ml-4"> {{ messagePosition }}</span>
            </div>
            <template #footer>
              <Button label="OK" text @click="alertDeletePosition = false" />
            </template>
          </Dialog>

          <transition name="page">
            <confirmDelete
              v-if="drawerDepartmentDelete"
              @confirmDelete="confirmDeleteDepartment"
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
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script>
  import Script from "./script.ts";
  export default Script;
</script>

<style lang="scss" scoped>
  @import "./style";
</style>

<style lang="scss">
  @import '/resources/styles/variables.scss';

  .sidebar-form-position {
    width: 100% !important;
    max-width: 25rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
  .department-detail-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
