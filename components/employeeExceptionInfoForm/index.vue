<template>
    <div class="shift-exception-info-form">
        <Toast />
        <employeeModalInfoCard :employee="employee"/>
        <h1>
            {{ isNewShiftException ? 'Add exception' : 'Update exception' }}
        </h1>

        <div v-if="isReady" class="shift-exception-form">
            <div class="form-container">
                <div class="input-box">
                    <label for="exception-type">
                        Exception Status
                    </label>
                    <Dropdown v-model="shiftException.exceptionRequestStatus" :options="statusOptions"
                        optionLabel="label" optionValue="value" placeholder="Select Status" class="w-full md:w-14rem" :disabled="true"/>
                    <small class="p-error" v-if="submitted && !shiftException.exceptionRequestStatus">
                        Exception status is required.
                    </small>
                </div>
                <div class="input-box">
                    <label for="exception-type">
                        Exception type
                    </label>
                    <Dropdown v-model="shiftException.exceptionTypeId" :options="exceptionTypeList"
                        optionLabel="exceptionTypeTypeName" optionValue="exceptionTypeId" placeholder="" filter
                        class="w-full md:w-14rem" @update:model-value="handleTypeChange" />
                    <small class="p-error" v-if="submitted && !shiftException.exceptionTypeId">Exception type is
                        required.</small>
                </div>
                <div class="input-box">
                    <label for="description">
                        Description
                    </label>
                    <Textarea v-model="shiftException.exceptionRequestDescription" rows="5" cols="30" />
                    <small class="p-error" v-if="submitted && !shiftException.exceptionRequestDescription">
                        Description is required.
                    </small>
                </div>
                <div class="input-box">
                    <label for="requested-date">
                        Requested Date
                    </label>
                    <Calendar v-model="shiftException.requestedDate" dateFormat="yy-mm-dd" showTime
                        hourFormat="24" placeholder="Select date and time" class="w-full md:w-14rem" />
                    <small class="p-error" v-if="submitted && !shiftException.requestedDate">
                        Requested date is required.
                    </small>
                </div>
                <div class="box-tools-footer">
                    <Button class="btn btn-block btn-primary" @click="onSave">
                        Save exception
                    </Button>
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
</style>