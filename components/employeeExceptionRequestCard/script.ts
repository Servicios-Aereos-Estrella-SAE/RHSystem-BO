import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { ExceptionRequestInterface } from '~/resources/scripts/interfaces/ExceptionRequestInterface'
import ExceptionTypeService from '~/resources/scripts/services/ExceptionTypeService'

export default defineComponent({
  name: 'employeeExceptionRequestCard',
  props: {
    exceptionRequest: { type: Object as PropType<ExceptionRequestInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },

    clickOnEditException: { type: Function, default: null },
    clickOnDeleteException: { type: Function, default: null },
    isDeleted: { type: Boolean, required: true },
  },
  data: () => ({
    exceptionTypeList: [], 
    isReady: false, 
  }),
  computed: {
    calendarDay () {
      const dateToException = DateTime.fromISO(this.exceptionRequest.requestedDate, { zone: 'utc' })
      return dateToException.setLocale('en').toFormat('DDDD')
    },
    formattedRequestedDate() {
      return this.exceptionRequest.requestedDate
      ? DateTime.fromISO(this.exceptionRequest.requestedDate, { zone: 'utc' }).toFormat('yyyy-MM-dd')
      : ''
    },
  },
  async mounted() {
    await this.fetchExceptionTypes()
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
    async fetchExceptionTypes() {
      try {
        // Realiza la llamada al servicio para obtener los tipos de excepción
        const response = await new ExceptionTypeService().getFilteredList('', 1, 10, false)
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