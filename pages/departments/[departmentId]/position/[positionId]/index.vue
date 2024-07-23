<template>
    <div class="position-detail-page">
        <Toast />

        <Head>
            <Title>
                Position Details
            </Title>
        </Head>
        <NuxtLayout name="backoffice">
            <div class="position-detail-wrapper">
                <div class="box head-page">
                    <div>
                        <h2>
                            {{ position?.positionName }}
                        </h2>
                        <h3>
                            {{ position?.positionAlias }}
                        </h3>
                    </div>

                    <div class="input-box">
                        <br />
                        <Button class="btn-add mr-2" label="Assign Shift to Department" icon="pi pi-plus"
                            severity="primary" @click="asignShift" />
                    </div>
                </div>
                <div>
                    <h3>
                        Shifts per {{ position?.positionName }}
                    </h3>
                    <div class="position-card-wrapper">
                        <div v-for="(shift, index) in dataShifts" :key="`shift-${shift.shiftId}-${index}`">
                            <ShiftInfoCard :shift="shift" :show-edit-button="false" :show-delete-button="false" />
                        </div>
                    </div>
                </div>
            </div>
            <!-- Form Shift Apply To Departmente -->
            <div class="card flex justify-content-center">
                <Sidebar v-model:visible="drawerShiftForm" header="Assign Shift to Position" position="right"
                    class="shift-form-sidebar" :showCloseIcon="true">
                    <assignShiftToPositionInfoForm :department="department" :position="position" @save="onSave"
                    />
                </Sidebar>
            </div>
        </NuxtLayout>
    </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss" scoped>
@import './style';

.position-detail {
    display: flex;
    justify-content: center;
}

.shift-form-sidebar {
    width: 100% !important;
    max-width: 35rem !important;

    @media screen and (max-width: $sm) {
        width: 100% !important;
    }
}
</style>