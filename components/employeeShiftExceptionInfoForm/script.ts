import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'
import type { ExceptionTypeInterface } from '~/resources/scripts/interfaces/ExceptionTypeInterface'
import ExceptionTypeService from '~/resources/scripts/services/ExceptionTypeService'
import ShiftExceptionService from '~/resources/scripts/services/ShiftExceptionService'
import { DateTime } from 'luxon';
import { useMyGeneralStore } from '~/store/general';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'shiftExceptionForm',
  props: {
    shiftException: { type: Object as PropType<ShiftExceptionInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    exceptionTypeList: [] as ExceptionTypeInterface[],
    submitted: false,
    currentShiftException: null as ShiftExceptionInterface | null,
    isNewShiftException: false,
    currentDate: null as string | null,
    dateWasChange: false,
    isReady: false,
  }),
  computed: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewShiftException = !this.shiftException.shiftExceptionId ? true : false
    if (this.shiftException.shiftExceptionId) {
      const shiftExceptionService = new ShiftExceptionService()
      const shiftExceptionResponse = await  shiftExceptionService.show(this.shiftException.shiftExceptionId)
      if (shiftExceptionResponse.status === 200) {
        this.currentShiftException = shiftExceptionResponse._data.data.shiftException
      }
      if (this.currentShiftException && this.currentShiftException.shiftExceptionsDate) {
        this.currentDate = `${this.currentShiftException.shiftExceptionsDate}`
        const newDate = DateTime.fromISO(this.currentShiftException.shiftExceptionsDate.toString(), { setZone: true }).setZone('America/Mexico_City').toFormat('yyyy-MM-dd HH:mm:ss')
        this.shiftException.shiftExceptionsDate = newDate ? newDate.toString() : ''
      }
    }
    await this.getExceptionTypes()
    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    async getExceptionTypes() {
      const response = await new ExceptionTypeService().getFilteredList('', 1, 100)
      const list = response.status === 200 ? response._data.data.exceptionTypes.data : []
      this.exceptionTypeList = list
    },
    async onSave() {
      this.submitted = true
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
      if (!this.dateWasChange) {
        this.shiftException.shiftExceptionsDate = this.currentDate
      }
      if (!this.shiftException.shiftExceptionId) {
        shiftExceptionResponse = await shiftExceptionService.store(this.shiftException)
      } else {
        shiftExceptionResponse = await shiftExceptionService.update(this.shiftException)
      }
      if (shiftExceptionResponse.status === 201 || shiftExceptionResponse.status === 200) {
        this.$toast.add({
          severity: 'success',
          summary: `Shift exception ${this.shiftException.shiftExceptionId ? 'updated' : 'created'}`,
          detail: shiftExceptionResponse._data.message,
            life: 5000,
        })
        shiftExceptionResponse = await  shiftExceptionService.show(shiftExceptionResponse._data.data.shiftException.shiftExceptionId)
        if (shiftExceptionResponse.status === 200) {
          const shiftException = shiftExceptionResponse._data.data.shiftException
          this.$emit('onShiftExceptionSave', shiftException as ShiftExceptionInterface)
        }
      } else {
        let msgError = shiftExceptionResponse._data.error ? shiftExceptionResponse._data.error : shiftExceptionResponse._data.message
        if (msgError.length > 0) {
          let newMesageError = ''
          for await (const msg of msgError) {
            newMesageError = `${newMesageError}\n${msg.message}`
          }
          msgError = newMesageError
        }
        const severityType = shiftExceptionResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Shift exception ${this.shiftException.shiftExceptionId ? 'updated' : 'created'}`,
          detail: msgError,
            life: 5000,
        })
      }
      this.shiftException.shiftExceptionsDate = shiftExceptionDateTemp
      myGeneralStore.setFullLoader(false)
    },
    handleDateChange() {
      if (this.isReady) {
        this.dateWasChange = true
      }
    }
  }
})