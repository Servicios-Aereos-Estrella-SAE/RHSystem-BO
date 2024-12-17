import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface'
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'
import ShiftExceptionService from '~/resources/scripts/services/ShiftExceptionService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  components: {
  },
  name: 'vacationsControl',
  props: {
    shiftException: { type: Object as PropType<ShiftExceptionInterface>, required: true },
    clickOnDelete: { type: Function, default: null },
    canManageVacation: { type: Boolean, required: true },
    indexCard: { type: Number, required: true },
    isDeleted: { type: Boolean, required: true },
    daysToApply: { type: Number, required: true },
  },
  data: () => ({
    shiftExceptionsDate: '',
    displayForm: false as boolean,
    shiftExceptionsError: [] as Array<ShiftExceptionErrorInterface>
  }),
  watch: {
    'shiftException.shiftExceptionsDate'(val: Date) {
      this.shiftExceptionsDate = this.getDateFormatted(val)
    },
  },
  computed: {

  },
  async mounted() {
    if (this.shiftException.shiftExceptionsDate) {
      const shiftExceptionsDate = DateTime.fromISO(this.shiftException.shiftExceptionsDate.toString(), { setZone: true })
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toJSDate()
      this.shiftException.shiftExceptionsDate = shiftExceptionsDate
      this.shiftExceptionsDate = this.getDateFormatted(this.shiftException.shiftExceptionsDate as Date)
    }
    if (!this.shiftException.shiftExceptionId) {
      this.displayForm = true
    }
  },
  methods: {
    getDateFormatted(date: Date) {
      if (!date) {
        return ''
      }
      return DateTime.fromJSDate(date)
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toFormat('DDD')
    },
    handlerClickOnDelete() {
      if (!this.canManageVacation) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'You do not have permission to manage vacations',
          life: 5000,
        })
        return
      }
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    async handlerClickOnSave() {
      if (!this.canManageVacation) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'You do not have permission to manage vacations',
          life: 5000,
        })
        return
      }
      const shiftExceptionService = new ShiftExceptionService()
      if (!shiftExceptionService.validateInfo(this.shiftException)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)

      let shiftExceptionResponse = null
      const shiftExceptionDateTemp = this.shiftException.shiftExceptionsDate
      
      let isNew = false
      if (!this.shiftException.shiftExceptionId) {
        this.shiftException.daysToApply = this.daysToApply
        isNew = true
        shiftExceptionResponse = await shiftExceptionService.store(this.shiftException)
      } else {
        shiftExceptionResponse = await shiftExceptionService.update(this.shiftException)
      }
      if (isNew) {
        if (shiftExceptionResponse.status === 201 || shiftExceptionResponse.status === 200) {
            this.$emit('onShiftExceptionSaveAll', this.shiftExceptionsError as Array<ShiftExceptionErrorInterface>, this.indexCard)
            this.displayForm = false
          //}
        } else {
          let msgError = shiftExceptionResponse._data.error ? shiftExceptionResponse._data.error : shiftExceptionResponse._data.message
          const severityType = shiftExceptionResponse.status === 500 ? 'error' : 'warn'
          this.$toast.add({
            severity: severityType,
            summary: `Shift exception ${this.shiftException.shiftExceptionId ? 'updated' : 'created'}`,
            detail: msgError,
            life: 5000,
          })
        }
      } else {
        if (shiftExceptionResponse.status === 201 || shiftExceptionResponse.status === 200) {
          shiftExceptionResponse = await shiftExceptionService.show(shiftExceptionResponse._data.data.shiftException.shiftExceptionId)
          if (shiftExceptionResponse.status === 200) {
            const shiftException = shiftExceptionResponse._data.data.shiftException
            this.$emit('onShiftExceptionSave', shiftException as ShiftExceptionInterface, this.indexCard)
            this.displayForm = false
          }
        } else {
          let msgError = shiftExceptionResponse._data.error ? shiftExceptionResponse._data.error : shiftExceptionResponse._data.message
          const severityType = shiftExceptionResponse.status === 500 ? 'error' : 'warn'
          this.$toast.add({
            severity: severityType,
            summary: `Shift exception ${this.shiftException.shiftExceptionId ? 'updated' : 'created'}`,
            detail: msgError,
            life: 5000,
          })
        }
      }
      

      this.shiftException.shiftExceptionsDate = shiftExceptionDateTemp

      myGeneralStore.setFullLoader(false)
    },
    onEdit() {
      if (!this.canManageVacation) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'You do not have permission to manage vacations',
          life: 5000,
        })
        return
      }
      this.displayForm = true
    },
    cancelEdit() {
      if (!this.shiftException.shiftExceptionId) {
        this.$emit('onShiftExceptionCancel')
      }
      this.displayForm = false
    }
  }
})