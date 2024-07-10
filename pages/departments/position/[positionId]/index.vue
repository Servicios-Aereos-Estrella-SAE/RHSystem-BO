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
                    <!-- Aquí podrías agregar un campo de búsqueda específico si es necesario -->
                </div>
                <div>
                    <h2>
                       {{ position?.positionName }}
                    </h2>
                    <!-- <div class="position-detail">
                        <DetailPositionCard :position="selectedPosition" @close="closeDetail" />
                    </div> -->
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