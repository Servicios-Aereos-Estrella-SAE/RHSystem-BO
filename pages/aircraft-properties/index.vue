<template>
    <div class="aircraft-property-page">


        <Head>
            <Title>Aircraft Properties</Title>
        </Head>
        <NuxtLayout name="backoffice">
            <div class="aircraft-property-wrapper">
                <div class="box head-page">
                    <div class="input-box">
                        <label for="search">Search</label>
                        <InputText v-model="search" aria-describedby="search" @input="handlerSearchAircraftProperty"
                            @keyup.delete="handlerSearchAircraftProperty" />
                    </div>
                    <div class="input-box">
                        <br />
                        <Button v-if="canCreate" class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
                    </div>
                </div>
                <div>
                    <h2>Aircraft Properties</h2>
                    <div class="aircraft-property-card-wrapper">
                        <div v-for="(aircraftProperty, index) in filteredAircraftProperties"
                            :key="`aircraftProperty-${aircraftProperty.id}-${index}`">
                            <aircraftPropertyInfoCard :aircraftProperty="aircraftProperty"
                                :can-update="canUpdate" :can-delete="canDelete"
                                :click-on-edit="() => { onEdit(aircraftProperty) }"
                                :click-on-delete="() => { onDelete(aircraftProperty) }" />
                        </div>
                    </div>

                    <div></div>
                    <Paginator v-if="first > 1" class="paginator" :first="first" :rows="rowsPerPage"
                        :totalRecords="totalRecords" @page="onPageChange" />
                    <!-- Form Aircraft Property -->
                    <div class="card flex justify-content-center">
                        <Sidebar v-model:visible="drawerAircraftPropertyForm" header="Aircraft Property form"
                            position="right" class="aircraft-property-form-sidebar" :showCloseIcon="true">
                            <aircraftPropertyInfoForm :aircraftProperty="aircraftProperty"
                                @onAircraftPropertySave="onSave" />
                        </Sidebar>
                    </div>
                </div>
            </div>
            <Dialog v-model:visible="drawerAircraftPropertyDelete" :style="{ width: '450px' }" header="Confirm"
                :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="aircraftProperty">Are you sure you want to delete this aircraft property?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="drawerAircraftPropertyDelete = false" />
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

.aircraft-property-card-wrapper {
    display: flex;
    flex-wrap: wrap;
}

.aircraft-property-form-sidebar {
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

.aircraft-property-form-sidebar {
    width: 100% !important;
    max-width: 35rem !important;
}
</style>
