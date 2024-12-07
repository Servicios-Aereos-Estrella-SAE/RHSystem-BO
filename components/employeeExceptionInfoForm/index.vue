<template>
    <div class="shift-exception-info-form">
        <Toast />
        <employeeModalInfoCard :employee="employee" />
        <h1>
            {{ isNewExceptionRequest ? 'Add exception' : 'Update exception' }}
        </h1>

        <div v-if="isReady" class="shift-exception-form">
            <div class="form-container">
                <div class="input-box">
                    <label for="exception-type">
                        Exception Status
                    </label>
                    <Dropdown v-model="exceptionRequest.exceptionRequestStatus" :options="statusOptions"
                        optionLabel="label" optionValue="value" placeholder="Select Status" class="w-full md:w-14rem"
                        :disabled="true" />
                    <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestStatus">
                        Exception status is required.
                    </small>
                </div>
                <div class="input-box">
                    <label for="exception-type">
                        Exception type
                    </label>
                    <Dropdown v-model="exceptionRequest.exceptionTypeId" :options="exceptionTypeList"
                        optionLabel="exceptionTypeTypeName" optionValue="exceptionTypeId" placeholder="" filter
                        class="w-full md:w-14rem" @update:model-value="handleTypeChange" :disabled="changeStatus" />
                    <small class="p-error" v-if="submitted && !exceptionRequest.exceptionTypeId">Exception type is
                        required.</small>
                </div>
                <div class="input-box">
                    <label for="description">
                        Description
                    </label>
                    <Textarea v-model="exceptionRequest.exceptionRequestDescription" rows="5" cols="30"
                        :disabled="changeStatus" />
                    <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestDescription">
                        Description is required.
                    </small>
                </div>
                <div class="input-box">
                    <label for="requested-date">
                        Requested Date
                    </label>
                    <Calendar v-model="exceptionRequest.requestedDate" dateFormat="yy-mm-dd" placeholder="Select date"
                        class="w-full md:w-14rem" :disabled="changeStatus" />
                    <small class="p-error" v-if="submitted && !exceptionRequest.requestedDate">
                        Requested date is required.
                    </small>
                </div>
                <div v-if="needCheckInTime" class="input-box">
                    <label for="check-in-time">
                        Check in time
                    </label>
                    <Calendar v-model="exceptionRequest.exceptionRequestCheckInTime" timeOnly
                        :disabled="changeStatus" />
                    <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestCheckInTime">
                        Check in time is required.
                    </small>
                </div>
                <div v-if="needCheckOutTime" class="input-box">
                    <label for="check-out-time">
                        Check out time
                    </label>
                    <Calendar v-model="exceptionRequest.exceptionRequestCheckOutTime" timeOnly
                        :disabled="changeStatus" />
                    <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestCheckOutTime">
                        Check out time is required.
                    </small>
                </div>
                <div class="box-tools-footer">
                    <Button v-if="!changeStatus" class="btn btn-block btn-primary" @click="onSave">
                        Save exception
                    </Button>
                    <Button v-if="changeStatus && canUpdate" icon="pi pi-check" class="box-btn"
                        @click="handlerClickOnEdit()" />
                    <Button v-if="changeStatus && canDelete" icon="pi pi-times" class="box-btn"
                        @click="handlerClickOnDecline()" />
                </div>
            </div>
        </div>
        <transition name="page">
            <confirmRefuse v-if="drawerShiftExceptionDelete" :actionType="currentAction" @confirmRefuse="confirmDelete"
                @confirmAccept="confirmAccept" @cancelRefused="drawerShiftExceptionDelete = false" />
        </transition>
        <transition name="page">
            <div v-if="drawerShiftExceptionDeletes" class="modal-overlay">
                <div class="modal-content">
                    <h3>{{ currentAction === 'refuse' ? 'Refuse Shift Exception' : 'Accept Shift Exception' }}</h3>
                    <p v-if="currentAction === 'refuse'">Please provide a reason for refusal:</p>
                    <textarea v-if="currentAction === 'refuse'" v-model="description"
                        placeholder="Enter the reason for refusal..." class="textarea"></textarea>
                    <div class="modal-actions">
                        <Button label="Cancel" class="btn btn-cancel" @click="drawerShiftExceptionDeletes = false" />
                        <Button label="Confirm" class="btn btn-confirm"
                            :disabled="currentAction === 'refuse' && !description.trim()"
                            @click="currentAction === 'refuse' ? (drawerShiftExceptionDelete = true, drawerShiftExceptionDeletes = false) : confirmAccept()" />
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import Script from './script.ts'
    export default Script
</script>

<style lang="scss">
    @import './style';
</style>