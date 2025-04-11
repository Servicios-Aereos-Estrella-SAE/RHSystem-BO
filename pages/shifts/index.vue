<template>
  <div class="shift-page">

    <Head>
      <Title>
        Shifts
      </Title>
    </Head>

    <NuxtLayout name="backoffice">
      <div class="shift-wrapper">
        <div class="box head-page">
          <div class="input-search">
            <div class="input-box">
              <label for="search">
                Search
              </label>
              <InputText v-model="search" aria-describedby="search" @keypress="handlerSearchShift" @keyup.delete="handlerSearchShift" />
            </div>
            <button class="btn btn-block" @click="handlerSearchShift">
              <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="#88a4bf" class="fill-212121"></path></svg>
            </button>
          </div>
          <div class="input-box">
            <button v-if="canCreate" class="btn" @click="addNew">
              <svg baseProfile="tiny" version="1.2" viewBox="0 0 24 24" xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 10h-4V6a2 2 0 0 0-4 0l.071 4H6a2 2 0 0 0 0 4l4.071-.071L10 18a2 2 0 0 0 4 0v-4.071L18 14a2 2 0 0 0 0-4z"
                  fill="#88a4bf" class="fill-000000"></path>
              </svg>
              Create Shift
            </button>
          </div>
        </div>
        <div>
          <h2>
            Shifts
          </h2>

          <div class="shifts-wrapper">
            <div v-for="(group, index) in groupShifts" :key="`shift-group-${group.category}-${index}`" class="group-category">
              <div class="group-name">
                {{ group.category }}
              </div>
              <div class="shift-cards-wrapper">
                <ShiftInfoCard
                  v-for="(shift, index) in group.shifts" :key="`shift-${group.category}-${index}`"
                  :shift="shift"
                  :can-update="canUpdate" :can-delete="canDelete"
                  :click-on-edit="() => { onEdit(shift) }"
                  :click-on-delete="() => { onDelete(shift) }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </NuxtLayout>

    <transition name="page">
      <confirmDelete
        v-if="drawerShiftDelete"
        @confirmDelete="confirmDelete"
        @cancelDelete="drawerShiftDelete = false"
      />
    </transition>

    <Sidebar v-model:visible="drawerShiftForm" header="Shift form" position="right" class="shift-form-sidebar" :showCloseIcon="true">
      <shiftInfoForm :shift="shift" @onShiftSave="onSave" />
    </Sidebar>
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

  .shift-form-sidebar {
    width: 100% !important;
    max-width: 25rem !important;

    @media screen and (max-width: $sm) {
      width: 100% !important;
    }
  }
</style>
