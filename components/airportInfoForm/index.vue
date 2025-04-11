<template>
    <div class="box airport-info-form">
        <div v-if="airport" class="airport-form">
            <div class="form-container">
                <div >
                    <div class="input-box">
                        <label for="airportName">Airport Name</label>
                        <InputText id="airportName" v-model="airport.airportName"
                            :invalid="submitted && !airport.airportName" />
                        <small class="p-error" v-if="submitted && !airport.airportName">Airport name is
                            required.</small>
                    </div>

                    <div class="input-box">
                        <label for="airportType">Airport Type</label>
                        <Dropdown id="airportType" v-model="airport.airportType" :options="cities" optionLabel="name" optionValue="value"
                            :invalid="submitted && !airport.airportType" />
                        <small class="p-error" v-if="submitted && !airport.airportType">Airport name is
                            required.</small>
                    </div>

                    <div class="input-box">
                        <label for="airportIcaoCode">ICAO Code</label>
                        <InputText id="airportIcaoCode" v-model="airport.airportIcaoCode"
                            :invalid="submitted && !airport.airportIcaoCode" />
                        <small class="p-error" v-if="submitted && !airport.airportIcaoCode">ICAO code is
                            required.</small>
                    </div>

                    <div class="input-box">
                        <label for="airportIataCode">IATA Code</label>
                        <InputText id="airportIataCode" v-model="airport.airportIataCode"
                            :invalid="submitted && !airport.airportIataCode" />
                        <small class="p-error" v-if="submitted && !airport.airportIataCode">IATA code is
                            required.</small>
                    </div>

                    <div class="input-box">
                        <label for="airportLatitudeDeg">Latitude</label>
                        <InputText id="airportLatitudeDeg" v-model="airport.airportLatitudeDeg"
                            :invalid="submitted && !airport.airportLatitudeDeg" />
                        <small class="p-error" v-if="submitted && !airport.airportLatitudeDeg">Latitude is
                            required.</small>
                    </div>

                    <div class="input-box">
                        <label for="airportLongitudeDeg">Longitude</label>
                        <InputText id="airportLongitudeDeg" v-model="airport.airportLongitudeDeg"
                            :invalid="submitted && !airport.airportLongitudeDeg" />
                        <small class="p-error" v-if="submitted && !airport.airportLongitudeDeg">Longitude is
                            required.</small>
                    </div>

                    <div class="input-box">
                        <label for="airportElevationFt">Elevation (ft)</label>
                        <InputNumber id="airportElevationFt" v-model="airport.airportElevationFt"
                            :invalid="submitted && !airport.airportElevationFt" />
                        <small class="p-error" v-if="submitted && !airport.airportElevationFt">Elevation is
                            required.</small>
                    </div>

                    <div class="input-box">
                        <label for="airportDisplayLocationName">Location Name</label>
                        <InputText id="airportDisplayLocationName" v-model="airport.airportDisplayLocationName"
                            :invalid="submitted && !airport.airportDisplayLocationName" />
                        <small class="p-error" v-if="submitted && !airport.airportDisplayLocationName">Location name is
                            required.</small>
                    </div>

                    <div class="input-box">
                        <label for="airportIsoCountry">ISO Country Code</label>
                        <InputText id="airportIsoCountry" v-model="airport.airportIsoCountry"
                            :invalid="submitted && !airport.airportIsoCountry" />
                        <small class="p-error" v-if="submitted && !airport.airportIsoCountry">ISO country code is
                            required.</small>
                    </div>

                    <div class="input-box">
                        <label for="airportIsoRegion">ISO Region Code</label>
                        <InputText id="airportIsoRegion" v-model="airport.airportIsoRegion"
                            :invalid="submitted && !airport.airportIsoRegion" />
                        <small class="p-error" v-if="submitted && !airport.airportIsoRegion">ISO region code is
                            required.</small>
                    </div>

                    <div class="input-box">
                        <label for="airportActive">Active {{isAirportActive}}</label>
                        <ToggleButton v-model="isAirportActive" onLabel="Active" offLabel="Inactive" />

                    </div>

                </div>

                <div class="card flex justify-center"></div>

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
</style>
