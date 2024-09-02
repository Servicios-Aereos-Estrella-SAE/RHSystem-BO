<template>
    <div class="box position-info-card">
        <div class="position-name">
            {{ `${position?.position.positionName}` }}
        </div>

        <div class="box-tools-footer">
            <Button v-if="canDelete" icon="pi pi-trash" class="box-btn btn-red" @click="handlerClickOnDelete()"/>
            <Button icon="pi pi-eye" class="box-btn" @click="handlerClickOnDetail(position.position.positionId)"/>
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