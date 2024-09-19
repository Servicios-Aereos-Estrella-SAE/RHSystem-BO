<template>
    <div>
        <Toast />
        <div class="holidays-page">
            <Head>
                <Title>
                    Holidays
                </Title>
            </Head>
            <NuxtLayout name="backoffice">
              <div class="holiday-wrapper">
                <div class="box head-page">
                   <div class="input-box">
                    <label for="search">
                      Search
                    </label>
                    <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchHoliday" @keyup.delete="handlerSearchHoliday"/>
                  </div>
                  <div class="input-box">
                    <label for="holidays">
                      Period
                    </label>
                    <Calendar
                      v-if="isReady"
                      v-model="periodSelected"
                      view="month"
                      dateFormat="mm/yy"
                      showWeek
                      @update:modelValue="handlerPeriodChange"
                    />
                  </div>
                  <div class="input-box">
                    <br/>
                    <Button class="btn-add btn-clear-filter" label="Clear period" icon="pi pi-close" severity="danger" @click="clearPeriod" >
                    </Button>
                  </div>
                  <div></div>
                  <div></div>
                  <div class="input-box">
                      <br/>
                      <Button v-if="canCreate" class="btn-add mr-2" label="New" icon="pi pi-plus" severity="primary" @click="addNew" />
                  </div>
                </div>
              <div>
                <h2>
                    Holidays
                </h2>
                <div class="holiday-card-wrapper">
                   <div v-for="(holiday, index) in filterHolidays" :key="`employee-${holiday.holidayId}-${index}`">
                    <HolidayInfoCard
                        :click-on-photo="() => { onPhoto(holiday) }"
                        :holiday="holiday"
                        :can-update="canUpdate" :can-delete="canDelete" 
                        :click-on-edit="() => { onEdit(holiday) }"
                        :click-on-delete="() => { onDelete(holiday) }"
                    />
                    </div>
                </div>
                <div></div>
                <Paginator 
                    class="paginator"
                    :first="first" 
                    :rows="rowsPerPage" 
                    :totalRecords="totalRecords" 
                    @page="onPageChange"
                    :alwaysShow="false"
                    />
                       <!-- Form Shift -->
                <div class="card flex justify-content-center">
                    <Sidebar v-model:visible="drawerHolidayForm" header="Holiday form" position="right" class="holiday-form-sidebar" :showCloseIcon="true">
                    <HolidayInfoForm
                        :holiday="holiday"
                        @save="onSave"
                    />
                    </Sidebar>
                </div>
              </div>
            </div>
            <Dialog v-model:visible="drawerHolidayDelete" :style="{width: '450px'}" header="Confirm" :modal="true">
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                    <span v-if="holiday">   Are you sure you want to delete
                    ?</span>
                </div>
                <template #footer>
                    <Button label="No" icon="pi pi-times" text @click="drawerEmployeeDelete = false"/>
                    <Button label="Yes" icon="pi pi-check" text @click="confirmDelete()" />
                </template>
            </Dialog>
            </NuxtLayout>
        </div>
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

.holiday-card-wrapper {
  display: flex;
  flex-wrap: wrap;
}

.holiday-form-sidebar {
  width: 22rem !important;
  max-width: 50rem !important;

  @media screen and (max-width: $sm) {
    width: 100% !important;
  }
}
</style>
