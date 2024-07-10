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