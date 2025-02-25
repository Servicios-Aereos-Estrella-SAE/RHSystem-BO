<template>
  <div class="box aircraft-info-card">
    <div class="banner">
      <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.989 11.946a1.991 1.991 0 0 1-2.05 1.99l-4.738-.139-3.454 7.143c-.277.574-.86.94-1.498.94a.926.926 0 0 1-.919-1.037l.862-7.193-3.765-.11-.49 1.341a1.29 1.29 0 0 1-1.211.847.901.901 0 0 1-.901-.902V13.35l-.81-.169a1.261 1.261 0 0 1 0-2.469l.81-.168V9.066c0-.46.343-.838.788-.894l.113-.007a1.29 1.29 0 0 1 1.21.846l.492 1.34 3.751-.11-.849-7.084a.93.93 0 0 1-.005-.055l-.002-.055c0-.511.415-.926.926-.926.585 0 1.123.307 1.423.8l.075.14 3.403 7.035 4.79-.14a1.991 1.991 0 0 1 2.048 1.932l.001.058Z" fill="#88a4bf" class="fill-212121"></path></svg>
    </div>

    <div class="tail">
      {{ aircraft.aircraftRegistrationNumber }}
    </div>

    <div class="prop-value">
      <span class="prop">
        Serial Number
      </span>
      <span class="value">
        {{ aircraft.aircraftSerialNumber }}
      </span>
    </div>

    <div class="prop-value">
      <span class="prop">
        Status
      </span>
      <span class="value" :class="{ active: aircraft.aircraftActive === 1 }">
        {{ `${aircraft.aircraftActive === 1 ? 'Active' : 'Inactive'}` }}
      </span>
    </div>

    <div class="box-tools-footer">
      <Button v-if="canUpdate" class="btn btn-block" @click="handlerClickOnEdit">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z" fill="#88a4bf" class="fill-212121 fill-303e67"></path></svg>
      </Button>

      <Button v-if="canUpdate" id="btn-procceding-files" class="btn" @click="handlerOpenProceedingFiles">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 6.25A2.25 2.25 0 0 1 4.25 4h3.956a2.25 2.25 0 0 1 1.438.52l2.381 1.98h5.725A2.25 2.25 0 0 1 20 8.75v.752H6.422a2.25 2.25 0 0 0-2.183 1.705l-1.923 7.7c.043-.171 0 .005 0 0a2.24 2.24 0 0 1-.32-1.158L2 6.25Z" fill="#88a4bf" class="fill-212121"></path><path d="M3.745 19.379A.5.5 0 0 0 4.23 20h14.24a1.75 1.75 0 0 0 1.698-1.326l1.763-7.05a.5.5 0 0 0-.485-.622H6.422a.75.75 0 0 0-.728.568L3.745 19.38Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>

      <Button v-if="canDelete" class="btn btn-block" @click="handlerClickOnDelete">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z" fill="#88a4bf" class="fill-212121 fill-303e67"></path></svg>
      </Button>
    </div>
    <div class="box-tools-footer">
      <Button v-if="canUpdate" class="btn btn-block" @click="handlerClickOnGallery">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4.507 6.008A3.243 3.243 0 0 0 3 8.75v6.5c0 2.9 2.35 5.25 5.25 5.25h6.5a3.247 3.247 0 0 0 2.744-1.508l-.122.006-.122.002h-9a3.75 3.75 0 0 1-3.75-3.75v-9c0-.081.002-.162.007-.242Zm8.064 6.141-.094.078-5.394 5.313c.487.292 1.058.46 1.667.46h8.5c.621 0 1.201-.174 1.695-.476l-5.417-5.299-.084-.07a.75.75 0 0 0-.772-.067l-.101.061ZM8.75 3A3.25 3.25 0 0 0 5.5 6.25v8.5c0 .642.186 1.24.507 1.744l5.418-5.336.128-.117a2.25 2.25 0 0 1 2.888-.01l.136.122 5.433 5.314c.31-.498.49-1.086.49-1.717v-8.5A3.25 3.25 0 0 0 17.25 3h-8.5Zm.75 2.751a1.25 1.25 0 1 1 0 2.499 1.25 1.25 0 0 1 0-2.499Z" fill="#88a4bf" class="fill-212121"></path></svg>
      </Button>
      <Button v-if="canUpdate" id="btn-procceding-files" class="btn" @click="$emit('openMaintenance', aircraft)">
        <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="rgb(136, 164, 191)" stroke="rgb(136, 164, 191)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>maintenance-warning-filled</title> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="maintenance-warning/maintenance-warning" fill="rgb(136, 164, 191)" transform="translate(42.666667, 42.666667)"> <path d="M213.333333,7.10542736e-15 C330.959705,7.10542736e-15 426.666667,95.7069604 426.666667,213.333333 C426.666667,330.959705 330.959705,426.666667 213.333333,426.666667 C95.7069604,426.666667 7.10542736e-15,330.959705 7.10542736e-15,213.333333 C7.10542736e-15,95.7069604 95.7069604,7.10542736e-15 213.333333,7.10542736e-15 Z M214.247352,115.448129 C194.012816,100.058863 167.562553,94.7513198 148.606327,99.0378728 L148.606327,99.0378728 L181.426839,131.858386 L165.016583,164.678898 L132.19607,181.089155 L99.3755574,148.268642 C95.0886432,167.225458 100.396892,193.674631 115.785814,213.909668 C136.767529,230.046951 162.579882,235.491139 181.426839,230.319924 L181.426839,230.319924 L256.295918,301.394157 C270.493513,313.921446 284.691108,313.086294 298.888703,298.888699 C313.973648,283.803754 313.973648,268.71881 298.888703,253.633865 C252.755616,208.371626 230.011918,184.190056 230.657609,181.089155 C235.828347,162.243841 230.38415,136.430834 214.247352,115.448129 Z" id="Combined-Shape"> </path> </g> </g> </g></svg>
      </Button>
    </div>
  </div>
</template>

<script>
import Script from './script.ts'
export default Script
</script>

<style lang="scss">
  @import './style.scss';
</style>