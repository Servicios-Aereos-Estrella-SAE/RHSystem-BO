<template>
  <div>
    <Toast />
    <Head>
      <Title>Organization Chart</Title>
    </Head>
    <NuxtLayout name='backoffice'>
      <div class="departments-control-wrapper">
        <div class="box tree-nodes">
          <div class="buttons-expand">
            <button class="btn" @click="expandAll">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 3a1 1 0 0 0 1 1h14a1 1 0 1 0 0-2H5a1 1 0 0 0-1 1Zm0 18a1 1 0 0 0 1 1h1.75a1 1 0 1 0 0-2H5a1 1 0 0 0-1 1Zm5.25 0a1 1 0 0 0 1 1h3.5a1 1 0 1 0 0-2h-3.5a1 1 0 0 0-1 1Zm7 0a1 1 0 0 0 1 1H19a1 1 0 1 0 0-2h-1.75a1 1 0 0 0-1 1Zm1.457-7.293-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L11 15.586V6a1 1 0 1 1 2 0v9.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" fill="#88a4bf" class="fill-212121"></path></svg>
              Expand All
            </button>
            <button class="btn" @click="collapseAll">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 3a1 1 0 0 1 1-1h1.75a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1Zm5.25 0a1 1 0 0 1 1-1h3.5a1 1 0 1 1 0 2h-3.5a1 1 0 0 1-1-1Zm7 0a1 1 0 0 1 1-1H19a1 1 0 1 1 0 2h-1.75a1 1 0 0 1-1-1ZM4 21a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm8.707-15.707a1 1 0 0 0-1.414 0l-5 5a1 1 0 1 0 1.414 1.414L11 8.414V18a1 1 0 1 0 2 0V8.414l3.293 3.293a1 1 0 0 0 1.414-1.414l-5-5Z" fill="#88a4bf" class="fill-212121"></path></svg>
              Collapse All
            </button>
          </div>
          <Tree v-model:expandedKeys="expandedKeys" :value="nodes" :filter="true" filterMode="lenient">
            <template #default="slotProps">
              <div class="tree-node">
                <div class="tree-node-name" :class="slotProps.node.styleClass">
                  {{ slotProps.node.label }}
                </div>
                <div class="tree-node-tools">
                  <button class="btn" @click="handlerDisplayForm(slotProps.node)">
                    <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z" fill="#88a4bf" class="fill-000000"></path></svg>
                  </button>
                  <button class="btn" @click="handlerEditNode(slotProps.node)">
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#88a4bf" class="fill-212121"></path></svg>
                  </button>
                  <button class="btn" @click="handlerDeleteNode(slotProps.node)">
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#88a4bf" class="fill-212121"></path></svg>
                  </button>
                </div>
              </div>
            </template>
          </Tree>
        </div>

        <div class='box departments-chart-page'>
          <div class='box head-orgchart-page'>
            <div>
              <h3>
                Organization Chart
              </h3>
            </div>
            <div class="buttons">
              <button class="btn" @click="exportChart">
                <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0ZM5.354 4.354a.5.5 0 1 0-.708-.708l-1.5 1.5a.5.5 0 0 0 0 .708l1.5 1.5a.5.5 0 1 0 .708-.708L4.707 6H6.75A2.25 2.25 0 0 1 9 8.25v.25a.5.5 0 0 0 1 0v-.25A3.25 3.25 0 0 0 6.75 5H4.707l.647-.646ZM15.752 7.5a.752.752 0 1 1 0 1.504.752.752 0 0 1 0-1.504ZM13 6.5a6.5 6.5 0 0 1-10 5.478v5.772c0 .627.178 1.213.485 1.71l6.939-6.813.135-.122a2.25 2.25 0 0 1 2.889.006l.128.117 6.939 6.811A3.235 3.235 0 0 0 21 17.75V6.25A3.25 3.25 0 0 0 17.75 3h-5.772A6.47 6.47 0 0 1 13 6.5Zm2.752-.5a2.252 2.252 0 1 1 0 4.504 2.252 2.252 0 0 1 0-4.504Zm-4.277 7.718.083-.071a.75.75 0 0 1 .874-.007l.093.078 6.928 6.8A3.235 3.235 0 0 1 17.75 21H6.25a3.235 3.235 0 0 1-1.703-.481l6.928-6.801Z" fill="#88a4bf" class="fill-212121"></path></svg>
                Export to PNG
              </button>
            </div>
          </div>
          <div v-if="data" class='box chart-wrapper'>
            <OrganizationChart :value='data' id="contenido">
              <template #organization='slotProps'>
                <div class="node-card">
                  <div class="node-card-item">
                    <div class="node-card-item-name">
                      {{ setNodeName(slotProps.node).clear_name }}
                    </div>
                  </div>
                </div>
              </template>
            </OrganizationChart>
          </div>
        </div>
      </div>

      <Dialog v-model:visible="visibleDialogTypeForm" modal header="" class="dialog-form-factory">
        <div class="form-factory">
          <div class="title">
            Select the correct action
          </div>
          <div class="buttons">
            <button class="btn btn-block" @click="handlerNewNode('new-department')">
              <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z" fill="#88a4bf" class="fill-000000"></path></svg>
              Add new department
            </button>
            <button class="btn btn-block" @click="handlerNewNode('new-position')">
              <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z" fill="#88a4bf" class="fill-000000"></path></svg>
              Add new position
            </button>
          </div>
        </div>
      </Dialog>

      <Sidebar v-model:visible="displayDepartmentSidebarForm" header="Department Detail" position="right" class="department-sidebar-form" :showCloseIcon="true" :dismissable="false">
        <DepartmentInfoForm :department="department" @save="onDepartmentSave" />
      </Sidebar>

      <Sidebar v-model:visible="displayPositionSidebarForm" header="New job position" position="right" class="sidebar-form-position" :showCloseIcon="true" :dismissable="false">
        <PositionInfoForm :position="position" :department="department" @saved="onPositionSaved" />
      </Sidebar>

      <transition name="page">
        <confirmDelete v-if="dialogConfirmDeleteNode" @confirmDelete="confirmDeleteNode" @cancelDelete="dialogConfirmDeleteNode = false" />
      </transition>

      <transition name="page">
        <confirmDelete v-if="drawerSoftPositionDelete" @confirmDelete="confirmSoftDeletePosition" @cancelDelete="drawerSoftPositionDelete = false" />
      </transition>

      <transition name="page">
        <confirmDelete
          v-if="drawerNodeForceDelete"
          :description="'There are department related employees. Are you sure you want to delete this department?'"
          @confirmDelete="confirmDepartmentForceDelete"
          @cancelDelete="drawerNodeForceDelete = false" />
      </transition>
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

.dialog-form-factory {
  width: 30rem;

  .p-dialog-header {
    background-color: $gray;
    justify-content: flex-end;
  }

  .p-dialog-content {
    padding-top: 1.5rem;
  }
}
</style>
