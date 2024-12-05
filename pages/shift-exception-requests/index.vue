<template>
    <div class="shift-exception-page">
        <Toast />

        <Head>
            <Title>Shift Exception Requests</Title>
        </Head>
        <NuxtLayout name="backoffice">
            <div class="shift-exception-wrapper">
                <div class="box head-page">
                    <div class="input-box">
                        <label for="role">
                            Department
                        </label>
                        <Dropdown v-model="selectedDepartmentId" :options="departments" optionLabel="departmentName"
                            optionValue="departmentId" placeholder="Select a Department" filter
                            class="w-full md:w-14rem" @change="handlerSearchShiftException" />
                    </div>
                    <div class="input-box">
                        <label for="positionId">Position</label>
                        <Dropdown v-model="selectedPositionId" :options="positions" optionLabel="positionName"
                            optionValue="positionId" placeholder="Select a Position" filter class="w-full md:w-14rem" />
                    </div>
                    <div class="input-box">
                        <label for="status">Status</label>
                        <Dropdown v-model="selectedStatus" :options="statusOptions" optionLabel="label"
                            optionValue="value" placeholder="Select a Status" filter class="w-full md:w-14rem"
                            @change="handlerSearchShiftException" />
                    </div>
                    <div class="input-box">
                        <label for="search">Search employee</label>
                        <AutoComplete v-model="selectedEmployee"
                            :optionLabel="(employee) => `${employee.employeeFirstName} ${employee.employeeLastName}`"
                            :suggestions="filteredEmployees" @complete="handlerSearchEmployee"
                            @item-select="onEmployeeSelect">
                            <template #option="employee">
                                <div class="item-employee-filter-attendance-monitor">
                                    <div class="name">
                                        {{ employee.option.employeeFirstName }} {{ employee.option.employeeLastName }}
                                    </div>
                                    <div class="position-department">
                                        {{ employee.option.department?.departmentAlias ||
                                        employee.option.department?.departmentName }}
                                        /
                                        {{ employee.option.position?.positionAlias ||
                                        employee.option.position?.positionName }}
                                    </div>
                                </div>
                            </template>
                        </AutoComplete>
                    </div>

                    <div class="input-box">
                        <Button label="Clear Filters " class="btn btn-block" icon="pi pi-times" @click="clearFilters" />
                    </div>
                </div>
                <div>
                    <h2>Shift Exception Requests</h2>
                    <div v-if="filteredShiftExceptionRequests.length > 0" class="shift-exception-card-wrapper">
                        <div v-for="(shiftException, index) in filteredShiftExceptionRequests"
                            :key="`shiftException-${shiftException.id}-${index}`">
                            <shiftExceptionInfoForm :shiftException="shiftException" :can-update="canUpdate"
                                :can-delete="canDelete" :click-on-edit="() => { onEdit(shiftException) }"
                                :click-on-delete="() => { onDelete(shiftException) }" />
                        </div>
                    </div>

                    <div v-else class="empty">
                        <div>
                            <div class="icon">
                                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M17.25 10a7.25 7.25 0 1 0-2.681 5.63l4.9 4.9.085.073a.75.75 0 0 0 .976-1.133l-4.9-4.901A7.22 7.22 0 0 0 17.25 10ZM11 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 2a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 9Z"
                                        fill="#88a4bf" class="fill-212121"></path>
                                </svg>
                            </div>
                            No Shift Exception Requests results
                        </div>
                    </div>
                    <div></div>
                    <Paginator v-if="first > 1" class="paginator" :first="first" :rows="rowsPerPage"
                        :totalRecords="totalRecords" @page="onPageChange" />

                </div>
            </div>

        </NuxtLayout>
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

<style lang="scss" scoped>
@import './style';

.shift-exception-card-wrapper {
    display: flex;
    flex-wrap: wrap;
}

.shift-exception-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
        width: 100% !important;
    }
}
</style>

<style lang="scss">
@import '/resources/styles/variables.scss';

.empty {
    background-color: $gray;
    color: $icon;
    padding: 1rem;
    height: 15rem;
    border: solid 1rem white;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {

        svg {
            width: 4rem;
        }
    }
}

:deep(.graph-label) {
    color: red;
}

.graph-label {
    color: red;
}

.shift-exception-form-sidebar {
    width: 100% !important;
    max-width: 35rem !important;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.textarea {
    width: 100%;
    height: 100px;
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.btn-cancel {
    background: #f5f5f5;
    color: #333;
}

.btn-confirm {
    background: #007bff;
    color: white;
}
</style>
