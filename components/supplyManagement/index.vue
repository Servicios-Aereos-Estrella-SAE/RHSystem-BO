<template>
  <div class="supply-management">
    <div class="management-header">
      <div class="header-info">
        <h2 v-if="supplyType" class="management-title">
          {{ supplyType.supplyTypeName }}
        </h2>
        <p v-if="supplyType" class="management-description">
          {{ supplyType.supplyTypeDescription }}
        </p>
      </div>
      <div class="header-actions">
        <Button
          v-if="supplyType && canCreate"
          :label="t('add_supply')"
          icon="pi pi-plus"
          class="p-button-success"
          @click="addNewSupply"
        />
        <Button
          v-if="supplyType"
          :label="t('manage_characteristics')"
          icon="pi pi-cog"
          class="p-button-secondary"
          @click="showCharacteristicsManagement"
        />
      </div>
    </div>

    <div class="management-tabs">
      <TabView>
        <TabPanel v-if="supplyType" :header="t('supplies')">
          <div class="supplies-section">
            <div class="supplies-filters">
              <div class="filter-row">
                <div class="filter-group">
                  <label class="filter-label">{{ t("search") }}</label>
                  <InputText
                    v-model="supplySearch"
                    :placeholder="t('search_supplies')"
                    class="search-input"
                    @input="handlerSearchSupplies"
                  />
                </div>
                <div class="filter-group">
                  <label class="filter-label">{{ t("status") }}</label>
                  <Dropdown
                    v-model="selectedSupplyStatus"
                    :options="supplyStatusOptions"
                    option-label="label"
                    option-value="value"
                    :placeholder="t('select_status')"
                    class="filter-dropdown"
                    @change="handlerSearchSupplies"
                  />
                </div>
                <div class="filter-group">
                  <Button
                    :label="t('clear_filters')"
                    icon="pi pi-filter-slash"
                    class="p-button-outlined"
                    @click="clearSupplyFilters"
                  />
                </div>
              </div>
            </div>

            <!-- Loading State for Supplies -->
            <div
              v-if="isLoadingSupplies || isInitialLoad"
              class="loading-state"
            >
              <i class="pi pi-spin pi-spinner"></i>
              <p>{{ t("loading_supplies") }}</p>
            </div>

            <!-- Supplies Grid -->
            <div
              v-else-if="!isLoadingSupplies && !isInitialLoad"
              class="supplies-grid"
            >
              <div
                v-for="supply in filteredSupplies"
                :key="supply.supplyId"
                class="supply-card"
              >
                <SupplyCard
                  :supply="supply"
                  :can-update="canUpdate"
                  :can-delete="canDelete"
                  :click-on-edit="onEditSupply"
                  :click-on-delete="onDeleteSupply"
                  :click-on-assign="onAssignSupply"
                />
              </div>
            </div>

            <!-- Empty State for Supplies -->
            <div
              v-if="
                !isLoadingSupplies &&
                !isInitialLoad &&
                filteredSupplies.length === 0
              "
              class="empty-state"
            >
              <i class="pi pi-box empty-icon"></i>
              <h3>{{ t("no_supplies_found") }}</h3>
              <p>{{ t("no_supplies_found_description") }}</p>
              <Button
                v-if="canCreate"
                :label="t('add_first_supply')"
                icon="pi pi-plus"
                class="p-button-primary"
                @click="addNewSupply"
              />
            </div>
          </div>
        </TabPanel>

        <TabPanel v-if="supplyType" :header="t('assignments')">
          <div class="assignments-section">
            <div class="assignments-filters">
              <div class="filter-row">
                <div class="filter-group">
                  <label class="filter-label">{{
                    t("search_employees")
                  }}</label>
                  <InputText
                    v-model="employeeSearch"
                    :placeholder="t('search_employees')"
                    class="search-input"
                    @input="handlerSearchAssignments"
                  />
                </div>
                <div class="filter-group">
                  <label class="filter-label">{{
                    t("assignment_status")
                  }}</label>
                  <Dropdown
                    v-model="selectedAssignmentStatus"
                    :options="assignmentStatusOptions"
                    option-label="label"
                    option-value="value"
                    :placeholder="t('select_assignment_status')"
                    class="filter-dropdown"
                    @change="handlerSearchAssignments"
                  />
                </div>
                <div class="filter-group">
                  <Button
                    :label="t('clear_filters')"
                    icon="pi pi-filter-slash"
                    class="p-button-outlined"
                    @click="clearAssignmentFilters"
                  />
                </div>
              </div>
            </div>

            <!-- Loading State for Assignments -->
            <div
              v-if="isLoadingAssignments || isInitialLoad"
              class="loading-state"
            >
              <i class="pi pi-spin pi-spinner"></i>
              <p>{{ t("loading_assignments") }}</p>
            </div>

            <!-- Assignments List -->
            <div
              v-else-if="!isLoadingAssignments && !isInitialLoad"
              class="assignments-list"
            >
              <div
                v-for="assignment in filteredAssignments"
                :key="assignment.employeeSupplyId"
                class="assignment-item"
              >
                <AssignmentCard
                  :assignment="assignment"
                  :can-update="canUpdate"
                  :can-delete="canDelete"
                  :click-on-edit="onEditAssignment"
                  :click-on-delete="onDeleteAssignment"
                />
              </div>
            </div>

            <!-- Empty State for Assignments -->
            <div
              v-if="
                !isLoadingAssignments &&
                !isInitialLoad &&
                filteredAssignments.length === 0
              "
              class="empty-state"
            >
              <i class="pi pi-users empty-icon"></i>
              <h3>{{ t("no_assignments_found") }}</h3>
              <p>{{ t("no_assignments_found_description") }}</p>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>

    <!-- Supply Form Sidebar -->
    <Sidebar
      v-if="supplyType"
      v-model:visible="drawerSupplyForm"
      :header="supplyFormTitle"
      position="right"
      :modal="true"
      class="supply-sidebar"
    >
      <SupplyForm
        v-if="selectedSupply"
        :supply="selectedSupply"
        :supply-type-id="supplyType.supplyTypeId"
        :can-update="canUpdate"
        :can-delete="canDelete"
        @save="onSaveSupply"
        @close="onCloseSupplyForm"
      />
    </Sidebar>

    <!-- Assignment Form Sidebar -->
    <Sidebar
      v-if="supplyType"
      v-model:visible="drawerAssignmentForm"
      :header="assignmentFormTitle"
      position="right"
      :modal="true"
      class="assignment-sidebar"
    >
      <AssignmentForm
        v-if="selectedAssignment || selectedSupply"
        :assignment="selectedAssignment"
        :supply-id="selectedSupply?.supplyId"
        :supply-type-id="supplyType.supplyTypeId"
        :can-update="canUpdate"
        :can-delete="canDelete"
        @save="onSaveAssignment"
        @close="onCloseAssignmentForm"
      />
    </Sidebar>

    <!-- Characteristics Management Sidebar -->
    <Sidebar
      v-if="supplyType"
      v-model:visible="drawerCharacteristicsManagement"
      :header="t('manage_characteristics')"
      position="right"
      :modal="true"
      class="characteristics-sidebar"
    >
      <CharacteristicsManagement
        :supply-type="supplyType"
        :can-create="canCreate"
        :can-update="canUpdate"
        :can-delete="canDelete"
        @save="onSaveCharacteristic"
        @close="onCloseCharacteristicsManagement"
      />
    </Sidebar>

    <Toast />
  </div>

  <!-- Confirm Delete Supply -->
  <div v-if="showConfirmDeleteSupply" class="confirm-delete-overlay">
    <ConfirmDelete
      :description="supplyToDelete ? `${t('delete_supply')}: ${supplyToDelete.supplyName}` : ''"
      @confirmDelete="confirmDeleteSupply"
      @cancelDelete="cancelDeleteSupply"
    />
  </div>

  <!-- Confirm Delete Assignment -->
  <div v-if="showConfirmDeleteAssignment" class="confirm-delete-overlay">
    <ConfirmDelete
      :description="assignmentToDelete ? `${t('delete_assignment')}: ${assignmentToDelete.employee?.person?.personName || ''}` : ''"
      @confirmDelete="confirmDeleteAssignment"
      @cancelDelete="cancelDeleteAssignment"
    />
  </div>
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
