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
                            class="w-full md:w-14rem"
                            @change="handlerSearchShiftException" />
                    </div>
                    <div class="input-box">
                        <label for="positionId">Position</label>
                        <Dropdown v-model="selectedPositionId" :options="positions" optionLabel="positionName"
                            optionValue="positionId" placeholder="Select a Position" filter class="w-full md:w-14rem"
                            />
                    </div>
                    <div class="input-box">
                        <label for="status">Status</label>
                        <Dropdown v-model="selectedStatus" :options="statusOptions" optionLabel="label"
                            optionValue="value" placeholder="Select a Status" filter class="w-full md:w-14rem"
                            @change="handlerSearchShiftException" />
                    </div>
                    <div class="input-box">
                        <label for="search">Name Employee</label>
                        <InputText v-model="search" aria-describedby="search" @input="handlerSearchShiftException"
                            @keyup.delete="handlerSearchShiftException" />
                    </div>
                    <div class="input-box">
                        <Button label="Clear Filters "class="btn btn-block" icon="pi pi-times"
                            @click="clearFilters" />
                    </div>
                </div>
                <div>
                    <h2>Shift Exception Requests</h2>
                    <div class="shift-exception-card-wrapper">
                        <div v-for="(shiftException, index) in filteredShiftExceptionRequests"
                            :key="`shiftException-${shiftException.id}-${index}`">
                            <shiftExceptionInfoForm :shiftException="shiftException" :can-update="canUpdate"
                                :can-delete="canDelete" :click-on-edit="() => { onEdit(shiftException) }" 
                                :click-on-delete="() => { onDelete(shiftException) }" 
                                />
                        </div>
                    </div>

                    <div></div>
                    <Paginator v-if="first > 1" class="paginator" :first="first" :rows="rowsPerPage"
                        :totalRecords="totalRecords" @page="onPageChange" />
      
                </div>
            </div>

        </NuxtLayout>
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
</style>
