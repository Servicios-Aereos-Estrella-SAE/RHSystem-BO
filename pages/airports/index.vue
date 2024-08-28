<template>
    <div class="airports-page">
        <Toast />

            <Head>
                <Title>
                    Airports
                </Title>
            </Head>
            <NuxtLayout name="backoffice">
                <div class="airport-wrapper">
                    <div class="box head-page">
                        <div class="input-box">
                            <label for="search">
                                Search
                            </label>
                            <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchAirport"
                                @keyup.delete="handlerSearchAirport" />
                        </div>
                        <div class="input-box">
                            <br />
                            <Button class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary"
                                @click="addNew" />
                        </div>
                    </div>
                    <div>
                        <h2>
                            Airports
                        </h2>
                        <div class="airport-card-wrapper">
                            <div v-for="(airport, index) in filterAirports"
                                :key="`airport-${airport.airportId}-${index}`">
                                <airportInfoCard :airport="airport" :click-on-edit="() => { onEdit(airport) }"
                                    :click-on-delete="() => { onDelete(airport) }" />
                            </div>
                        </div>
                        <Paginator class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
                            @page="onPageChange" :alwaysShow="false" />
                        <!-- Form Airport -->
                        <div class="card flex justify-content-center">
                            <Sidebar v-model:visible="drawerAirportForm" header="Airport form" position="right"
                                class="airport-form-sidebar" :showCloseIcon="true">
                                <AirportInfoForm :airport="airport" @onAirportSave="onSave" />
                            </Sidebar>
                        </div>
                    </div>
                </div>
                <Dialog v-model:visible="drawerAirportDelete" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="confirmation-content">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="airport">Are you sure you want to delete?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="drawerAirportDelete = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
                    </template>
                </Dialog>
            </NuxtLayout>
    </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss" scoped>
@import './style';
</style>

<style lang="scss">
@import '/resources/styles/variables.scss';

.airport-card-wrapper {
    display: flex;
    flex-wrap: wrap;
}

.airport-form-sidebar {
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

.airport-form-sidebar {
    width: 100% !important;
    max-width: 35rem !important;
}
</style>
