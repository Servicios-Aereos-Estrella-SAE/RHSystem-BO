<template>
    <div v-if="isReady" class="box employee-proceeding-files">
        <Toast />
        <h4>
            {{ employee.employeeFirstName }} {{ employee }}
        </h4>
        <div v-if="isReady" class="employee">
            <div class="form-container">
                <div class="employee-proceeding-file-wrapper">
                    <div class="box head-page">
                        <div class="input-box">
                            <br />
                            <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary"
                                @click="addNew" />
                        </div>
                    </div>
                </div>
                <div class="employee-proceeding-file-wrapper">
                    <div v-for="(employeeProceedingFile, index) in employeeProceedingFilesList"
                        :key="`proceeding-file-${index}`">
                        <employeeProceedingFileInfoCard :employeeProceedingFile="employeeProceedingFile"
                            :click-on-edit="() => { onEdit(employeeProceedingFile) }"
                            :click-on-delete="() => { onDelete(employeeProceedingFile) }" />
                    </div>
                </div>
                <!-- Rmployee Proceeding File form -->
                <div class="card flex justify-content-center">
                    <Sidebar v-model:visible="drawerEmployeeProceedingFileForm" position="right"
                        class="employee-proceeding-file-form-sidebar" :showCloseIcon="true">
                        <employeeProceedingFileInfoForm :employeeProceedingFile="employeeProceedingFile"
                            @onEmployeeProceedingFileSave="onSave" />
                    </Sidebar>
                </div>
            </div>
            <Dialog v-model:visible="drawerEmployeeProceedingFileDelete" :style="{ width: '450px' }" header="Confirm"
                :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="employeeProceedingFile"> Are you sure you want to delete proceeding file at
                        <b>{{ `${selectedDateTimeDeleted || ''}` }}</b>
                        ?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="drawerEmployeeProceedingFileDelete = false" />
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

.employee-proceeding-file-form-sidebar {
    width: 100% !important;
    max-width: 45rem !important;

    @media screen and (max-width: $sm) {
        width: 100% !important;
    }
}
</style>