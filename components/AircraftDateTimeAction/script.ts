import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AircraftDateTimeAction',
  props: {
    dateTimeLine: { type: Object, required: true }
  },
  data: () => ({
    icons: [
      {
        type: 'pernocta', icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.21 15.32A8.56 8.56 0 1 1 11.29 3.5a.5.5 0 0 1 .51.28.49.49 0 0 1-.09.57A6.46 6.46 0 0 0 9.8 9a6.57 6.57 0 0 0 9.71 5.72.52.52 0 0 1 .58.07.52.52 0 0 1 .12.53Z" fill="#fff" class="fill-464646"></path></svg>`
      },
      {
        type: 'departure',
        icon: `<svg viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M484.6 62c18-9.2 38-14 58.2-14h57.4c27 0 45.7 26.95 36.2 52.2-18.2 48.7-54.3 88.7-100.8 112L262.8 348.6c-4.5 2.2-9.4 3.4-14.4 3.4H110.7c-9.3 0-18.2-4.1-24.28-11.2l-73.08-85.2c-6.778-7.9-4.321-20.1 4.99-24.8l32.16-16c8.56-4.3 18.57-4.6 27.31-.7l57.3 25 99.5-49.4L87.64 95.2c-10.43-6.71-9.59-22.22 1.5-27.77L135 44.48c15.1-7.96 34.5-8.93 51.1-2.68L381 114.9 484.6 62zM0 480c0-17.7 14.33-32 32-32h576c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.67 0-32-14.3-32-32z" fill="#ffffff" class="fill-000000"></path></svg>`
      },
      {
        type: 'arrive',
        icon: `<svg viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="m.253 166.9-.21-98.91C.02 57.74 9.508 50.11 19.51 52.34l35.56 7.9a31.987 31.987 0 0 1 23.02 20L95.1 127.1l128.2 38.5-41.5-145.2C178.9 10.18 186.6.001 197.2.001h40.1c11.5 0 22.2 6.235 27.9 16.309l109 193.89 107.3 31.6c15.9 4.7 30.7 12.5 43.7 22.9l34.4 27.5c24.1 19.2 18.1 57.3-10.7 68.3-41.2 15.6-86.2 18-128.8 6.9l-298.4-77.6c-11.1-2.9-21.2-8.7-29.3-16.9L9.536 189.4c-5.93-6-9.265-14.1-9.283-22.5zM608 448c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.67 0-32-14.3-32-32s14.33-32 32-32h576zm-416-80c0 17.7-14.3 32-32 32s-32-14.3-32-32 14.3-32 32-32 32 14.3 32 32zm32 16c0-17.7 14.3-32 32-32s32 14.3 32 32-14.3 32-32 32-32-14.3-32-32z" fill="#ffffff" class="fill-000000"></path></svg>`
      },
      {
        type: 'flight',
        icon: `<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M186.62 464H160a16 16 0 0 1-14.57-22.6l64.46-142.25L113.1 297l-35.3 42.77C71.07 348.23 65.7 352 52 352H34.08a17.66 17.66 0 0 1-14.7-7.06c-2.38-3.21-4.72-8.65-2.44-16.41l19.82-71c.15-.53.33-1.06.53-1.58a.38.38 0 0 0 0-.15 14.82 14.82 0 0 1-.53-1.59l-19.84-71.45c-2.15-7.61.2-12.93 2.56-16.06a16.83 16.83 0 0 1 13.6-6.7H52c10.23 0 20.16 4.59 26 12l34.57 42.05 97.32-1.44-64.44-142A16 16 0 0 1 160 48h26.91a25 25 0 0 1 19.35 9.8l125.05 152 57.77-1.52c4.23-.23 15.95-.31 18.66-.31C463 208 496 225.94 496 256c0 9.46-3.78 27-29.07 38.16-14.93 6.6-34.85 9.94-59.21 9.94-2.68 0-14.37-.08-18.66-.31l-57.76-1.54-125.36 152a25 25 0 0 1-19.32 9.75Z" fill="#ffffff" class="fill-000000"></path></svg>`
      },
      {
        type: 'maintenance',
        icon: `<svg viewBox="0 0 30 30" id="Layer_1" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#FFF" stroke="#FFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path class="st8" d="M6,9.3L3.9,5.8l1.4-1.4l3.5,2.1v1.4l3.6,3.6c0,0.1,0,0.2,0,0.3L11.1,13L7.4,9.3H6z M21,17.8c-0.3,0-0.5,0-0.8,0 c0,0,0,0,0,0c-0.7,0-1.3-0.1-1.9-0.2l-2.1,2.4l4.7,5.3c1.1,1.2,3,1.3,4.1,0.1c1.2-1.2,1.1-3-0.1-4.1L21,17.8z M24.4,14 c1.6-1.6,2.1-4,1.5-6.1c-0.1-0.4-0.6-0.5-0.8-0.2l-3.5,3.5l-2.8-2.8l3.5-3.5c0.3-0.3,0.2-0.7-0.2-0.8C20,3.4,17.6,3.9,16,5.6 c-1.8,1.8-2.2,4.6-1.2,6.8l-10,8.9c-1.2,1.1-1.3,3-0.1,4.1l0,0c1.2,1.2,3,1.1,4.1-0.1l8.9-10C19.9,16.3,22.6,15.9,24.4,14z"></path></g></svg>`
      }
    ] as any[]
  }),
  computed: {
    actionDayTime() {
      const icon = this.icons.find(i => i.type === this.dateTimeLine.action)
      const actionDay = {
        type: this.dateTimeLine.action,
        title: this.dateTimeLine.actionTitle,
        subtitle: this.dateTimeLine.actionSubtitle,
        icon: icon ? icon.icon : '',
        bg: this.dateTimeLine.bgColor,
        color: this.dateTimeLine.color
      }

      return actionDay
    }
  },
  async mounted() {
  },
  methods: {
  },
})
