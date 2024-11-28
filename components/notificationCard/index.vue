<template>
    <div class="notifications-container">
        <div class="notification-card" v-for="request in filteredNotifications" :key="request.exceptionRequestId"
            @click="redirectToModule(request.exceptionRequestId)">
            <div class="notification-header">
                <h3>{{ request.exceptionType.exceptionTypeTypeName }}</h3>
            </div>
            <div class="notification-body">
                <p><strong>Department:</strong> {{ request.employee.department.departmentName }}</p>
                <p><strong>Position:</strong> {{ request.employee.position.positionName }}</p>
                <p><strong>Employee Name:</strong> {{ request.employee.employeeFirstName }} {{ request.employee.employeeLastName }}</p>
                <p><strong>Date Requested:</strong> {{ formatDate(request.requestedDate) }}</p>
                <p><strong>Description:</strong> {{ request.exceptionRequestDescription }}</p>
                <p><strong>Status:</strong> <span :class="statusClass(request.exceptionRequestStatus)">{{ request.exceptionRequestStatus }}</span></p>
            </div>
        </div>
    </div>
</template>

<script>
  import Script from './script.ts'
  export default Script
</script>

<style lang="scss">
@import '/resources/styles/variables.scss';

.notifications-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.notification-card {
    background-color: white;
    border: 1px solid gray;
    border-radius: 0.5rem;
    padding: 1rem;
    cursor: pointer;
    transition: box-shadow 0.3s;

    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
}

.notification-header {
    font-size: 1.25rem;
    font-weight: bold;
}

.notification-body p {
    margin: 0.5rem 0;
}

.status-pending {
    color: $warning;
    font-weight: bold;
}

.status-default {
    color: black;
}
</style>