<template>
  <div>
    <div class="supplies-page">
      <Head>
        <Title> Supplies </Title>
      </Head>
      <NuxtLayout name="backoffice">
        <div class="shift-wrapper">
          <div class="filters">
            <div class="box head-supplies-page">
              <div class="input-search">
                <div class="input-box">
                  <label for="search">
                    {{ $t("search_supply_type") }}
                  </label>
                  <InputText
                    v-model="search"
                    :placeholder="$t('supply_type_name_or_id')"
                    @keypress.enter="handlerSearchSupplies"
                  />
                </div>
                <button class="btn btn-block" @click="handlerSearchSupplies">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                      fill="#88a4bf"
                      class="fill-212121"
                    ></path>
                  </svg>
                </button>
              </div>
              <div></div>
              <div></div>
            </div>

            <div class="buttons-group">
              <Button v-if="canCreate" class="btn" @click="addNewSupplyType">
                <svg
                  baseProfile="tiny"
                  version="1.2"
                  viewBox="0 0 24 24"
                  xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                    fill="#88a4bf"
                    class="fill-000000"
                  ></path>
                </svg>
                {{ $t("supply_type") }}
              </Button>

            </div>
          </div>

          <div>
            <h2>
              {{ $t("supply_types") }}
            </h2>
            <div
              v-if="filteredSupplyTypes.length > 0"
              class="shift-card-wrapper"
            >
              <div
                v-for="(supplyType, index) in filteredSupplyTypes"
                :key="`supply-type-${supplyType.supplyTypeId}-${index}`"
              >
                <SupplyTypeInfoCard
                  :supply-type="supplyType"
                  :can-update="canUpdate"
                  :can-delete="canDelete"
                  :click-on-edit="onEditSupplyType"
                  :click-on-delete="onDeleteSupplyType"
                  :click-on-manage="onManageSupplyType"
                />
              </div>
            </div>
            <div v-else class="empty">
              <div>
                <div class="icon">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.25 10a7.25 7.25 0 1 0-2.681 5.63l4.9 4.9.085.073a.75.75 0 0 0 .976-1.133l-4.9-4.901A7.22 7.22 0 0 0 17.25 10ZM11 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1 2a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 9Z"
                      fill="#88a4bf"
                      class="fill-212121"
                    ></path>
                  </svg>
                </div>
                <h3>{{ $t("no_supply_types_found") }}</h3>
                <p>{{ $t("no_supply_types_to_display") }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Supply Type Form Sidebar -->
        <Sidebar
          v-model:visible="drawerSupplyTypeForm"
          :header="supplyTypeFormTitle"
          position="right"
          :modal="true"
          class="supply-type-sidebar"
        >
          <div v-if="isLoadingSupplyTypeForm" class="loading-form">
            <div class="loading-content">
              <i class="pi pi-spin pi-spinner"></i>
              <p>{{ t('loading_supply_type_data') }}</p>
            </div>
          </div>
          <SupplyTypeForm
            v-else-if="selectedSupplyType"
            :supply-type="selectedSupplyType"
            :can-update="canUpdate"
            :can-delete="canDelete"
            :click-on-save="onSaveSupplyType"
            :click-on-close="onCloseSupplyTypeForm"
          />
        </Sidebar>

        <!-- Supply Management Sidebar -->
        <Sidebar
          v-model:visible="drawerSupplyManagement"
          :header="supplyManagementTitle"
          position="right"
          :modal="true"
          class="supply-management-sidebar"
        >
          <div v-if="isLoadingSupplyManagement" class="loading-form">
            <div class="loading-content">
              <i class="pi pi-spin pi-spinner"></i>
              <p>{{ t('loading_supply_management_data') }}</p>
            </div>
          </div>
          <SupplyManagement
            v-else-if="selectedSupplyType"
            :supply-type="selectedSupplyType"
            :can-create="canCreate"
            :can-update="canUpdate"
            :can-delete="canDelete"
            @save="onSaveSupply"
            @close="onCloseSupplyManagement"
          />
        </Sidebar>

        <!-- Delete Confirmation -->
        <transition name="page">
          <confirmDelete
            v-if="drawerSupplyTypeDelete"
            @confirmDelete="confirmDeleteSupplyType"
            @cancelDelete="onCancelSupplyTypeDelete"
          />
        </transition>

        <Toast />
      </NuxtLayout>
    </div>
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
