<template>
    <div class="box aircraft-property-info-card">
        <Toast />
        <div class="aircraft-property-form">
            <div class="form-container">
                <!-- Property Name -->
                <div class="input-box">
                    <label for="aircraftPropertyName">Property Name</label>
                    <InputText id="aircraftPropertyName" v-model="aircraftProperty.aircraftPropertiesName"
                        :invalid="submitted && !aircraftProperty.aircraftPropertiesName" />
                    <small class="p-error" v-if="submitted && !aircraftProperty.aircraftPropertiesName">Property name is
                        required.</small>
                </div>
                
                <!-- Aircraft Class -->
                <div class="input-box">
                <label for="aircraftClassId">Aircraft Class</label>
                <Dropdown
                    id="aircraftClassId"
                    v-model="selectedAircraftClassId"
                    :options="aircraftClasses"
                    option-label="aircraftClassName"
                    option-value="aircraftClassId"
                    @change="onAircraftClassChange"
                    :invalid="submitted && !selectedAircraftClassId"
                />
                <small class="p-error" v-if="submitted && !selectedAircraftClassId">Aircraft class is required.</small>
                </div>
                <div class="input-box">
                    <label for="aircraftClassBanner">Banner</label>
                    <input type="file" id="aircraftClassBanner" @change="onFileChange" />
                </div>
                <div v-if="photoForm" class="input-box">
                    <img :src="photoForm" alt="Banner Preview" class="banner-preview" />
                </div>

                <!-- Max Passengers -->
                <div class="input-row">
                
                <div class="input-box">
                    <label for="aircraftPropertiesPax">Max Passengers</label>
                    <InputNumber id="aircraftPropertiesPax" v-model="aircraftProperty.aircraftPropertiesPax"
                        :invalid="submitted && aircraftProperty.aircraftPropertiesPax < 0" />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesPax < 0">Max passengers must be a positive number.</small>
                </div>

                <!-- Flight Speed -->
                <div class="input-box">
                    <label for="aircraftPropertiesSpeed">Flight Speed (MN/HR)</label>
                    <InputNumber id="aircraftPropertiesSpeed" v-model="aircraftProperty.aircraftPropertiesSpeed"
                        :invalid="submitted && aircraftProperty.aircraftPropertiesSpeed < 0" />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesSpeed < 0">Flight speed must be a positive number.</small>
                </div>
            </div>
                <!-- Max Baggage -->
                <div class="input-row">
                <div class="input-box">
                    <label for="aircraftPropertiesMaxKg">Max Baggage kg</label>
                    <InputNumber id="aircraftPropertiesMaxKg" v-model="aircraftProperty.aircraftPropertiesMaxKg"
                        :invalid="submitted && aircraftProperty.aircraftPropertiesMaxKg < 0" />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesMaxKg < 0">Max baggage must be a positive number.</small>
                </div>

                <!-- Autonomy -->
                <div class="input-box">
                    <label for="aircraftPropertiesAutonomy">Autonomy</label>
                    <InputNumber id="aircraftPropertiesAutonomy" v-model="aircraftProperty.aircraftPropertiesAutonomy"
                        :invalid="submitted && aircraftProperty.aircraftPropertiesAutonomy < 0" />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesAutonomy < 0">Autonomy must be a positive number.</small>
                </div>
            </div>

                <!-- Autonomy Hours -->
              
              
                <div class="input-box">
                    <label for="aircraftPropertiesAutonomyHours">Autonomy Hours</label>
                    <InputNumber id="aircraftPropertiesAutonomyHours" v-model="aircraftProperty.aircraftPropertiesAutonomyHours"
                        :invalid="submitted && aircraftProperty.aircraftPropertiesAutonomyHours < 0" />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesAutonomyHours < 0">Autonomy hours must be a positive number.</small>
                </div>
                <div class="input-row">
                <div class="input-box">
                    <label for="aircraftPropertiesHourlyRate">($) Hourly Rate</label>
                    <InputNumber id="aircraftPropertiesHourlyRate" v-model="aircraftProperty.aircraftPropertiesHourlyRate"
                         />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesHourlyRate < 0">hourly must be a positive number.</small>
                </div>
            
                <div class="input-box">
                    <label for="aircraftPropertiesLandingCostBase">Landing Cost Base</label>
                    <InputNumber id="aircraftPropertiesLandingCostBase" v-model="aircraftProperty.aircraftPropertiesLandingCostBase"
                         />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesLandingCostBase < 0">Landing Cost Base must be a positive number.</small>
                </div>
            </div>
                <!-- Landing Cost National -->
                <div class="input-box">
                    <label for="aircraftPropertiesLandingCostNational">Landing Cost National</label>
                    <InputNumber id="aircraftPropertiesLandingCostNational" v-model="aircraftProperty.aircraftPropertiesLandingCostNational"
                        :invalid="submitted && aircraftProperty.aircraftPropertiesLandingCostNational < 0" />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesLandingCostNational < 0">Landing cost must be a positive number.</small>
                </div>
                <div class="input-row">

                <div class="input-box">
                    <label for="aircraftPropertiesLandingCostInternational">Landing Cost International</label>
                    <InputNumber id="aircraftPropertiesLandingCostInternational" v-model="aircraftProperty.aircraftPropertiesLandingCostInternational"
                         />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesLandingCostInternational < 0">Overnight stay must be a positive number.</small>
                </div>
                
                <!-- Overnight Stay International -->
                <div class="input-box">
                    <label for="aircraftPropertiesOvernightStayLocal">Overnight Stay Local</label>
                    <InputNumber id="aircraftPropertiesOvernightStayLocal" v-model="aircraftProperty.aircraftPropertiesOvernightStayLocal"
                         />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesOvernightStayLocal < 0">Overnight stay must be a positive number.</small>
                </div>
            </div>

                <div class="input-row">
                <div class="input-box">
                    <label for="aircraftPropertiesOvernightStayInternational">Overnight Stay International</label>
                    <InputNumber id="aircraftPropertiesOvernightStayInternational" v-model="aircraftProperty.aircraftPropertiesOvernightStayInternational"
                        :invalid="submitted && aircraftProperty.aircraftPropertiesOvernightStayInternational < 0" />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesOvernightStayInternational < 0">Overnight stay must be a positive number.</small>
                </div>

              
                <div class="input-box">
                    <label for="aircraftPropertiesFuelSurcharge">Fuel Surcharge</label>
                    <InputNumber id="aircraftPropertiesFuelSurcharge" v-model="aircraftProperty.aircraftPropertiesFuelSurcharge"
                         />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesFuelSurcharge < 0">Overnight stay must be a positive number.</small>
                </div>
                </div>
                <div class="input-box">
                    <label for="aircraftPropertiesDescription">General Description</label>
                    <Textarea id="aircraftPropertiesDescription" v-model="aircraftProperty.aircraftPropertiesDescription" autoResize rows="3"
                         />
                    <small class="p-error" v-if="submitted && aircraftProperty.aircraftPropertiesDescription < 0">Description.</small>
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

.p-error {
    color: red;
}
.input-row {
    display: flex;
    gap: 10px; 
}
.input-box {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.input-box label {
    display: block;
    margin-bottom: 0.5rem;
}

.input-box .p-error {
    display: block;
    margin-top: 0.25rem;
}

.box-tools-footer {
    margin-top: 1rem;
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
