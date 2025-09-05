<template>
  <div>

    <div class="customers-page">

      <Head>
        <Title>
          {{ $t('customers') }}
        </Title>
      </Head>
      <NuxtLayout name="backoffice">
        <div class="customer-wrapper">
          <div class="box head-page">
            <div class="input-box">
              <label for="search">
                {{ $t('search') }}
              </label>
              <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchCustomer"
                @keyup.delete="handlerSearchCustomer" />
            </div>
            <div class="input-box">
              <br />
              <Button v-if="canCreate" class="btn-add mr-2" :label="`${$t('add')} ${$t('customer')}`" icon="pi pi-plus"
                severity="primary" @click="addNew" />
            </div>
          </div>
          <div>
            <h2>
              {{ $t('customers') }}
            </h2>
            <div class="customer-card-wrapper">
              <div v-for="(customer, index) in filteredCustomers" :key="`customer-${customer.customerId}-${index}`">
                <CustomerInfoCard :click-on-photo="() => { onPhoto(customer) }" :customer="customer"
                  :click-on-edit="() => { onEdit(customer) }" :click-on-delete="() => { onDelete(customer) }"
                  :can-update="canUpdate" :can-delete="canDelete" />
              </div>
            </div>
            <div></div>
            <Paginator class="paginator" :first="first" :rows="rowsPerPage" :totalRecords="totalRecords"
              @page="onPageChange" />
            <!-- Form Shift -->
            <div class="card flex justify-content-center">
              <Sidebar v-model:visible="drawerCustomerForm" :header="`${$t('customer')} ${$t('form')}`" position="right"
                class="customer-form-sidebar" :showCloseIcon="true">
                <customerInfoForm :customer="customer" @save="onSave" />
              </Sidebar>
            </div>
          </div>
        </div>
        <Dialog v-model:visible="drawerCustomerDelete" :style="{width: '450px'}" :header="$t('confirm')" :modal="true">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span v-if="customer"> {{ $t('are_you_sure_you_want_to_delete') }}</span>
          </div>
          <template #footer>
            <Button :label="$t('no')" icon="pi pi-times" text @click="drawerCustomerDelete = false" />
            <Button :label="$t('yes')" icon="pi pi-check" text @click="confirmDelete()" />
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

  .customer-form-sidebar {
    width: 100% !important;
    max-width: 50rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>