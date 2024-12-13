<template>
    <div class="exception-request-info-form">
        <Toast />
        <employeeModalInfoCard :employee="employee" />
        <h1>
            {{ isNewExceptionRequest ? 'Add exception request' : 'Update exception request' }}
        </h1>

        <div v-if="isReady" class="exception-request-form">
            <div class="form-container">
                <div class="input-box">
                    <label for="exception-type">
                        Status
                    </label>
                    <Dropdown v-model="exceptionRequest.exceptionRequestStatus" :options="statusOptions"
                        optionLabel="label" optionValue="value" placeholder="Select Status" class="w-full md:w-14rem"
                        :disabled="true" />
                    <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestStatus">
                       Status is required.
                    </small>
                </div>
                <div class="input-box">
                    <label for="exception-type">
                        Type
                    </label>
                    <Dropdown v-model="exceptionRequest.exceptionTypeId" :options="exceptionTypeList"
                        optionLabel="exceptionTypeTypeName" optionValue="exceptionTypeId" placeholder="" filter
                        class="w-full md:w-14rem" @update:model-value="handleTypeChange" :disabled="changeStatus || exceptionRequest.exceptionRequestStatus !== 'pending'" />
                    <small class="p-error" v-if="submitted && !exceptionRequest.exceptionTypeId">Type is
                        required.</small>
                </div>
                <div class="input-box">
                    <label for="description">
                        Description
                    </label>
                    <Textarea v-model="exceptionRequest.exceptionRequestDescription" rows="5" cols="30"
                    :disabled="changeStatus || exceptionRequest.exceptionRequestStatus !== 'pending'"/>
                    <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestDescription">
                        Description is required.
                    </small>
                </div>
                <div class="input-box">
                    <label for="requested-date">
                        Requested Date
                    </label>
                    <Calendar v-model="exceptionRequest.requestedDate" dateFormat="yy-mm-dd" placeholder="Select date"
                        class="w-full md:w-14rem" :disabled="changeStatus || exceptionRequest.exceptionRequestStatus !== 'pending'" />
                    <small class="p-error" v-if="submitted && !exceptionRequest.requestedDate">
                        Requested date is required.
                    </small>
                </div>
                <div v-if="needCheckInTime" class="input-box">
                    <label for="check-in-time">
                        Check in time
                    </label>
                    <Calendar v-model="exceptionRequest.exceptionRequestCheckInTime" timeOnly
                    :disabled="changeStatus || exceptionRequest.exceptionRequestStatus !== 'pending'" />
                    <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestCheckInTime">
                        Check in time is required.
                    </small>
                </div>
                <div v-if="needCheckOutTime" class="input-box">
                    <label for="check-out-time">
                        Check out time
                    </label>
                    <Calendar v-model="exceptionRequest.exceptionRequestCheckOutTime" timeOnly
                    :disabled="changeStatus || exceptionRequest.exceptionRequestStatus !== 'pending'" />
                    <small class="p-error" v-if="submitted && !exceptionRequest.exceptionRequestCheckOutTime">
                        Check out time is required.
                    </small>
                </div>
                <div class="box-tools-footer">
                    <Button v-if="!changeStatus && exceptionRequest.exceptionRequestStatus === 'pending'" class="btn btn-block btn-primary" @click="onSave">
                        Save
                    </Button>
                    <Button v-if="changeStatus && canUpdate" icon="pi pi-check" class="box-btn"
                        @click="handlerClickOnEdit()" />
                    <Button v-if="changeStatus && canDelete" icon="pi pi-times" class="box-btn"
                        @click="handlerClickOnDecline()" />
                </div>
            </div>
        </div>
        <transition name="page">
            <confirmRefuse v-if="drawerExceptionRequestDelete" :actionType="currentAction" @confirmRefuse="confirmDelete"
                @confirmAccept="confirmAccept" @cancelRefused="drawerExceptionRequestDelete = false" />
        </transition>
        <transition name="page">
            <div v-if="drawerExceptionRequestDeletes" class="modal-overlay">
                <div class="modal-content">
                    <h3>{{ currentAction === 'refuse' ? 'Refuse Exception Request' : 'Accept Exception Request' }}</h3>
                    <p v-if="currentAction === 'refuse'">Please provide a reason for refuse:</p>
                    <textarea v-if="currentAction === 'refuse'" v-model="description"
                        placeholder="Enter the reason for refuse..." class="textarea"></textarea>
                    <div class="modal-actions">
                        <Button label="Cancel" class="btn btn-cancel" @click="drawerExceptionRequestDeletes = false" />
                        <Button label="Confirm" class="btn btn-confirm"
                            :disabled="currentAction === 'refuse' && !description.trim()"
                            @click="currentAction === 'refuse' ? (drawerExceptionRequestDelete = true, drawerExceptionRequestDeletes = false) : confirmAccept()" />
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