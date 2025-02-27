<template>
  <div 
    class="aircraft-datetime-action" 
    :class="actionDayTime.type"
    :style="{
      '--action-bg-color': actionDayTime.bg,
      '--action-text-color': actionDayTime.color
    }">
    <div class="times">
      <div class="time">
        <div class="time-label">
          {{ dateTimeLine.hourLabel }}
        </div>
      </div>
    </div>

    <div class="datetime-actions">
      <div class="time-action">
        <div class="icon" v-html="actionDayTime.icon" :class="{ inactive: !(actionDayTime.title) }"></div>
        <div class="info">
          <div class="title">
            {{ actionDayTime.title }}
          </div>
          <div class="subtitle">
            {{ actionDayTime.subtitle }}
          </div>
        </div>
      </div>
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