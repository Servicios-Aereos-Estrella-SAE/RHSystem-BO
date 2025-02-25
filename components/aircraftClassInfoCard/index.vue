<template>
  <div class="box aircraft-class-info-card">
    <div class="image-aircraft">
      <img alt="aircraft header" :src="aircraftClass.aircraftClassBanner" />
    </div>
    <div class="aircraft-class-name">
      {{ `Aircraft Class: ${aircraftClass.aircraftClassName}` }}
    </div>
    <div class="aircraft-class-short-description">
      {{ truncateText(`Description: ${aircraftClass.aircraftClassShortDescription}`, 182) }}
    </div>

    <div class="box-tools-footer" v-if="showEditButton">
      <Button v-if="canUpdate" icon="pi pi-pencil" class="box-btn" @click="handlerClickOnEdit()" />
      <Button v-if="canDelete" icon="pi pi-trash" class="box-btn btn-red" @click="handlerClickOnDelete()" />
    </div>
  </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
@import '/resources/styles/variables.scss';

.aircraft-class-info-card {
  position: relative;

  .aircraft-class-name {
    text-align: left;
    font-weight: 500;
    box-sizing: border-box;
    padding: 1rem 3px;
  }

  .image-aircraft {
    width: 100%;
    height: 150px;
    overflow: hidden;
    border-radius: 0.5rem;
    margin-bottom: 1rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.5rem;
    }
  }

  .aircraft-class-short-description {
    text-align: left;
    font-weight: 400;
    border-radius: calc($radius / 2);
    box-sizing: border-box;
    padding: 3px;
  }

  .box-btn {
    padding: 1rem;
    box-sizing: border-box;
    border-radius: 0.375rem;
    border: none;
    background-color: white;
    color: #303e67;
    font-size: 0.7rem;
    cursor: pointer;
    transition: all 0.4s;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    border: 1px solid #e3ebf6;
    text-decoration: none;
  }

  .btn-red {
    color: red;
  }

  .box-tools-footer {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;

    button {
      width: 100%;
    }
  }
}
</style>
