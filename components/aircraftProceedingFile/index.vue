<template>
    <div v-if="isReady" class="box aircraft-proceeding-files">
        <Toast />
        <h4>
            {{ aircraft.aircraftRegistrationNumber }} - {{ aircraft.aircraftSerialNumber }}
        </h4>
        <div v-if="isReady" class="aircraft">
            <div class="form-container">
                <div class="aircraft-proceeding-file-wrapper">
                    <div class="box head-page">
                        <div class="input-box">
                            <br />
                            <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary"
                                @click="addNew" />
                        </div>
                    </div>
                </div>
                <div class="aircraft-proceeding-file-wrapper">
                    <div v-for="(aircraftProceedingFile, index) in aircraftProceedingFilesList"
                        :key="`proceeding-file-${index}`">
                        <aircraftProceedingFileInfoCard :aircraftProceedingFile="aircraftProceedingFile"
                            :click-on-edit="() => { onEdit(aircraftProceedingFile) }"
                            :click-on-delete="() => { onDelete(aircraftProceedingFile) }" />
                    </div>
                </div>
                <!-- Aircraft Proceeding File form -->
                <div class="card flex justify-content-center">
                    <Sidebar v-model:visible="drawerAircraftProceedingFileForm" position="right"
                        class="aircraft-proceeding-file-form-sidebar" :showCloseIcon="true">
                        <aircraftProceedingFileInfoForm :aircraftProceedingFile="aircraftProceedingFile"
                            @onAircraftProceedingFileSave="onSave" />
                    </Sidebar>
                </div>
            </div>
            <Dialog v-model:visible="drawerAircraftProceedingFileDelete" :style="{ width: '450px' }" header="Confirm"
                :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="aircraftProceedingFile"> Are you sure you want to delete proceeding file at
                        <b>{{ `${selectedDateTimeDeleted || ''}` }}</b>
                        ?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="drawerAircraftProceedingFileDelete = false" />
                    <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
                </template>
            </Dialog>
        </div>
    </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import './style';
@import '/resources/styles/variables.scss';

.aircraft-proceeding-file-form-sidebar {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
        width: 100% !important;
    }
}
</style>
