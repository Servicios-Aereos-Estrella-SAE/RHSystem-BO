<template>
    <div class="box shift-info-form">
        <Toast />
        <div class="shift-form">
            <div class="form-container">
                <div class="input-box">
                    <label for="shift">Shift</label>
                    <Dropdown id="shift" v-model="selectedShift" :options="shiftsList" optionLabel="shiftName"
                        placeholder="Select Shift" :invalid="submitted && !selectedShift" />
                    <small class="p-error" v-if="submitted && !selectedShift">Shift is required.</small>
                </div>
                <div class="input-box">
                    <label for="shiftApplySince">Apply Since</label>
                    <Calendar v-model="applySince" />
                    <small class="p-error" v-if="submitted && !applySince ">Apply since date is
                        required.</small>
                </div>
                <div class="box-tools-footer">
                    <Button label="Save" severity="primary" @click="onSave()" />
                </div>

            </div>
        </div>
    </div>
    <Dialog v-model:visible="drawerShiftConfirm" :style="{width: '450px'}" header="Confirm" :modal="true">
        <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span> Are you sure you want to assign the shift: {{selectedShift.shiftName }}, to all employees in the
                Position: {{position.positionName}}
            </span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="drawerShiftConfirm = false" />
            <Button label="Yes" icon="pi pi-check" text @click="confirmSave()" />
        </template>
    </Dialog>
    <Message v-show="warnings.length > 0" severity="warn">
        <div v-for="(warning, index) in warnings" :key="`warning-${warning.employeeId}-${index}`">
            Employee: {{ warning.employee.employeeCode }} {{ warning.employee.employeeFirstName }} {{
            warning.employee.employeeLastName }} <br>Details: {{ warning.message }}
            <br>
            <br>
        </div>
        <br>
    </Message>
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