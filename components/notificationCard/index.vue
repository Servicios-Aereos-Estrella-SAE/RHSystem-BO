<template>
    <div class="notifications-container">
        <div v-if="filteredNotifications.length > 0">
            <div class="notification-card" v-for="request in filteredNotifications" :key="request.exceptionRequestId" @click="redirectToModule(request.exceptionRequestId)">
                <div class="notification-title">
                    <h3 class="h-text">Shift Exception Request</h3>
                </div>
                <div class="notification-header">
                    <h3 class="h-text">{{ request.type }}</h3>
                </div>
                <div class="notification-body">
                    <p class="p-text"><strong class="s-title">Department:</strong> {{ request.department }}</p>
                    <p class="p-text"><strong class="s-title">Position:</strong> {{ request.position }}</p>
                    <p class="p-text"><strong class="s-title">Employee Name:</strong> {{ request.employeeName }} </p>
                    <p class="p-text"><strong class="s-title">Date Requested:</strong> {{ formatDate(request.dateRequested) }}</p>
                    <p class="p-text"><strong class="s-title">Description:</strong> {{ request.description }}</p>
                    <p class="p-text"><strong class="s-title">Status:</strong> <span :class="statusClass(request.status)">{{ request.status }}</span></p>
                </div>
            </div>
        </div>
        <div v-else>
            <br>
            <div class="empty">
                <div>
                    <div class="icon">
                        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.212 2.237a.75.75 0 0 0-1.423-.474l-.75 2.249a.75.75 0 0 0 1.423.474l.75-2.249Zm4.568-.017a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06l2.5-2.5a.75.75 0 0 1 1.06 0Zm-8.91 1.52a2.325 2.325 0 0 0-3.794.578l-5.898 12.24a1.8 1.8 0 0 0 .387 2.092l1.439 1.357a1.8 1.8 0 0 0 1.964.336l1.417-.628a4 4 0 0 0 7.314-3.24l3.42-1.516a2.325 2.325 0 0 0 .758-3.712L12.87 3.74Zm1.457 13.342a2.5 2.5 0 0 1-4.569 2.024l4.569-2.024ZM19 8.25a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75Z" fill="#88a4bf" class="fill-212121"></path></svg>
                    </div>
                    <div class="label">
                        You don't have any pending notifications yet
                    </div>
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
.h-text{
    font-size: 1rem;
}
.s-title{
    font-weight: 500;
}
.notification-header {
    font-size: 1rem;
    font-weight: 500;
}
.notification-title{
    border-bottom: 1px dashed #ccc; 
    padding-bottom: 0.1rem; 
    margin-bottom: 0.8rem; 
}
.p-text{
    font-weight: normal;
    font-size: 0.8rem;

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