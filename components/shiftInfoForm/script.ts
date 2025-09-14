import { DateTime } from "luxon"
import type { ShiftInterface } from "~/resources/scripts/interfaces/ShiftInterface"
import ShiftService from "~/resources/scripts/services/ShiftService"

export default defineComponent({

  name: 'ShiftInfoForm',
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  props: {
    shift: { type: Object as PropType<ShiftInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    submitted: false,
    selectedCities: '',
    daysOfWeeks: [
      { name: 'Monday', value: 1 },
      { name: 'Tuesday', value: 2 },
      { name: 'Wednesday', value: 3 },
      { name: 'Thursday', value: 4 },
      { name: 'Friday', value: 5 },
      { name: 'Saturday', value: 6 },
      { name: 'Sunday', value: 7 },
    ],
    flags: [
      { label: 'Estándar', value: 'estandar' },
      { label: 'Descanso (NA)', value: 'NA' },
      { label: '12x36', value: '12x36' },
      { label: '24x24', value: '24x24' },
      { label: '24x48', value: '24x48' },
      { label: 'Doble 12x48', value: 'doble-12x48' },
    ],
    timeToStart: new Date() as Date,
    timeToEnd: new Date() as Date | null,
    selectedRestDays: [] as any[],
    temporalActiveMinutes: 0 as number,
    shiftActiveHours: 0 as number
  }),
  computed: {
    formTitle() {
      const title = this.shift && this.shift.shiftId ? this.t('update_shift') : this.t('create_shift')
      return title
    },
    shiftName() {
      const name = this.shift && this.shift.shiftId ? this.shift.shiftName : ''
      return name
    },
    getDays() {
      return this.daysOfWeeks.map(day => ({
        ...day,
        name: this.$t(day.name.toLowerCase())
      }))
    }
  },
  watch: {
    selectedRestDays(newValue) {
      const restDaysString = newValue.map((day: { value: any }) => day.value).join(',')
      this.shift.shiftRestDays = restDaysString
    },
    timeToStart(val) {
      const time = DateTime.fromJSDate(val).toFormat('HH:mm')
      this.shift.shiftTimeStart = time
      this.setEndTime()
    },
    shiftActiveHours() {
      this.shift.shiftActiveHours = this.shiftActiveHours + ((this.temporalActiveMinutes || 0) / 60)
      this.setEndTime()
    },
    temporalActiveMinutes() {
      this.shift.shiftActiveHours = this.shiftActiveHours + ((this.temporalActiveMinutes || 0) / 60)
      this.setEndTime()
    }
  },
  mounted() {
    this.shift.shiftDayStart = null

    this.setInitialFlag()

    if (this.shift.shiftId) {
      const year = DateTime.now().year
      const month = DateTime.now().month
      const day = DateTime.now().day
      const hour = this.shift.shiftTimeStart.split(':')[0]
      const minutes = this.shift.shiftTimeStart.split(':')[1]
      const dateTimeStart = DateTime.fromObject({ year, month, day, hour: parseInt(hour), minute: parseInt(minutes) })
      this.timeToStart = dateTimeStart.toJSDate()
    }

    if (this.shift.shiftRestDays) {
      const restDayValues = this.shift.shiftRestDays.split(',').map(Number)
      this.selectedRestDays = this.daysOfWeeks.filter(day => restDayValues.includes(day.value))
    }

    const completeTime = this.shift.shiftActiveHours
    this.shiftActiveHours = Math.floor(completeTime)
    this.temporalActiveMinutes = (completeTime - this.shiftActiveHours) * 60
  },
  methods: {
    async onSave() {
      this.submitted = true

      if (!(this.shift.shiftAccumulatedFault > 0)) {
        return
      }

      this.shift.shiftActiveHours = this.shiftActiveHours + ((this.temporalActiveMinutes || 0) / 60)

      if (this.shift && this.shift.shiftTimeStart && this.shift.shiftActiveHours && this.timeToEnd) {
        const timeStart = DateTime.fromJSDate(this.timeToStart).toFormat('HH:mm')
        const timeEnd = DateTime.fromJSDate(this.timeToEnd).toFormat('HH:mm')
        const restDays: string[] = []

        if (this.shift.shiftRestDays) {
          this.shift.shiftRestDays.split(',').forEach((numDay: string) => {
            const day = this.daysOfWeeks.find(dw => dw.value === parseInt(numDay))
            if (day) {
              restDays.push(day.name.slice(0, 3))
            }
          })
        }

        if (this.shift.shiftCalculateFlag !== 'estandar') {
          this.shift.shiftRestDays = ''
        }

        this.shift.shiftCalculateFlag = (this.shift.shiftCalculateFlag === 'estandar' || this.shift.shiftCalculateFlag === 'NA') ? '' : this.shift.shiftCalculateFlag

        let rest = this.shift.shiftCalculateFlag ? this.shift.shiftCalculateFlag : restDays.map(day => day).join(',')
        rest = rest ? rest : 'NA'

        this.shift.shiftName = `${timeStart} to ${timeEnd} - Rest (${rest})`
        this.shift.shiftRestDays = this.shift.shiftRestDays.length === 0 ? '0' : this.shift.shiftRestDays

        if (this.shift.shiftRestDays.includes(this.shift.shiftDayStart)) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: this.t('start_day_cannot_be_a_rest_day'),
            life: 5000
          })
          return
        }

        const shiftService = new ShiftService()
        const response = this.shift.shiftId ? await shiftService.update(this.shift) : await shiftService.create(this.shift)

        if (response.status === 200 || response.status === 201) {
          this.$toast.add({
            severity: 'success',
            summary: this.t('success'),
            detail: this.t('shift_saved_successfully'),
            life: 5000
          })
          const shift = response._data.data
          this.$emit('onShiftSave', shift as ShiftInterface)
          this.$emit('save-success')
        } else {
          const msgError = response._data.error ? response._data.error : response._data.message
          const severityType = response.status === 500 ? 'error' : 'warn'
          this.$toast.add({
            severity: severityType,
            summary: `${this.t('shift')} ${this.shift.shiftId ? this.t('updated') : this.t('created')}`,
            detail: msgError,
            life: 5000,
          })
          this.$emit('save-error')
        }
      }
    },
    updateRestDays() {
      this.shift.shiftRestDays = this.selectedRestDays.join(',')
    },
    setInitialFlag() {
      if (!this.shift.shiftId) {
        this.shift.shiftCalculateFlag = 'estandar'
        return
      }

      if (this.shift.shiftId && !this.shift.shiftCalculateFlag && this.shift.shiftRestDays === '0') {
        this.shift.shiftCalculateFlag = 'NA'
        return
      }

      if (this.shift.shiftId && !this.shift.shiftCalculateFlag) {
        this.shift.shiftCalculateFlag = 'estandar'
        return
      }
    },
    onFlagSelect(value: string) {
      console.log('🚀 --------------------------------🚀')
      console.log('🚀 ~ onFlagSelect ~ value:', value)
      console.log('🚀 --------------------------------🚀')
    },
    setEndTime() {
      try {
        if (!this.shift || !this.shift.shiftTimeStart || !this.shift.shiftActiveHours) {
          this.timeToEnd = null
        }

        const year = DateTime.now().year
        const month = DateTime.now().month
        const day = DateTime.now().day
        const hour = this.shift.shiftTimeStart.split(':')[0]
        const minutes = this.shift.shiftTimeStart.split(':')[1]
        const dateTimeStart = DateTime.fromObject({ year, month, day, hour: parseInt(hour), minute: parseInt(minutes) })
        const endTime = dateTimeStart.plus({ hours: this.shift.shiftActiveHours }).toJSDate()
        this.timeToEnd = endTime
      } catch (error) {

      }
    }
  }
})
