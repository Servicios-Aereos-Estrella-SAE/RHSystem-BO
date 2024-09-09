<template>
  <div>
    <Toast />
    <NuxtLayout name="backoffice" class="documents-page">
      <div class="document-wrapper">
        <div>
          <h2>
            Documents Expiration Matrix
          </h2>
          <!-- <div class="department-card-wrapper">
            <div v-for="(department, index) in filteredDepartments"
              :key="`department-${department.departmentId}-${index}`">
              <DepartmentInfoCard :department="department"  :click-on-edit="() => { onEdit(department) }"/>
            </div>
          </div> -->

        </div>
        <div class="head-page">
          <VueCarCarousel v-bind="settings" :breakpoints="breakpoints" >
           
            <VueCarSlide :key="0">
              <div class="carousel__item">
                <AircraftDocumentCard :aircraft="aircraft" :clickOnCard="() => { setActive('aircraft')}"></AircraftDocumentCard>
              </div>
            </VueCarSlide>
            <VueCarSlide :key="1">
              <div class="carousel__item">
                <EmployeeDocumentCard :employee="employees" :clickOnCard="() => { setActive('employees') }"></EmployeeDocumentCard>
              </div>
            </VueCarSlide>
            <VueCarSlide :key="2">
              <div class="carousel__item">
                <PilotDocumentCard :pilot="pilots" :clickOnCard="() => { setActive('pilots') }"></PilotDocumentCard>
              </div>
            </VueCarSlide>
            <VueCarSlide :key="3">
              <div class="carousel__item">
                <CustomerDocumentCard :customer="customers"  :clickOnCard="() => { setActive('customers') }"></CustomerDocumentCard>
              </div>
            </VueCarSlide>
            <!-- <VueCarSlide :key="3">
              <div class="carousel__item">
              </div>
            </VueCarSlide> -->
            <template #addons>
              <VueCarPagination />
            </template>
          </VueCarCarousel>
        </div>
        <div class="document-body-wrapper">
          <div class="document-head-title">
            <h3>{{ tabActive.charAt(0).toUpperCase() + tabActive.slice(1) }} Expirations</h3>
          </div>
          <div class="document-body-content">
            <div v-for="(document, index) in documentsSelected">
              <div v-if="tabActive === 'aircraft'">
                <AircraftDocumentExpireCard :document="document" :click-on-card="() => { alert('hello') }"></AircraftDocumentExpireCard>
              </div>
              <div v-if="tabActive === 'pilots'">
                <PilotDocumentExpireCard :document="document" :click-on-card="() => { alert('hello') }"></PilotDocumentExpireCard>
              </div>
              <div v-if="tabActive === 'employees'">
                <EmployeeDocumentExpireCard :document="document" :click-on-card="() => { alert('hello') }"></EmployeeDocumentExpireCard>
              </div>
              <div v-if="tabActive === 'customers'">
                <CustomerDocumentExpireCard :document="document" :click-on-card="() => { alert('hello') }"></CustomerDocumentExpireCard>
              </div>
            </div>
            <div v-if="documentsSelected.length === 0" class="wrapper-without-documents">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder-check" viewBox="0 0 16 16">
                  <path d="m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z"/>
                  <path d="M15.854 10.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.707 0l-1.5-1.5a.5.5 0 0 1 .707-.708l1.146 1.147 2.646-2.647a.5.5 0 0 1 .708 0"/>
                </svg>
                <span>The list does not have expiration alerts</span>
            </div>
            <!-- <div>
              <CustomerDocumentExpireCard :click-on-card="() => { alert('hello') }"></CustomerDocumentExpireCard>
            </div>
            <div>
              <EmployeeDocumentExpireCard :click-on-card="() => { alert('hello') }"></EmployeeDocumentExpireCard>
            </div>
            <div>
              <PilotDocumentExpireCard :click-on-card="() => { alert('hello') }"></PilotDocumentExpireCard>
            </div> -->
            <!-- <div>
              <CustomerDocumentExpireCard :click-on-card="() => { alert('hello') }"></CustomerDocumentExpireCard>
            </div> -->
          </div>
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
  .carousel__slide {
    justify-content: start;
  }
  .carousel__item{
    width: 97%;
  }
  @media screen and (max-width: $phone) {
    .carousel__pagination {
      justify-content: start;
      margin-left: 23.5%;
    }
    .carousel__item{
      width: 50%;
    }
  }
</style>
