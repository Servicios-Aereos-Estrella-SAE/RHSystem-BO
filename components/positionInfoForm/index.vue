<template>
    <div class="box position-info-form">
        <Toast />
        <div class="position-form">
            <div class="form-container">
                <div>
                    <div class="input-box">
                        <label for="positionCode">Position Code</label>
                        <InputText id="positionCode" v-model="position.positionCode"
                            :invalid="submitted && !position.positionCode" />
                        <small class="p-error" v-if="submitted && !position.positionCode">
                            Position code is required.
                        </small>
                    </div>

                    <div class="input-box">
                        <label for="positionName">Position Name</label>
                        <InputText id="positionName" v-model="position.positionName"
                            :invalid="submitted && !position.positionName" />
                        <small class="p-error" v-if="submitted && !position.positionName">
                            Position name is required.
                        </small>
                    </div>

                    <div class="input-box">
                        <label for="positionAlias">Position Alias</label>
                        <InputText id="positionAlias" v-model="position.positionAlias"
                            :invalid="submitted && !position.positionAlias" />
                        <small class="p-error" v-if="submitted && !position.positionAlias">
                            Position alias is required.
                        </small>
                    </div>

                    <!-- Company Dropdown -->
                    <div class="input-box">
                        <label for="companyId">Company</label>
                        <Dropdown id="companyId" v-model="position.companyId" :options="[{ name: 'SAE', id: 1 }]"
                            optionLabel="name"
                            optionValue="id"
                            :invalid="submitted && !position.companyId"
                            />
                            <small class="p-error" v-if="submitted && !position.companyId">
                                Company is required.
                            </small>
                    </div>
                    <div class="input-box">
                        <label for="parentPositionId">Parent Position</label>
                        <Dropdown 
                            id="parentPositionId" 
                            v-model="position.parentPositionId" 
                            optionLabel="positionName" 
                            optionValue="positionId"
                            :placeholder="'Select a Parent Position'"
                            :disabled="!parentPositions.length"
                            :invalid="submitted && !position.parentPositionId"
                        />
                        <small class="p-error" v-if="submitted && !position.parentPositionId">
                            Parent position is required.
                        </small>
                    </div>
                    <div class="input-box">
                        <label for="positionIsDefault">Default Position</label>
                        <ToggleButton v-model="position.positionIsDefault" onLabel="Yes" offLabel="No" />
                    </div>

                    <div class="input-box">
                        <label for="positionActive">Active </label>
                        <ToggleButton v-model="position.positionActive" onLabel="Active" offLabel="Inactive" />
                    </div>
                </div>

                <!-- Buttons -->
                <div class="box-tools-footer">
                    <Button label="Save" severity="primary" @click="onSave()" />
                    <!-- <Button label="Proceeding files" severity="primary" @click="getProceedingFiles()" /> -->
                </div>
            </div>
        </div>

        <!-- Sidebar for Proceeding Files -->
        <!-- <Sidebar v-model:visible="drawerProceedingFiles" header="Position Proceeding Files" position="right" class="proceeding-file-sidebar"
        :showCloseIcon="true">
        <positionProceedingFile :position="position" />
      </Sidebar> -->

    </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import './style';

.proceeding-file-sidebar {
    width: 100% !important;
    max-width: 90rem !important;

    @media screen and (max-width: $sm) {
        width: 100% !important;
    }
}
</style>
