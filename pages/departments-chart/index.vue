<template>
  <div>
    <Toast />
    <Head>
      <Title>Organization Chart</Title>
    </Head>
    <NuxtLayout name='backoffice'>
      <div class="departments-control-wrapper">
        <div class="box tree-nodes">
          <Tree v-model:expandedKeys="expandedKeys" :value="nodes" :filter="true" filterMode="lenient">
            <template #default="slotProps">
              <div class="tree-node">
                <div class="tree-node-name" :class="slotProps.node.styleClass">
                  {{ slotProps.node.label }}
                </div>
                <div class="tree-node-tools">
                  <button v-if="slotProps.node.meta.node_type === 'department'" class="btn">
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#88a4bf" class="fill-212121"></path></svg>
                  </button>
                  <button class="btn">
                    <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#88a4bf" class="fill-212121"></path></svg>
                  </button>
                  <button class="btn">
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
                      {{ setNodeName(slotProps.node) }}
                    </div>
                  </div>
                </div>
              </template>
            </OrganizationChart>
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
