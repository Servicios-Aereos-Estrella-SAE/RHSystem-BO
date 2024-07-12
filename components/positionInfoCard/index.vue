<template>
    <div class="box position-info-card">
        <div class="position-name">
            {{ `${position?.position.positionName}` }}
        </div>

        <div class="box-tools-footer">
            <Button icon="pi pi-pencil" @click="handlerClickOnDetail(position.position.positionId)" />
        </div>
    </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import './style';
</style>