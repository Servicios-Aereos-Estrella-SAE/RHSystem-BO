import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { DateTime } from 'luxon'
import VacationAuthorizationService from '~/resources/scripts/services/VacationAuthorizationService'

export default defineComponent({
  name: 'VacationAuthorizedSelector',
  props: {
    employeeId: {
      type: Number,
      required: true
    },
    vacationSettingId: {
      type: Number,
      required: true
    }
  },
  emits: ['update:selectedShiftExceptions', 'shiftExceptionsLoaded'],
  data: () => ({
    shiftExceptions: [] as any[],
    selectedShiftExceptions: [] as number[],
    loading: false,
    vacationAuthorizationService: null as VacationAuthorizationService | null
  }),
  async mounted() {
    this.vacationAuthorizationService = new VacationAuthorizationService()
    await this.loadShiftExceptions()
  },
  methods: {
    async loadShiftExceptions() {
      if (!this.vacationAuthorizationService) return

      this.loading = true
      try {
        const response = await (this.vacationAuthorizationService as any).getVacationShiftExceptions(
          this.employeeId,
          this.vacationSettingId
        )

        if (response.status === 200) {
          this.shiftExceptions = response.data || []
          this.$emit('shiftExceptionsLoaded', this.shiftExceptions)
        } else {
          console.error('Error loading shift exceptions:', response)
          this.shiftExceptions = []
        }
      } catch (error) {
        console.error('Error loading shift exceptions:', error)
        this.shiftExceptions = []
      } finally {
        this.loading = false
      }
    },
    isSelected(shiftExceptionId: number) {
      return this.selectedShiftExceptions.includes(shiftExceptionId)
    },
    toggleSelection(shiftExceptionId: number) {
      const index = this.selectedShiftExceptions.indexOf(shiftExceptionId)
      if (index > -1) {
        this.selectedShiftExceptions.splice(index, 1)
      } else {
        this.selectedShiftExceptions.push(shiftExceptionId)
      }
      this.$emit('update:selectedShiftExceptions', this.selectedShiftExceptions)
    },
    selectAll() {
      this.selectedShiftExceptions = this.shiftExceptions.map(se => se.shiftExceptionId)
      this.$emit('update:selectedShiftExceptions', this.selectedShiftExceptions)
    },
    clearSelection() {
      this.selectedShiftExceptions = []
      this.$emit('update:selectedShiftExceptions', this.selectedShiftExceptions)
    },
    formatDate(dateString: string) {
      if (!dateString) return ''

      try {
        // Parsear la fecha ISO y ajustar a zona horaria local
        const dateObj = DateTime.fromISO(dateString, { zone: 'utc' }).setZone('local')
        return dateObj.toFormat('dd/MM/yyyy')
      } catch (error) {
        console.error('Error formatting date:', error)
        return dateString
      }
    }
  }
})
