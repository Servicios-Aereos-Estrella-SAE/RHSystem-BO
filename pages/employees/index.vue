<template>
    <div>
        <Toast />
        <div class="employees-page">
            <Head>
                <Title>
                    Employees
                </Title>
            </Head>
            <NuxtLayout name="backoffice">
            <div class="shift-wrapper">
                <div class="box head-page">
                <div class="input-box">
                    <label for="search">
                    Buscar
                    </label>
                    <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchEmployee" @keyup.delete="handlerSearchEmployee"/>
                </div>
                <div class="input-box">
                    <br/>
                    <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
                </div>
                </div>
                <div>
                <h2>
                    Employees
                </h2>
                <div class="shift-card-wrapper">
                    <div v-for="(employee, index) in filteredEmployees" :key="`employee-${employee.employeeId}-${index}`">
                    <EmployeeInfoCard
                        :click-on-photo="() => { onPhoto(employee) }"
                        :employee="employee"
                        :click-on-edit="() => { onEdit(employee) }"
                        :click-on-delete="() => { onDelete(employee) }"
                    />
                    </div>
                </div>
                <div></div>
                <Paginator 
                    class="paginator"
                    :first="first" 
                    :rows="rowsPerPage" 
                    :totalRecords="totalRecords" 
                    @page="onPageChange"
                    />
                <!-- Form Shift -->
                <div class="card flex justify-content-center">
                    <Sidebar v-model:visible="drawerEmployeeForm" header="Employee form" position="right" class="shift-form-sidebar" :showCloseIcon="true">
                    <employeeInfoForm
                        :employee="employee"
                        @save="onSave"
                    />
                    </Sidebar>

                    <Sidebar v-model:visible="drawerEmployeePhotoForm" header="Employee photo" position="right" class="shift-form-sidebar" :showCloseIcon="true">
                    <employeePhotoForm
                        :employee="employee"
                        @save="onSave"
                    />
                    </Sidebar>
                </div>
                </div>
            </div>
            <Dialog v-model:visible="drawerEmployeeDelete" :style="{width: '450px'}" header="Confirm" :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="employee">   Are you sure you want to delete
                    ?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="drawerEmployeeDelete = false"/>
                    <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
                </template>
            </Dialog>
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

.shift-card-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.shift-form-sidebar {
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
