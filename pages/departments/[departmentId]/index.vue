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
                        <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchPosition" @keyup.delete="handlerSearchPosition" />
                    </div>
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
                <div>
                    <h3>
                        Departments position
                    </h3>
                    <div class="department-card-wrapper">
                        <div v-for="(position, index) in positions" :key="`position-${position.positionId}-${index}`">
                        <positionInfoCard :position="position" />
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

<style lang="scss">
@import './style.scss';

.department-card-wrapper {
  display: flex;
  flex-wrap: wrap;
}
</style>

