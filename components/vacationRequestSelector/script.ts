import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { DateTime } from 'luxon'
import type { VacationAuthorizationInterface } from '~/resources/scripts/interfaces/VacationAuthorizationInterface'
import VacationAuthorizationService from '~/resources/scripts/services/VacationAuthorizationService'

export default defineComponent({
  name: 'VacationRequestSelector',
  props: {
    employeeId: {
      type: Number,
      required: true
    },
    selectedRequests: {
      type: Array as PropType<number[]>,
      default: () => []
    }
  },
  emits: ['update:selectedRequests', 'requestsLoaded'],
  data: () => ({
    pendingRequests: [] as VacationAuthorizationInterface[],
    isLoading: false,
    vacationAuthorizationService: null as VacationAuthorizationService | null
  }),
  async mounted() {
    this.vacationAuthorizationService = new VacationAuthorizationService()
    await this.loadPendingRequests()
  },
  methods: {
    async loadPendingRequests() {
      if (!this.vacationAuthorizationService) {
        console.log('VacationAuthorizationService not initialized in vacationRequestSelector')
        return
      }

      this.isLoading = true
      try {
        console.log('VacationRequestSelector: Loading pending requests for employee:', this.employeeId)
        const response = await this.vacationAuthorizationService.getPendingVacationRequests(this.employeeId)
        console.log('VacationRequestSelector: Response received:', response)

        if (response.status === 200) {
          this.pendingRequests = response.data || []
          console.log('VacationRequestSelector: Pending requests loaded:', this.pendingRequests.length, 'requests')
          this.$emit('requestsLoaded', this.pendingRequests)
        } else {
          console.log('VacationRequestSelector: Response status not 200:', response.status)
          this.$toast.add({
            severity: 'error',
            summary: this.$t('error'),
            detail: this.$t('failed_to_load_pending_requests'),
            life: 5000,
          })
        }
      } catch (error) {
        console.error('VacationRequestSelector: Error loading pending requests:', error)
        this.$toast.add({
          severity: 'error',
          summary: this.$t('error'),
          detail: this.$t('failed_to_load_pending_requests'),
          life: 5000,
        })
      } finally {
        this.isLoading = false
      }
    },
    toggleRequest(requestId: number) {
      const currentSelection = [...this.selectedRequests]
      const index = currentSelection.indexOf(requestId)

      if (index > -1) {
        currentSelection.splice(index, 1)
      } else {
        currentSelection.push(requestId)
      }

      this.$emit('update:selectedRequests', currentSelection)
    },
    selectAll() {
      const allRequestIds = this.pendingRequests.map(request => request.exceptionRequestId)
      this.$emit('update:selectedRequests', allRequestIds)
    },
    clearSelection() {
      this.$emit('update:selectedRequests', [])
    },
    formatDate(date: string | Date | any) {
      if (!date) return ''

      try {
        let dateObj
        if (typeof date === 'string') {
          // Parsear la fecha ISO y ajustar a zona horaria local
          dateObj = DateTime.fromISO(date, { zone: 'utc' }).setZone('local')
        } else {
          dateObj = DateTime.fromJSDate(new Date(date))
        }
        return dateObj.toFormat('dd/MM/yyyy')
      } catch (error) {
        console.error('Error formatting date:', error)
        return date.toString()
      }
    }
  }
})
