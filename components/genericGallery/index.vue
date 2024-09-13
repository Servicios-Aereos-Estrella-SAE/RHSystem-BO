<template>
 
    <div>
        <div class="flex flex-col md:flex-row">
            <div class="input-box flex flex-col gap-4 space">
                <label for="galeryCategory">Category Name</label>
                <InputText id="galeryCategory" v-model="galeryCategory" :invalid="submitted && !galeryCategory" />
                <ul v-if="filteredCategories.length" class="suggestions-list">
                    <li v-for="category in filteredCategories" :key="category" @click="selectCategory(category)">
                        {{ category }}
                    </li>
                </ul>
                <small class="p-error" v-if="submitted && !galeryCategory">Category name is required.</small>
            </div>
        </div>
        <div class="input-box flex flex-col gap-2 space">
            <label for="aircraftClassBanner">Image Upload</label>
            <input type="file" id="aircraftClassBanner" @change="onFileChange" />
        </div>
        <div v-if="photoForm" class="input-box">
            <img :src="photoForm" alt="Banner Preview" class="banner-preview" />
        </div>

        <div class="flex flex-col md:flex-row">
            <div class="flex space">
                <Button label="Save" severity="primary" @click="onSave()" class="btn-save" />
            </div>
        </div>
    </div>
  <div class="gallery-container">
    <div v-if="gallery.length" class="gallery-grid">
      <div v-for="image in gallery" :key="image.id" class="gallery-card">
        <Image :src="image.galeryPath" :alt="image.galeryCategory" class="gallery-image" width="250" preview />

        <!-- Modo de edición de la categoría -->
        <div v-if="isEditing" class="edit-category">
          <InputText v-model="image.galeryCategory" placeholder="Edit category" />
        </div>
        <!-- Mostrar categoría si no está en modo de edición -->
        <div v-else class="gallery-category">{{ image.galeryCategory }}</div>

        <!-- Botones de guardar cuando esté en modo de edición -->
        <div v-if="isEditing" class="gallery-actions">
          <Button icon="pi pi-times" class="box-btn btn-red" @click="cancelEdit(image)" />
          <Button icon="pi pi-check" class="box-btn btn-green" @click="saveEdit(image)" />
        </div>
        <!-- Botones de editar y eliminar cuando no está en modo de edición -->
        <div v-else class="gallery-actions">
          <Button icon="pi pi-pencil" class="box-btn btn-blue" @click="editCategory(image)" />
          <Button icon="pi pi-trash" class="box-btn btn-red" @click="clickOnDeleteImage(image.id)" />
        </div>
      </div>
    </div>
    <div v-else class="no-images">
      No images available.
    </div>
  </div>
    <Dialog v-model:visible="drawerGalleryDelete" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="aircraft">Are you sure you want to delete?</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="drawerGalleryDelete = false" />
            <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
        </template>
    </Dialog>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import './style';

.box-tools-footer {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;

    button {
        width: 100%;
    }
}

.box-btn {
    padding: 1rem;
    box-sizing: border-box;
    border-radius: 0.375rem;
    border: none;
    background-color: white;
    color: #303e67;
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.4s;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    border: 1px solid #e3ebf6;
    text-decoration: none;
    width: 100%;
}

.btn-red {
    color: red;
}

.btn-save {
    width: 100%;
}

.space {
    margin-top: 5%;
    margin-bottom: 3%;
}

.form-container {
    margin-top: 2.25rem;
    position: relative;

    .input-box {
        align-items: center;
    }
}

.banner-preview {
    max-width: 100%;
    max-height: 200px;
    height: auto;
    width: auto;
    display: block;
    margin: 0 auto;
}

.box-tools-footer {
    margin-top: 1rem;
}

.suggestions-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    max-height: 150px;
    overflow-y: auto;
}

.suggestions-list li {
    padding: 5px 10px;
    cursor: pointer;
}

.suggestions-list li:hover {
    background-color: #f0f0f0;
}
</style>