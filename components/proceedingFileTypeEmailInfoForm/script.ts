import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import type { VacationPeriodInterface } from '~/resources/scripts/interfaces/VacationPeriodInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import ShiftExceptionService from '~/resources/scripts/services/ShiftExceptionService'
import { useMyGeneralStore } from '~/store/general'
import type { ProceedingFileTypeInterface } from '~/resources/scripts/interfaces/ProceedingFileTypeInterface'
import ProceedingFileTypeService from '~/resources/scripts/services/ProceedingFileTypeService'
import type { ProceedingFileTypeEmailInterface } from '~/resources/scripts/interfaces/ProceedingFileTypeEmailInterface'
import ProceedingFileTypeEmailService from '~/resources/scripts/services/ProceedingFileTypeEmailService'

export default defineComponent({
  components: {
  },
  name: 'proceedingFileTypeEmailControl',
  props: {
    proceedingFileType: { type: Object as PropType<ProceedingFileTypeInterface>, required: true }
  },
  data: () => ({
    proceedingFileTypeEmails: [] as Array<ProceedingFileTypeEmailInterface>,
    isReady: false as boolean,
    displayForm: false as boolean,
    proceedingFileTypeEmail: null as ProceedingFileTypeEmailInterface | null,
    drawerProceedingFileTypeEmailDelete: false,
    emailToDelete: '',
    currentIndex: -1,
    countsNewVacation: 0,
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    if (this.proceedingFileType.proceedingFileTypeId) {
      const proceedingFileTypeService = new ProceedingFileTypeService()
      const proceedingFileTypeResponse = await proceedingFileTypeService.show(this.proceedingFileType.proceedingFileTypeId)
      if (proceedingFileTypeResponse && proceedingFileTypeResponse.status === 200) {
        this.proceedingFileTypeEmails = proceedingFileTypeResponse._data.data.proceedingFileType.emails
      }
    }
    this.isReady = true
  },
  methods: {
    async addNewEmail() {
      const newProceedingFileTypeEmail = {
        proceedingFileTypeEmailId: null,
        proceedingFileTypeId: this.proceedingFileType.proceedingFileTypeId,
        proceedingFileTypeEmailEmail: '',
      } as ProceedingFileTypeEmailInterface
      this.proceedingFileTypeEmails.push(newProceedingFileTypeEmail)
    },
    onDelete(proceedingFileTypeEmail: ProceedingFileTypeEmailInterface, currentIndex: number) {
      this.currentIndex = currentIndex
      this.proceedingFileTypeEmail = { ...proceedingFileTypeEmail }
      this.emailToDelete = ''
      if (this.proceedingFileTypeEmail && this.proceedingFileTypeEmail.proceedingFileTypeEmailEmail) {
        this.emailToDelete = this.proceedingFileTypeEmail.proceedingFileTypeEmailEmail
      }
      this.drawerProceedingFileTypeEmailDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      let wasDeleteSuccessfully = false
      if (this.proceedingFileTypeEmail) {
        this.drawerProceedingFileTypeEmailDelete = false
        if (this.proceedingFileTypeEmail.proceedingFileTypeEmailId) {
          const proceedingFileTypeEmailService = new ProceedingFileTypeEmailService()
          const proceedingFileTypeEmailResponse = await proceedingFileTypeEmailService.delete(this.proceedingFileTypeEmail)
          if (proceedingFileTypeEmailResponse.status === 200) {
            wasDeleteSuccessfully = true
            this.$toast.add({
              severity: 'success',
              summary: 'Delete email',
              detail: proceedingFileTypeEmailResponse._data.message,
              life: 5000,
            })
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'Delete email',
              detail: proceedingFileTypeEmailResponse._data.message,
              life: 5000,
            })
          }
        } else {
          wasDeleteSuccessfully = true
          this.$toast.add({
            severity: 'success',
            summary: 'Delete email',
            detail: 'Email was deleted successfully',
            life: 5000,
          })
        }
        if (wasDeleteSuccessfully) {
          if (this.currentIndex !== -1) {
            this.proceedingFileTypeEmails.splice(this.currentIndex, 1)
            this.$forceUpdate()
          }
        }
        this.getCurrentInfo()
        this.currentIndex = -1
      }
      myGeneralStore.setFullLoader(false)
    },
    onSave() {
      this.getCurrentInfo()
    },
    async getCurrentInfo() {
      /*      if (this.employee.employeeId && this.employee.employeeHireDate && this.currentVacationPeriod) {
             this.countsNewVacation = 0
             const employeeService = new EmployeeService()
             const employeeResponse = await employeeService.getYearsWorked(this.employee.employeeId, this.currentVacationPeriod.vacationPeriodYear)
             if (employeeResponse.status === 200) {
               const years = employeeResponse._data.data.yearsWorked
               const start = DateTime.fromISO(this.employee.employeeHireDate.toString())
               const month = start.month.toString().padStart(2, '0')
               const day = start.day.toString().padStart(2, '0')
               for await (const year of years) {
                 if (year.vacationSetting) {
                   const correspondingDays = year.vacationSetting.vacationSettingVacationDays
                   const usedDays = year.vacationsUsedList.length
                   const availableDays = correspondingDays - usedDays
                   const vacationPeriod = {
                     vacationPeriodRange: this.formatDateWithYearDifference(`${year.year}-${month}-${day}`),
                     vacationSettingId: year.vacationSetting.vacationSettingId,
                     vacationPeriodYear: year.year,
                     vacationPeriodActiveWorkYears: year.yearsPassed,
                     vacationPeriodCorrespondingDays: correspondingDays,
                     vacationPeriodUsedDays: usedDays,
                     vacationPeriodAvailableDays: availableDays
                   } as VacationPeriodInterface
                   this.currentVacationPeriod = vacationPeriod
                 }
               }
             }
           } */
    }
  }
})