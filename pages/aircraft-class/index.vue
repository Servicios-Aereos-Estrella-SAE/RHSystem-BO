<template>
    <div class="aircraft-class-page">


        <Head>
            <Title>Aircraft Classes</Title>
        </Head>
        <NuxtLayout name="backoffice">
            <div class="aircraft-class-wrapper">
                <div class="box head-page">
                    <div class="input-box">
                        <label for="search">Search</label>
                        <InputText v-model="search" aria-describedby="search" @input="handlerSearchAircraftClass"
                            @keyup.delete="handlerSearchAircraftClass" />
                    </div>
                    <div class="input-box">
                        <br />
                        <Button v-if="canCreate" class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
                    </div>
                </div>
                <div>
                    <h2>Aircraft Classes </h2>
                    <div class="aircraft-class-card-wrapper">
                        <div v-for="(aircraftClass, index) in filteredAircraftClasses"
                            :key="`aircraftClass-${aircraftClass.id}-${index}`">
                            <aircraftClassInfoCard :aircraftClass="aircraftClass"
                            :can-update="canUpdate" :can-delete="canDelete"
                                :click-on-edit="() => { onEdit(aircraftClass) }"
                                :click-on-delete="() => { onDelete(aircraftClass) }" />
                        </div>
                    </div>

                    <div></div>
                    <Paginator v-if="first > 1" class="paginator" :first="first" :rows="rowsPerPage"
                        :totalRecords="totalRecords" @page="onPageChange" />
                    <!-- Form Aircraft Class -->
                    <div class="card flex justify-content-center">
                        <Sidebar v-model:visible="drawerAircraftClassForm" header="Aircraft Class form" position="right"
                            class="aircraft-class-form-sidebar" :showCloseIcon="true">
                            <aircraftClassInfoForm :aircraftClass="aircraftClass" @onAircraftClassSave="onSave" />
                        </Sidebar>
                    </div>
                </div>
            </div>
            <Dialog v-model:visible="drawerAircraftClassDelete" :style="{ width: '450px' }" header="Confirm"
                :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="aircraftClass">Are you sure you want to delete this aircraft class?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="drawerAircraftClassDelete = false" />
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

.aircraft-class-card-wrapper {
    display: flex;
    flex-wrap: wrap;
}

.aircraft-class-form-sidebar {
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

.aircraft-class-form-sidebar {
    width: 100% !important;
    max-width: 35rem !important;
}
</style>
