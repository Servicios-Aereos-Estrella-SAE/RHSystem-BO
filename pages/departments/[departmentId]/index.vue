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
                    <h2>
                        {{ department?.departmentName }} <br>
                    </h2>
                </div>
                <div class="box head-page">
                    <div class="input-box">
                        <label for="search">
                            Search
                        </label>
                        <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchPosition"
                            @keyup.delete="handlerSearchPosition" />
                    </div>
                    <div></div>
                    <div class="input-box">
                        <Button v-if="canCreate" class="btn-add mr-2" label="Assign department position" icon="pi pi-plus" severity="primary" @click="assignPositionDepartment" />
                    </div>
                    <div class="input-box">
                        <Button class="btn-add mr-2" label="Assign Shift to Department" icon="pi pi-plus" severity="primary" @click="asignShift" />
                    </div>
                    <div class="input-box">
                        <Button v-if="canCreate" class="btn-add mr-2" @click="syncPositions" style="width: 55px !important;">
                        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="icon">
                            <path
                            d="M41.115 20.33C40.213 9.822 31.79 1.478 21.248.681c6.77 3.647 11.373 10.798 11.373 19.026 0 .211-.026.414-.032.623h-7.793l11.563 13.779L47.923 20.33h-6.808zM15.155 28.293c0-.234.026-.461.034-.692h8.015L11.642 13.822.077 27.601h6.579c.872 10.54 9.307 18.921 19.87 19.719-6.769-3.649-11.371-10.799-11.371-19.027z"
                            fill="white"
                            ></path>
                        </svg>
                        </Button>
                    </div>
                </div>
                <div>
                    <h3>
                        Shifts per Position
                    </h3>
                    <div class="department-card-wrapper">
                        <div v-for="(shift, index) in dataShifts" :key="`shift-${shift.shiftId}-${index}`">
                            <ShiftInfoCard :shift="shift" :show-edit-button="false" :show-delete-button="false" />
                        </div>
                    </div>
                </div>
                <div v-if="canRead">
                    <h3>
                        Departments position
                    </h3>
                    <div class="department-card-wrapper">
                        <div v-for="(position, index) in positions" :key="`position-${position.positionId}-${index}`">
                            <positionInfoCard :department="department" :position="position" :click-on-delete="() => { onDeletePosition(position)}" :can-delete="canDelete" />
                        </div>
                    </div>
                       <!-- Form Shift Apply To Department -->
                    <div class="card flex justify-content-center">
                        <Sidebar v-model:visible="drawerShiftForm" header="Assign Shift to Department" position="right"
                            class="shift-form-sidebar" :showCloseIcon="true">
                            <assignShiftToDepartmentInfoForm :department="department"  @save="onSave"
                            />
                        </Sidebar>
                    </div>
                    <div class="card flex justify-content-center">
                        <Sidebar v-model:visible="drawerPositionForm" header="Assign Shift to Department" position="right"
                            class="shift-form-sidebar" :showCloseIcon="true">
                            <DepartmentPositionInfoForm :department="department"  @save="onSavePosition"
                            />
                        </Sidebar>
                    </div>
                    <Dialog v-model:visible="drawerPositionDelete" :style="{width: '450px'}" header="Confirm" :modal="true">
                        <div class="confirmation-content">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="position"> Are you sure you want to delete
                            ?</span>
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" text @click="drawerPositionDelete = false" />
                            <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
                        </template>
                    </Dialog>
                    <Dialog v-model:visible="alertDeletePosition" :style="{width: '450px'}" header="Delete Department Position" :modal="true">
                        <div class="confirmation-content">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span class="ml-4"> {{ messagePosition }}</span>
                        </div>
                        <template #footer>
                            <Button label="OK" text @click="alertDeletePosition = false" />
                        </template>
                    </Dialog>
                </div>
            </div>
        </NuxtLayout>
    </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import './style';

.department-card-wrapper {
    display: flex;
    flex-wrap: wrap;
}

.shift-form-sidebar {
    width: 100% !important;
    max-width: 35rem !important;

    @media screen and (max-width: $sm) {
        width: 100% !important;
    }
}
</style>
