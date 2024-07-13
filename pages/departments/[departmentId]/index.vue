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

