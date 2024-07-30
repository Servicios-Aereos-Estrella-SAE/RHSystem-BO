<template>
    <div class="box vacation-info-form">
        <Toast />
        <div v-if="vacation" class="vacation-form">
            <div class="form-container">
                <div class="input-box">
                    <label for="yearsOfService">Years of Service</label>
                    <InputNumber id="yearsOfService" v-model="vacation.yearsOfService"
                        :invalid="submitted && !vacation.yearsOfService" />
                    <small class="p-error" v-if="submitted && !vacation.yearsOfService">Years of service is
                        required.</small>
                </div>
                <div class="input-box">
                    <label for="vacationDays">Vacation Days</label>
                    <InputNumber id="vacationDays" v-model="vacation.vacationDays"
                        :invalid="submitted && !vacation.vacationDays" />
                    <small class="p-error" v-if="submitted && !vacation.vacationDays">Vacation days are
                        required.</small>
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
</style>