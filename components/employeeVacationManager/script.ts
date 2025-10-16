import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { DateTime } from 'luxon'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { ExceptionRequestInterface } from '~/resources/scripts/interfaces/ExceptionRequestInterface'
import type { VacationAuthorizationInterface } from '~/resources/scripts/interfaces/VacationAuthorizationInterface'
import VacationAuthorizationService from '~/resources/scripts/services/VacationAuthorizationService'

export default defineComponent({
  name: 'EmployeeVacationManager',
  props: {
    employee: {
      type: Object as PropType<EmployeeInterface>,
      required: true
    },
    employeeId: {
      type: Number,
      required: true
    }
  },
  emits: ['vacationAuthorized', 'vacationRequestCreated'],
  data: () => ({
    // Datos del período de vacaciones
    vacationPeriodTitle: 'September 15, 2026 - September 14, 2027',
    activeWorkYears: 1,
    correspondingDays: 12,
    usedDays: 4,
    availableDays: 8,
    availablePreviousDays: 0,
    
    // Vacaciones autorizadas (datos de ejemplo)
    authorizedVacations: [
      { id: 1, date: '2025-10-22' },
      { id: 2, date: '2025-10-23' },
      { id: 3, date: '2025-10-24' },
      { id: 4, date: '2025-10-29' }
    ],
    
    // Solicitudes pendientes
    pendingRequests: [] as VacationAuthorizationInterface[],
    
    // Estados de los diálogos
    showAuthorizationForm: false,
    showRequestForm: false,
    
    // Servicios
    vacationAuthorizationService: null as VacationAuthorizationService | null,
    
    // Nueva solicitud de vacaciones
    newExceptionRequest: {
      exceptionRequestId: null,
      employeeId: null,
      exceptionTypeId: null,
      exceptionRequestStatus: 'pending' as const,
      exceptionRequestDescription: 'vacation',
      exceptionRequestCheckInTime: null,
      exceptionRequestCheckOutTime: null,
      daysToApply: null
    } as ExceptionRequestInterface
  }),
  async mounted() {
    this.vacationAuthorizationService = new VacationAuthorizationService()
    await this.loadPendingRequests()
  },
  methods: {
    async loadPendingRequests() {
      if (!this.vacationAuthorizationService) return
      
      try {
        const response = await this.vacationAuthorizationService.getPendingVacationRequests(this.employeeId)
        
        if (response.status === 200) {
          this.pendingRequests = response.data || []
        }
      } catch (error) {
        console.error('Error loading pending requests:', error)
      }
    },
    showVacationRequestForm() {
      this.newExceptionRequest = {
        exceptionRequestId: null,
        employeeId: this.employeeId,
        exceptionTypeId: null, // Se establecerá en el formulario
        exceptionRequestStatus: 'pending',
        exceptionRequestDescription: 'vacation',
        exceptionRequestCheckInTime: null,
        exceptionRequestCheckOutTime: null,
        daysToApply: null
      }
      this.showRequestForm = true
    },
    showVacationAuthorizationForm() {
      this.showAuthorizationForm = true
    },
    formatDate(date: string | Date | any) {
      if (!date) return ''
      
      try {
        const dateObj = typeof date === 'string' ? DateTime.fromISO(date) : DateTime.fromJSDate(new Date(date))
        return dateObj.toFormat('dd/MM/yyyy')
      } catch (error) {
        console.error('Error formatting date:', error)
        return date.toString()
      }
    },
    editVacation(vacation: any) {
      // Implementar edición de vacación
      console.log('Edit vacation:', vacation)
    },
    deleteVacation(vacation: any) {
      // Implementar eliminación de vacación
      console.log('Delete vacation:', vacation)
    },
    onAuthorizationCompleted(response: any) {
      this.$toast.add({
        severity: 'success',
        summary: this.$t('authorization_successful'),
        detail: this.$t('vacation_requests_authorized_successfully'),
        life: 5000,
      })
      
      this.showAuthorizationForm = false
      this.loadPendingRequests() // Recargar solicitudes pendientes
      this.$emit('vacationAuthorized', response)
    },
    onAuthorizationError(error: any) {
      this.$toast.add({
        severity: 'error',
        summary: this.$t('authorization_failed'),
        detail: this.$t('an_error_occurred_while_authorizing'),
        life: 5000,
      })
    },
    onVacationRequestCreated(exceptionRequest: ExceptionRequestInterface) {
      this.$toast.add({
        severity: 'success',
        summary: this.$t('request_created'),
        detail: this.$t('vacation_request_created_successfully'),
        life: 5000,
      })
      
      this.showRequestForm = false
      this.loadPendingRequests() // Recargar solicitudes pendientes
      this.$emit('vacationRequestCreated', exceptionRequest)
    }
  }
})
