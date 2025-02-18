import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AircraftDateTimeAction',
  props: {
    dateTimeLine: { type: Object, required: true }
  },
  data: () => ({
    icons: [
      {
        type: 'pernocta', icon: `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.21 15.32A8.56 8.56 0 1 1 11.29 3.5a.5.5 0 0 1 .51.28.49.49 0 0 1-.09.57A6.46 6.46 0 0 0 9.8 9a6.57 6.57 0 0 0 9.71 5.72.52.52 0 0 1 .58.07.52.52 0 0 1 .12.53Z" fill="#fff" class="fill-464646"></path></svg>` },
      {
        type: 'departure',
        icon: `<svg data-name="Layer 2" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M31.31 8c-.68-1.69-3.46-2.25-6.53-1.3a36.45 36.45 0 0 0-5.57 2.67L7.47 4.65a6 6 0 0 0-4.83.79L2 5.86a1 1 0 0 0 .06 1.71l9.81 5.89C10.32 14.31 9 15 7.93 15.7l-2.57-1.36a3.46 3.46 0 0 0-3.18 0L1 14.9a1 1 0 0 0 0 1.6l4.08 3.15a4.09 4.09 0 0 0 3.42.75 77.75 77.75 0 0 0 17.89-7.23c3.88-2.39 5.48-3.81 4.92-5.17Zm-5.73 19h-18a1.5 1.5 0 1 0 0 3h18a1.5 1.5 0 0 0 0-3Z" fill="#fff" class="fill-231f20"></path></svg>`
      },
      {
        type: 'arrive',
        icon: `<svg data-name="Layer 2" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M26.19 16.41a36.45 36.45 0 0 0-6-1.41L14 4a6 6 0 0 0-4.3-2.42l-.77-.07a1 1 0 0 0-1 1.37l4 10.73c-1.74-.31-3.2-.59-4.48-.72l-1.21-2.67a3.46 3.46 0 0 0-2.46-2l-1.3-.28a1 1 0 0 0-1 1.23l1.21 5a4.09 4.09 0 0 0 2.19 2.73 77.74 77.74 0 0 0 18.48 5.56c4.54.59 6.68.48 7.11-.95.53-1.75-1.29-3.93-4.28-5.1ZM26.25 27h-18a1.5 1.5 0 1 0 0 3h18a1.5 1.5 0 0 0 0-3Z" fill="#ffffff" class="fill-231f20"></path></svg>`
      },
      {
        type: 'flight',
        icon: `<svg fill="none" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m452.196 277.095-146.12-100.66 4.66-94.19a53.509 53.509 0 1 0-106.9-.42l3.93 94.32-147.25 101.44a40.475 40.475 0 0 0-12.09 53.58 13.483 13.483 0 0 0 14.5 6.45l150.24-32 6.31 151.63a20.307 20.307 0 0 0-4.25 2.07l-24.26 15.69a5.997 5.997 0 0 0-2.613 6.81 6.002 6.002 0 0 0 5.893 4.3h124.61a6.006 6.006 0 0 0 5.471-3.426 5.994 5.994 0 0 0-.801-6.404c-.41-.506-.9-.942-1.45-1.29l-25-15.79a19.794 19.794 0 0 0-4.89-2.23l7.52-151.88 150.08 32a13.487 13.487 0 0 0 14.5-6.45 40.478 40.478 0 0 0-12.09-53.55Zm-169.18-182h-51a10.512 10.512 0 0 1-10.5-10.5 31.501 31.501 0 0 1 31.5-31.5h9a31.502 31.502 0 0 1 31.5 31.5 10.51 10.51 0 0 1-10.5 10.5Z" fill="#ffffff" class="fill-000000"></path></svg>`
      },
    ] as any[]
  }),
  computed: {
    actionDayTime () {
      const icon = this.icons.find(i => i.type === this.dateTimeLine.action)
      const actionDay = {
        type: this.dateTimeLine.action,
        title: this.dateTimeLine.actionTitle,
        subtitle: this.dateTimeLine.actionSubtitle,
        icon: icon ? icon.icon : ''
      }
      
      return actionDay
    }
  },
  async mounted() {
  },
  methods: {
  },
})