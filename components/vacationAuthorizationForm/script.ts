import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import VacationAuthorizationService from '~/resources/scripts/services/VacationAuthorizationService'
import type { VacationAuthorizationRequestInterface } from '~/resources/scripts/interfaces/VacationAuthorizationInterface'
import type { VacationPeriodInterface } from '~/resources/scripts/interfaces/VacationPeriodInterface'

export default defineComponent({
  name: 'VacationAuthorizationForm',
  props: {
    employeeId: {
      type: Number,
      required: true
    },
    currentVacationPeriod: {
      type: Object as PropType<VacationPeriodInterface>,
      required: true
    },
    vacationSettingId: {
      type: Number,
      required: true
    }
  },
  emits: ['authorizationCompleted', 'authorizationError'],
  data: () => ({
    isReady: false,
    vacationType: 'pending' as 'pending' | 'authorized',
    selectedRequests: [] as number[],
    selectedShiftExceptions: [] as number[],
    hasSignature: false,
    showConfirmation: false,
    isAuthorizing: false,
    submitted: false,
    vacationAuthorizationService: null as VacationAuthorizationService | null
  }),
  computed: {
    hasSelectedItems() {
      if (this.vacationType === 'pending') {
        return this.selectedRequests.length > 0
      } else {
        return this.selectedShiftExceptions.length > 0
      }
    },
    canAuthorize() {
      return this.hasSelectedItems && this.hasSignature
    }
  },
  async mounted() {
    this.isReady = true
    this.vacationAuthorizationService = new VacationAuthorizationService()
  },
  methods: {
    setVacationType(type: 'pending' | 'authorized') {
      this.vacationType = type
      this.resetForm()
    },
    onRequestsLoaded(requests: any[]) {
      console.log('Requests loaded:', requests)
    },
    onShiftExceptionsLoaded(shiftExceptions: any[]) {
      console.log('Shift exceptions loaded:', shiftExceptions)
    },
    onSignatureChanged(hasSignature: boolean) {
      this.hasSignature = hasSignature
    },
    showConfirmationDialog() {
      if (!this.canAuthorize) {
        this.$toast.add({
          severity: 'warn',
          summary: this.$t('validation_required'),
          detail: this.$t('please_complete_all_required_fields'),
          life: 5000,
        })
        return
      }
      this.showConfirmation = true
    },
    async authorizeRequests() {
      if (!this.vacationAuthorizationService) return

      this.isAuthorizing = true
      this.submitted = true

      try {
        console.log('Getting signature file...')
        const signatureFile = await (this.$refs.signaturePad as any).getSignatureFile()
        console.log('Signature file obtained:', signatureFile)

        if (!signatureFile) {
          console.log('No signature file found')
          this.$toast.add({
            severity: 'error',
            summary: this.$t('signature_required'),
            detail: this.$t('please_provide_a_signature'),
            life: 5000,
          })
          return
        }

        console.log('Signature file details:', {
          name: signatureFile.name,
          type: signatureFile.type,
          size: signatureFile.size
        })

        // Preparar datos de autorización
        let authorizationData: any
        if (this.vacationType === 'pending') {
          authorizationData = {
            signature: signatureFile,
            requests: this.selectedRequests,
            vacationSettingId: this.vacationSettingId
          }
        } else {
          authorizationData = {
            signature: signatureFile,
            shiftExceptionIds: this.selectedShiftExceptions,
            vacationSettingId: this.vacationSettingId
          }
        }

        // Validar datos
        if (!this.vacationAuthorizationService.validateAuthorizationData(authorizationData)) {
          this.$toast.add({
            severity: 'error',
            summary: this.$t('validation_error'),
            detail: this.$t('please_check_all_fields'),
            life: 5000,
          })
          return
        }

        // Enviar autorización
        let response
        if (this.vacationType === 'pending') {
          response = await this.vacationAuthorizationService.authorizeVacationRequests(authorizationData)
        } else {
          response = await (this.vacationAuthorizationService as any).signVacationShiftExceptions(authorizationData)
        }

        if (response.status === 200 || response.status === 201) {
          this.$toast.add({
            severity: 'success',
            summary: this.$t('authorization_successful'),
            detail: this.$t('vacation_requests_authorized_successfully'),
            life: 5000,
          })

          this.$emit('authorizationCompleted', response)
          this.resetForm()
        } else {
          const errorMessage = response._data?.message || this.$t('authorization_failed')
          this.$toast.add({
            severity: 'error',
            summary: this.$t('authorization_failed'),
            detail: errorMessage,
            life: 5000,
          })

          this.$emit('authorizationError', response)
        }
      } catch (error) {
        console.error('Error authorizing requests:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error'),
          detail: this.$t('an_error_occurred_while_authorizing'),
          life: 5000,
        })

        this.$emit('authorizationError', error)
      } finally {
        this.isAuthorizing = false
        this.showConfirmation = false
      }
    },
    resetForm() {
      this.selectedRequests = []
      this.selectedShiftExceptions = []
      this.hasSignature = false
      this.submitted = false
      this.showConfirmation = false

      // Limpiar firma
      if (this.$refs.signaturePad) {
        (this.$refs.signaturePad as any).clearSignature()
      }
    }
  }
})
