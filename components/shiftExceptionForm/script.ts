import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { DateTime } from 'luxon'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { ExceptionRequestInterface } from '~/resources/scripts/interfaces/ExceptionRequestInterface'
import type { ExceptionTypeInterface } from '~/resources/scripts/interfaces/ExceptionTypeInterface'
import ExceptionTypeService from '~/resources/scripts/services/ExceptionTypeService'
import ExceptionRequestService from '~/resources/scripts/services/ExceptionRequestService'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'

export default defineComponent({
  name: 'ShiftExceptionForm',
  props: {
    employee: {
      type: Object as PropType<EmployeeInterface>,
      required: true
    },
    startDateLimit: {
      type: Date,
      required: true
    }
  },
  emits: ['exceptionRequestCreated', 'exceptionRequestError'],
  data: () => ({
    isLoading: false,
    isCreating: false,
    submitted: false,
    applyToMoreThanOneDay: false,
    exceptionTypeList: [] as ExceptionTypeInterface[],
    sessionUser: null as UserInterface | null,
    exceptionRequest: {
      exceptionRequestId: null,
      employeeId: null,
      exceptionTypeId: 6, // Predeterminado a vacaciones (ID 6)
      exceptionRequestStatus: 'pending' as const,
      exceptionRequestDescription: '',
      exceptionRequestCheckInTime: null,
      exceptionRequestCheckOutTime: null,
      daysToApply: null
    } as ExceptionRequestInterface
  }),
  async mounted() {
    await this.initializeForm()
  },
  methods: {
    async initializeForm() {
      this.isLoading = true

      try {
        // Obtener usuario de sesión
        await this.setSessionUser()

        // Configurar empleado
        this.exceptionRequest.employeeId = this.employee.employeeId

        // Cargar tipos de excepción (solo vacaciones)
        await this.loadExceptionTypes()

        // Establecer fecha predeterminada
        this.exceptionRequest.requestedDate = DateTime.now().toFormat('yyyy-MM-dd')

      } catch (error) {
        console.error('Error initializing form:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error'),
          detail: this.$t('failed_to_initialize_form'),
          life: 5000,
        })
      } finally {
        this.isLoading = false
      }
    },

    async setSessionUser() {
      const { getSession } = useAuth()
      const session: unknown = await getSession()
      this.sessionUser = session as UserInterface
    },

    async loadExceptionTypes() {
      try {
        const exceptionTypeService = new ExceptionTypeService()
        const response = await exceptionTypeService.getFilteredList('vacation')

        if (response.status === 200) {
          const exceptionTypes = response._data.data.exceptionTypes.data as Array<ExceptionTypeInterface>
          // Filtrar solo el tipo de vacaciones
          this.exceptionTypeList = exceptionTypes.filter(type =>
            type.exceptionTypeSlug === 'vacation' || type.exceptionTypeId === 6
          )

          // Si no se encuentra el tipo de vacaciones, crear uno por defecto
          if (this.exceptionTypeList.length === 0) {
            this.exceptionTypeList = [{
              exceptionTypeId: 6,
              exceptionTypeTypeName: 'Vacation',
              exceptionTypeSlug: 'vacation',
              exceptionTypeNeedCheckInTime: false,
              exceptionTypeNeedCheckOutTime: false,
              exceptionTypeActive: true
            } as ExceptionTypeInterface]
          }
        }
      } catch (error) {
        console.error('Error loading exception types:', error)
        // Crear tipo por defecto si falla la carga
        this.exceptionTypeList = [{
          exceptionTypeId: 6,
          exceptionTypeTypeName: 'Vacation',
          exceptionTypeSlug: 'vacation',
          exceptionTypeNeedCheckInTime: false,
          exceptionTypeNeedCheckOutTime: false,
          exceptionTypeActive: true
        } as ExceptionTypeInterface]
      }
    },

    async createExceptionRequest() {
      this.submitted = true
      this.isCreating = true

      try {
        // Validar formulario
        if (!this.validateForm()) {
          return
        }

        // Preparar datos
        const requestData = { ...this.exceptionRequest }

        // Formatear fecha
        if (requestData.requestedDate) {
          requestData.requestedDate = DateTime.fromJSDate(new Date(requestData.requestedDate))
            .toFormat('yyyy-MM-dd')
        }

        // Si no se aplica a más de un día, establecer días a aplicar a 1
        if (!this.applyToMoreThanOneDay) {
          requestData.daysToApply = 1
        }

        // Crear solicitud
        const exceptionRequestService = new ExceptionRequestService()
        const response = await exceptionRequestService.store(requestData, this.sessionUser)

        if (response.status === 201 || response.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: this.$t('request_created'),
            detail: this.$t('vacation_request_created_successfully'),
            life: 5000,
          })

          this.$emit('exceptionRequestCreated', response._data.data.data)
          this.resetForm()
        } else {
          const errorMessage = response._data?.message || this.$t('failed_to_create_request')
          this.$toast.add({
            severity: 'error',
            summary: this.$t('error'),
            detail: errorMessage,
            life: 5000,
          })

          this.$emit('exceptionRequestError', response)
        }
      } catch (error) {
        console.error('Error creating exception request:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error'),
          detail: this.$t('an_error_occurred_while_creating_request'),
          life: 5000,
        })

        this.$emit('exceptionRequestError', error)
      } finally {
        this.isCreating = false
      }
    },

    validateForm(): boolean {
      if (!this.exceptionRequest.exceptionRequestDescription?.trim()) {
        this.$toast.add({
          severity: 'warn',
          summary: this.$t('validation_required'),
          detail: this.$t('description_is_required'),
          life: 5000,
        })
        return false
      }

      if (!this.exceptionRequest.requestedDate) {
        this.$toast.add({
          severity: 'warn',
          summary: this.$t('validation_required'),
          detail: this.$t('requested_date_is_required'),
          life: 5000,
        })
        return false
      }

      if (this.applyToMoreThanOneDay && !this.exceptionRequest.daysToApply) {
        this.$toast.add({
          severity: 'warn',
          summary: this.$t('validation_required'),
          detail: this.$t('days_to_apply_is_required'),
          life: 5000,
        })
        return false
      }

      return true
    },

    resetForm() {
      this.submitted = false
      this.applyToMoreThanOneDay = false
      this.exceptionRequest = {
        exceptionRequestId: null,
        employeeId: this.employee.employeeId,
        exceptionTypeId: 6,
        exceptionRequestStatus: 'pending',
        exceptionRequestDescription: '',
        exceptionRequestCheckInTime: null,
        exceptionRequestCheckOutTime: null,
        daysToApply: null
      }
    }
  }
})
