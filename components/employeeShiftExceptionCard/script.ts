import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { ExceptionRequestInterface } from '~/resources/scripts/interfaces/ExceptionRequestInterface'
import type { ExceptionTypeInterface } from '~/resources/scripts/interfaces/ExceptionTypeInterface'
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface'
import ExceptionTypeService from '~/resources/scripts/services/ExceptionTypeService'

export default defineComponent({
  name: 'shiftExceptionCard',
  props: {
    shiftException: { type: Object as PropType<ExceptionRequestInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },

    clickOnEditException: { type: Function, default: null },
    clickOnDeleteException: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
    canManageToPreviousDays: { type: Boolean, required: true },
    canManageException: { type: Boolean, required: true },
  },
  data: () => ({
    exceptionTypeList: [] as Array<ExceptionTypeInterface>, 
    isReady: false, 
  }),
  computed: {
    calendarDay () {
      const dateToException = DateTime.fromISO(this.shiftException.requestedDate, { zone: 'utc' })

      return dateToException.setLocale('en').toFormat('DDDD HH:mm')
    },
    formattedRequestedDate() {
      return this.shiftException.requestedDate
      ? DateTime.fromISO(this.shiftException.requestedDate, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm:ss')
      : ''
    },
  },
  async mounted() {
    await this.getExceptionTypes()

    // if (this.shiftException.requestedDate) {
    //   const newDate = DateTime.fromISO(this.shiftException.requestedDate.toString(), { setZone: true }).setZone('America/Mexico_City')
    //   this.shiftException.requestedDate = newDate ? newDate.toString() : ''
    // }
  },
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
    handlerClickOnEditException () {
      if (this.clickOnEditException) {
        this.clickOnEditException()
      }
    },
    handlerClickOnDeleteException () {
      if (this.clickOnDeleteException) {
        this.clickOnDeleteException()
      }
    },
    async getExceptionTypes() {
      try {
        // Realiza la llamada al servicio para obtener los tipos de excepción
        const response = await new ExceptionTypeService().getFilteredList('', 1, 100, false)
        if (response.status === 200) {
          // Filtra la lista para excluir el tipo de excepción con slug "vacation"
          this.exceptionTypeList = response._data.data.exceptionTypes.data.filter(
            (            item: { exceptionTypeSlug: string }) => item.exceptionTypeSlug !== 'vacation'
          )
        }
      } catch (error) {
        console.error('Error fetching exception types:', error)
      }
      this.isReady = true
    },
    // Método para obtener el nombre del tipo de excepción
    getExceptionTypeName(exceptionTypeId: any) {
      const exceptionType = this.exceptionTypeList.find(
        (        type: { exceptionTypeId: any }) => type.exceptionTypeId === exceptionTypeId
      )
      return exceptionType ? exceptionType.exceptionTypeTypeName : 'Unknown Type'
    }
  
  }
})