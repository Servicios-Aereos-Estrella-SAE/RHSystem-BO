<template>
    <div class="box shift-exception-info-card">
        <!-- Nombre del empleado -->
        <div class="employee-name">
            {{ `${shiftException?.exceptionType.exceptionTypeTypeName}` }}
        </div>

        <div class="shift-exception-details">
            <!-- Departamento -->
            <div class="property-row">
                <span>Department</span>
                <span class="property-value">{{ shiftException.employee.department.departmentName }}</span>
            </div>

            <!-- Puesto -->
            <div class="property-row">
                <span>Position</span>
                <span class="property-value">{{ shiftException.employee.position.positionName }}</span>
            </div>

            <!-- Tipo de Excepción -->
            <div class="property-row">
                <span>Employee Name</span>
                <span class="property-value">{{ shiftException.employee.employeeFirstName }} {{ shiftException.employee.employeeLastName }}</span>

            </div>

            <!-- Motivo de la excepción -->
            <div class="property-row">
                <span>Date Requests</span>
                <span class="property-value"> {{ calendarDay }}</span>
            </div>

            <div class="property-row">
                <span>Description</span>
                <span class="property-value">{{ shiftException.exceptionRequestDescription }}</span>
            </div>

            <!-- Estado de la solicitud -->
            <div class="property-row">
                <span>Status</span>
                <span class="property-value">{{ shiftException.exceptionRequestStatus }}</span>
            </div>
        </div>

        <div class="box-tools-footer" v-if="showEditButton">
            <Button v-if="canUpdate" icon="pi pi-check" class="box-btn" @click="handlerClickOnEdit()" />
            <Button v-if="canDelete" icon="pi pi-times" class="box-btn" @click="handlerClickOnDecline()" />
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

.shift-exception-info-card {
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
    }

    .property-value {
        text-align: right;
        margin-left: auto;
    }

    .employee-name {
        text-align: left;
        font-weight: 500;
        margin-bottom: 0.5rem;
        font-size: 14px;
    }

    .image-employee {
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

    .shift-exception-details {
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
