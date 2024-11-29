<template>
    <div class="notifications-container">
        <div class="notification-card" v-for="request in filteredNotifications" :key="request.exceptionRequestId"
            @click="redirectToModule(request.exceptionRequestId)">
            <div class="notification-title">
                <h3>Shift Exception Request</h3>
            </div>
            <div class="notification-header">
                <h3>{{ request.type }}</h3>
            </div>
            <div class="notification-body">
                <p><strong class="s-title">Department:</strong> {{ request.department }}</p>
                <p><strong class="s-title">Position:</strong> {{ request.position }}</p>
                <p><strong class="s-title">Employee Name:</strong> {{ request.employeeName }} </p>
                <p><strong class="s-title">Date Requested:</strong> {{ formatDate(request.dateRequested) }}</p>
                <p><strong class="s-title">Description:</strong> {{ request.description }}</p>
                <p><strong class="s-title">Status:</strong> <span :class="statusClass(request.status)">{{ request.status }}</span></p>
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
    border: 1px solid $border;
    border-radius: 0.5rem;
    padding: 1rem;
    cursor: pointer;
    transition: box-shadow 0.3s;

    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
}

.s-title{
    font-size: 0.8 rem;
    font-weight: 500;
}
.notification-header {
    font-size: 1rem;
    font-weight: 500;
}
.notification-title{
    border-bottom: 1px dashed #ccc; 
    padding-bottom: 0.3rem; 
    margin-bottom: 1rem; 
}
.p{
    font-weight: normal;
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