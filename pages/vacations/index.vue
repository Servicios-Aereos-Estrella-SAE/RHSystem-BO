<template>
    <div class="vacation-page">
        <Toast />

        <Head>
            <Title>
                Vacations
            </Title>
        </Head>
        <NuxtLayout name="backoffice">
            <div class="vacation-wrapper">
                <div class="box head-page">
                    <div class="input-box">
                        <label for="search">
                            Search
                        </label>
                        <InputText v-model="search" aria-describedby="search" @input="handlerSearchVacation"
                            @keyup.delete="handlerSearchVacation" />
                    </div>
                    <div class="input-box">
                        <br />
                        <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
                    </div>
                </div>
                <div>
                    <h2>
                        Vacations
                    </h2>
                    <div class="vacation-card-wrapper">
                        <div v-for="(vacation, index) in filteredVacations" :key="`vacation-${vacation.vacationSettingId}-${index}`">
                            <vacationInfoCard :vacation="vacation" :click-on-edit="() => { onEdit(vacation) }"
                                :click-on-delete="() => { onDelete(vacation) }" />
                        </div>
                    </div>

                    <div></div>
                    <Paginator v-if="first > 1" class="paginator" :first="first" :rows="rowsPerPage"
                        :totalRecords="totalRecords" @page="onPageChange" />
                    <!-- Form Vacation -->
                    <div class="card flex justify-content-center">
                        <Sidebar v-model:visible="drawerVacationForm" header="Vacation form" position="right"
                            class="vacation-form-sidebar" :showCloseIcon="true">
                            <vacationInfoForm :vacation="vacation" @onVacationSave="onSave" />
                        </Sidebar>
                    </div>
                </div>
            </div>
            <Dialog v-model:visible="drawerVacationDelete" :style="{ width: '450px' }" header="Confirm" :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="vacation"> Are you sure you want to delete this vacation setting?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="drawerVacationDelete = false" />
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
.vacation-card-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.vacation-form-sidebar {
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

.vacation-form-sidebar {
    width: 100% !important;
    max-width: 35rem !important;

    // @media screen and (max-width: $sm) {
    //   width: 100% !important;
    // }
  }
</style>