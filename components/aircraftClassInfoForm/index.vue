<template>
    <div class="box aircraft-class-info-form">
        <div class="aircraft-class-form">
            <div class="form-container">
                <div class="input-box">
                    <label for="aircraftClassName">Class Name</label>
                    <InputText id="aircraftClassName" v-model="aircraftClass.aircraftClassName"
                        :invalid="submitted && !aircraftClass.aircraftClassName" />
                    <small class="p-error" v-if="submitted && !aircraftClass.aircraftClassName">Class name is
                        required.</small>
                </div>
                <div class="input-box">
                    <label for="aircraftClassShortDescription">Short Description</label>
                    <InputText id="aircraftClassShortDescription" v-model="aircraftClass.aircraftClassShortDescription"
                        :invalid="submitted && !aircraftClass.aircraftClassShortDescription" />
                    <small class="p-error" v-if="submitted && !aircraftClass.aircraftClassShortDescription">Short
                        description is required.</small>
                </div>
                <div class="input-box">
                    <label for="aircraftClassLongDescription">Long Description</label>
                    <InputText id="aircraftClassLongDescription"
                        v-model="aircraftClass.aircraftClassLongDescription"
                        :invalid="submitted && !aircraftClass.aircraftClassLongDescription" rows="3" />
                    <small class="p-error" v-if="submitted && !aircraftClass.aircraftClassLongDescription">Long
                        description is required.</small>
                </div>
                <div class="input-box">
                    <label for="aircraftClassBanner">Banner</label>
                    <input type="file" id="aircraftClassBanner" @change="onFileChange" />
                    <small class="p-error" v-if="submitted && !aircraftClass.aircraftClassBanner">Banner is required.</small>
                </div>

                <div v-if="photoForm" class="input-box">
                    <img :src="photoForm" alt="Banner Preview" class="banner-preview" />
                </div>


                <div class="box-tools-footer">
                    <Button label="Save" severity="primary" @click="onSave()" />
                </div>
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

.p-errors {
    border: 1px solid red;
}

select {
    padding: 0.75rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
}

.banner-preview {
  max-width: 100%;
  max-height: 200px;
  height: auto;
  width: auto;
  display: block;
  margin: 0 auto;
}

</style>
