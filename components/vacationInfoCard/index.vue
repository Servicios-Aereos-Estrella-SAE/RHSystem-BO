<template>
    <div class="box vacation-info-card">
        <div class="vacation-years">
            {{ `Years of Service: ${vacation.vacationSettingYearsOfService}` }}
        </div>
        <div class="vacation-days">
            {{ `Vacation Days: ${vacation.vacationSettingVacationDays}` }}
        </div>

        <div class="box-tools-footer" v-if="showEditButton">
            <Button v-if="canUpdate" icon="pi pi-pencil" class="box-btn" @click="handlerClickOnEdit()" />
            <Button v-if="canDelete" icon="pi pi-trash" class="box-btn btn-red"
                @click="handlerClickOnDelete()" />
        </div>
    </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import '/resources/styles/variables.scss';


.vacation-info-card {
    position: relative;

    .vacation-years {
        text-align: left;
        font-weight: 500;
        box-sizing: border-box;
        padding: 1rem 3px;
    }

    .vacation-days {
        text-align: left;
        font-weight: 400;
        border-radius: calc($radius / 2);
        box-sizing: border-box;
        padding: 3px;
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