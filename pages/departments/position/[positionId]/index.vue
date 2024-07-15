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
                    <h2>
                       {{ position?.positionName }}
                    </h2>
                    <h3>
                        {{ position?.positionAlias }}
                    </h3>
                </div>
                <div>
                    <h3>
                        Shifts per Department
                    </h3>
                    <div class="department-card-wrapper">
                        <div v-for="(shift, index) in dataShifts" :key="`shift-${shift.shiftId}-${index}`">
                        <ShiftInfoCard :shift="shift" 
                        :show-edit-button="false" 
                        :show-delete-button="false" 
                        />
                        </div>
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

<style lang="scss" scoped>
@import './style';

.position-detail {
    display: flex;
    justify-content: center;
}
</style>