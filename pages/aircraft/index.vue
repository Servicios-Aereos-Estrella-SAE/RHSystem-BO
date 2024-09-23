<template>
    <div class="aircrafts-page">
        <Toast />

        <Head>
            <Title>
                Aircrafts
            </Title>
        </Head>
        <NuxtLayout name="backoffice">
            <div class="aircraft-wrapper">
                <div class="box head-page">
                    <div class="input-box">
                        <label for="search">
                            Search
                        </label>
                        <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchAircraft"
                            @keyup.delete="handlerSearchAircraft" />
                    </div>
                    <div class="input-box">
                        <br />
                        <Button v-if="canCreate" class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary"
                            @click="addNew" />
                    </div>
                </div>
                <div>
                    <h2>
                        Aircrafts
                    </h2>
                    <div class="aircraft-card-wrapper">
                        <div v-for="(aircraft, index) in filterAircrafts"
                            :key="`aircraft-${aircraft.aircraftId}-${index}`">
                            <aircraftInfoCard :aircraft="aircraft" :can-update="canUpdate" :can-delete="canDelete" 
                                :click-on-edit="() => { onEdit(aircraft) }"
                                :click-on-delete="() => { onDelete(aircraft) }" 
                                :click-on-gallery="() => {onGallery(aircraft) }"/>
                        </div>
                    </div>
                    <Paginator class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
                        @page="onPageChange" :alwaysShow="false" />
                    <!-- Form Aircraft -->
                    <div class="card flex justify-content-center">
                        <Sidebar v-model:visible="drawerAircraftForm" header="Aircraft form" position="right"
                            class="aircraft-form-sidebar" :showCloseIcon="true">
                            <aircraftInfoForm :aircraft="aircraft" @onAircraftSave="onSave" />
                        </Sidebar>
                    </div>

                    <!-- Form Sidebar Gallery -->
                     <div class="card flex justify-content-center">
                        <Sidebar v-model:visible="drawerAircraftFormGallery" header="Aircraft Gallery" position="right"
                            class="aircraft-form-sidebar" :showCloseIcon="true">
                             <genericGallery  :aircraft="aircraft" @onGallerySave="onSaveGallery" /> 
                        </Sidebar>
                     </div>
                </div>
            </div>
            <Dialog v-model:visible="drawerAircraftDelete" :style="{ width: '450px' }" header="Confirm" :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="aircraft">Are you sure you want to delete?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="drawerAircraftDelete = false" />
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

    .aircraft-card-wrapper {
        display: flex;
        flex-wrap: wrap;
    }

    .aircraft-form-sidebar {
        width: 100% !important;
        max-width: 50rem !important;

        @media screen and (max-width: $sm) {
            width: 100% !important;
        }
    }
</style>