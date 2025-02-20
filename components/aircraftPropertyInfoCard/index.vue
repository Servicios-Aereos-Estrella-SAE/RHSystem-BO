<template>
    <div class="box aircraft-property-info-card">
        <div class="image-aircraft" v-if="aircraftProperty.aircraftPropertiesBanner">
            <img :alt="`Banner for ${aircraftProperty.aircraftPropertiesName}`"
                :src="aircraftProperty.aircraftPropertiesBanner" />
        </div>

        <div class="aircraft-property-name">
            {{ `${aircraftProperty.aircraftPropertiesName}` }}
        </div>
        <div class="aircraft-property-details">
            <div class="property-row">
                <span>Max Passengers</span>
                <span class="property-value">{{ aircraftProperty.aircraftPropertiesPax }}</span>
            </div>

            <div class="property-row">
                <span>Flight Speed (MN/HR)</span>
                <span class="property-value">{{ aircraftProperty.aircraftPropertiesSpeed }}</span>
            </div>

            <div class="property-row">
                <span>Hourly Rate</span>
                <span class="property-value">${{ aircraftProperty.aircraftPropertiesHourlyRate }}</span>
            </div>

            <div class="property-row">
                <span>Overnight Stay Local</span>
                <span class="property-value">${{ aircraftProperty.aircraftPropertiesOvernightStayLocal }}</span>
            </div>

            <div class="property-row">
                <span>Overnight Stay Inter...</span>
                <span class="property-value">${{ aircraftProperty.aircraftPropertiesOvernightStayInternational }}</span>
            </div>

            <div class="property-row">
                <span>Max Baggage kg</span>
                <span class="property-value">{{ aircraftProperty.aircraftPropertiesMaxKg }} kg</span>
            </div>

        </div>

        <div class="box-tools-footer" v-if="showEditButton">
            <Button v-if="canUpdate" icon="pi pi-pencil" class="box-btn" @click="handlerClickOnEdit()" />
            <Button v-if="canDelete" icon="pi pi-trash" class="box-btn btn-red" @click="handlerClickOnDelete()" />
        </div>
    </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import '/resources/styles/variables.scss';


.aircraft-property-info-card {
    position: relative;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e3ebf6;
    background-color: white;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);

    .property-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.25rem;
        /* Espaciado entre filas */
    }

    .property-value {
        text-align: right;
        margin-left: auto;
    }

    .aircraft-property-name {
        text-align: left;
        font-weight: 500;
        margin-bottom: 0.5rem;
        font-size: 14px;
    }

    .image-aircraft {
        width: 100%;
        height: 150px;
        /* Ajusta la altura según sea necesario */
        overflow: hidden;
        border-radius: 0.5rem;
        /* Añade un borde redondeado */
        margin-bottom: 1rem;
        /* Espacio inferior para separar la imagen del contenido */

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            /* Asegura que la imagen cubra todo el contenedor sin deformarse */
            border-radius: 0.5rem;
            /* Mantén el borde redondeado para la imagen también */
        }
    }

    .aircraft-property-details {
        text-align: left;
        font-weight: 400;
        margin-bottom: 1rem;

        div {
            margin-bottom: 0.25rem;
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
    }

    .btn-red {
        color: red;
    }

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
}
</style>
