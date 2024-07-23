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
                    <div class="input-box">
                        <br />
                        <Button class="btn-add mr-2" label="Assign Shift to Department" icon="pi pi-plus"
                            severity="primary" @click="asignShift" />
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
                <div>
                    <h3>
                        Departments position
                    </h3>
                    <div class="department-card-wrapper">
                        <div v-for="(position, index) in positions" :key="`position-${position.positionId}-${index}`">
                            <positionInfoCard :department="department" :position="position" />
                        </div>
                    </div>
                       <!-- Form Shift Apply To Departmente -->
                <div class="card flex justify-content-center">
                    <Sidebar v-model:visible="drawerShiftForm" header="Assign Shift to Department" position="right"
                        class="shift-form-sidebar" :showCloseIcon="true">
                        <asignShiftInfoForm :positions="dataShifts" :departmentName="department?.departmentName" @save-success="handleSaveSuccess"
                        />
                    </Sidebar>
                </div>
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
