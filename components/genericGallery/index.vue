<template>
    <div class="gallery-container">
        <div v-if="gallery.length" class="gallery-grid">
            <div v-for="image in gallery" :key="image.id" class="gallery-card">
                <img :src="image.galeryPath" :alt="image.galeryCategory" class="gallery-image" />
                <div class="gallery-category">{{ image.galeryCategory }}</div>
            </div>
        </div>
        <div v-else class="no-images">
            No images available.
        </div>
        <div class="form-container">
            <div class="input-box">
                <label for="galeryCategory">Category Name</label>
                <InputText id="galeryCategory" v-model="galeryCategory" :invalid="submitted && galeryCategory" />
                <small class="p-error" v-if="submitted && galeryCategory">Category name is required.</small>
            </div>
        </div>
    </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import './style';
.form-container{
    margin-top: 2.25rem;
    position:relative;

    .input-box{
        display: flex;
        align-items: center;
    }
}
</style>