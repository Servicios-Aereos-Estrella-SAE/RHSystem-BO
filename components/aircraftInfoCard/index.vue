<template>
    <div class="box aircraft-info-card">
        <div class="aircraft-info-name">
            {{ aircraft.aircraftRegistrationNumber }}
        </div>
        <div class="aircraft-info-details">
            <div class="detail-row">
                <span>Serial Number</span>
                <span class="detail-value">{{ aircraft.aircraftSerialNumber }}</span>
            </div>

            <!-- <div class="detail-row">
                <span>Properties ID</span>
                <span class="detail-value">{{ aircraft.aircraftPropertiesId }}</span>
            </div> -->

            <div class="detail-row">
                <div class="aircraft-status assist">
                    {{ `Active: ${aircraft.aircraftActive === 1 ? 'Yes' : 'No'}` }}
                </div>
            </div>
        </div>

        <div class="box-tools-footer">
            <Button icon="pi pi-pencil" class="box-btn" @click="handlerClickOnEdit()" />
            <Button icon="pi pi-trash" class="box-btn btn-red" @click="handlerClickOnDelete()" />
        </div>
    </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import '/resources/styles/variables.scss';
@import 'primeicons/primeicons.css';

.aircraft-info-card {
    position: relative;
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e3ebf6;
    background-color: white;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);

    .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
    }

    .detail-value {
        text-align: right;
        margin-left: auto;
    }

    .aircraft-info-name {
        text-align: left;
        font-weight: 500;
        margin-bottom: 0.5rem;
        font-size: 16px;
    }

    .image-aircraft {
        width: 100%;
        height: 150px;
        overflow: hidden;
        border-radius: 0.5rem;
        margin-bottom: 1rem;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 0.5rem;
        }
    }

    .aircraft-info-details {
        text-align: left;
        font-weight: 400;
        margin-bottom: 1rem;
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

    .assist {
        font-size: 14px;
        color: $success;
        margin-bottom: 0.75rem;
        background-color: transparentize($color: $success, $amount: 0.95);
    }

    .aircraft-status {
        text-align: left;
        font-weight: 400;
        border-radius: calc($radius / 2);
        box-sizing: border-box;
        padding: 2%;
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