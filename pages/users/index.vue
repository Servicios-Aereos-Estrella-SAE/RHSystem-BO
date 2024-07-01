<template>
  <div class="user-page">
    <Head>
      <Title>
        Users
      </Title>
    </Head>
    <NuxtLayout name="backoffice">
      <div class="user-wrapper">
        <div class="box head-page">
          <div class="input-box">
            <label for="rol">
              Rol
            </label>
            <Dropdown
              id="rol"
              v-model="rolSelected"
              optionLabel="label"
              filter
              :options="rolCollection"
              :highlightOnSelect="false"
              @change="handlerRolSelect"
            />
          </div>
          <div></div>
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

<style lang="scss">
:deep(.graph-label) {
  color: red;
}

.graph-label {
  color: red;
}
</style>