<template>
    <div>
        <Toast />
        <div class="chart-page">

            <Head>
                <Title>Organization Chart</Title>
            </Head>
            <NuxtLayout name="backoffice">
                <div class="pilot-wrapper">
                    <div class="box head-page">
                        <div class="departments-chart-page">
                            <h3>Organization Chart</h3>
                            <div class="box">
                           
                                <highchart :options="generalData" style="width: 100%;" />
                            </div>
                        </div>
                    </div>
                </div>
            </NuxtLayout>
        </div>
    </div>
</template>


<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss" scoped>
@import './style';
</style>