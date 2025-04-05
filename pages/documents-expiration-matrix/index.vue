<template>
  <div>
    <Toast />
    <NuxtLayout name="backoffice" class="documents-page">
      <div class="document-wrapper">
        <div class="box">
          <h2>
            Documents Expiration Matrix
          </h2>
        </div>
        <div class="documents-exp-wrapper">
          <div class="exp-type-wrapper">
            <employeeDocumentCard :clickOnCard="() => { setActive('employees') }"></employeeDocumentCard>
            <!-- <aircraftDocumentCard :clickOnCard="() => { setActive('aircraft')}"></aircraftDocumentCard> -->
            <!-- <pilotDocumentCard :clickOnCard="() => { setActive('pilots') }"></pilotDocumentCard> -->
            <!-- <customerDocumentCard :clickOnCard="() => { setActive('customers') }"></customerDocumentCard> -->
            <!-- <flightAttendantDocumentCard :clickOnCard="() => { setActive('flight-attendant') }"></flightAttendantDocumentCard> -->
          </div>

          <div class="documents-wrapper">
            <div class="document-head-title">
              <h3>
                {{ tabActive.charAt(0).toUpperCase() + tabActive.slice(1) }}
                Expiration List
              </h3>
            </div>
            <div v-if="getProceedingFiles.length > 0">
              <div v-if="tabActive === 'employees'" class="list-wrapper">
                <EmployeeDocumentExpireCard v-for="(document, index) in getProceedingFiles" :key="`expired-card-wrapper-${index}-${document?.proceedingFileId || 0}`" :document="document" />
              </div>
              <!-- <div v-if="tabActive === 'aircraft'" class="list-wrapper">
                <AircraftDocumentExpireCard v-for="(document, index) in getProceedingFiles" :key="`expired-card-wrapper-${index}-${document?.proceedingFileId || 0}`" :document="document" />
              </div> -->
              <!-- <div v-if="tabActive === 'pilots'" class="list-wrapper">
                <PilotDocumentExpireCard v-for="(document, index) in getProceedingFiles" :key="`expired-card-wrapper-${index}-${document?.proceedingFileId || 0}`" :document="document" />
              </div> -->
              <!-- <div v-if="tabActive === 'customers'" class="list-wrapper">
                <CustomerDocumentExpireCard v-for="(document, index) in getProceedingFiles" :key="`expired-card-wrapper-${index}-${document?.proceedingFileId || 0}`" :document="document" />
              </div> -->
              <!-- <div v-if="tabActive === 'flight-attendant'" class="list-wrapper">
                <flightAttendantDocumentExpireCard v-for="(document, index) in getProceedingFiles" :key="`expired-card-wrapper-${index}-${document?.proceedingFileId || 0}`" :document="document" />
              </div> -->
            </div>
            <div v-else class="empty">
              <div>
                <div class="icon">
                  <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Zm-2.146-2.354a.5.5 0 0 0-.708 0L15.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708Zm-.354 8.122V14H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0l-.007-.102A.75.75 0 0 0 9 14H4.5V7.25c0-.966.784-1.75 1.75-1.75h3.826c.081-.523.224-1.026.422-1.5H6.25A3.25 3.25 0 0 0 3 7.25v11.5A3.25 3.25 0 0 0 6.25 22h11.5A3.25 3.25 0 0 0 21 18.75v-7.56c-.444.427-.949.79-1.5 1.078Z" fill="#88a4bf" class="fill-212121"></path></svg>
                </div>
                <br>
                The list does not have expiration alerts
              </div>
            </div>

            <!-- <div class="document-body-content">
              <div v-if="getProceedingFiles.length > 0" class="expired-card-wrapper">
                <div v-for="(document, index) in getProceedingFiles" :key="`expired-card-wrapper-${index}`">
                  <div v-if="tabActive === 'aircraft'">

                  </div>
                  <div v-if="tabActive === 'pilots'">

                  </div>
                  <div v-if="tabActive === 'employees'">

                  </div>
                  <div v-if="tabActive === 'customers'">

                  </div>
                  <div v-if="tabActive === 'flight-attendant'">

                  </div>
                </div>
              </div>
              <div v-else class="wrapper-without-documents">
                <div class="info">
                  <div class="icon">
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Zm-2.146-2.354a.5.5 0 0 0-.708 0L15.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708Zm-.354 8.122V14H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0l-.007-.102A.75.75 0 0 0 9 14H4.5V7.25c0-.966.784-1.75 1.75-1.75h3.826c.081-.523.224-1.026.422-1.5H6.25A3.25 3.25 0 0 0 3 7.25v11.5A3.25 3.25 0 0 0 6.25 22h11.5A3.25 3.25 0 0 0 21 18.75v-7.56c-.444.427-.949.79-1.5 1.078Z" fill="#88a4bf" class="fill-212121"></path></svg>
                  </div>
                  <span>The list does not have expiration alerts</span>
                </div>
              </div>
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
</style>

<!-- <style lang="scss">
  @import '/resources/styles/variables.scss';

  .document-wrapper {

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
  }
</style> -->
