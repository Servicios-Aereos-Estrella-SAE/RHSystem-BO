import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { useMyGeneralStore } from '~/store/general';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import type { WorkDisabilityPeriodInterface } from '~/resources/scripts/interfaces/WorkDisabilityPeriodInterface';
import type { WorkDisabilityTypeInterface } from '~/resources/scripts/interfaces/WorkDisabilityTypeInterface';
import WorkDisabilityPeriodService from '~/resources/scripts/services/WorkDisabilityPeriodService';
import WorkDisabilityTypeService from '~/resources/scripts/services/WorkDisabilityTypeService';
import { DateTime } from 'luxon';
import type { ShiftExceptionErrorInterface } from '~/resources/scripts/interfaces/ShiftExceptionErrorInterface';
import type { WorkDisabilityInterface } from '~/resources/scripts/interfaces/WorkDisabilityInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'WorkDisabilityPeriodInfoForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    workDisability: { type: Object as PropType<WorkDisabilityInterface>, required: true },
    workDisabilityPeriod: { type: Object as PropType<WorkDisabilityPeriodInterface>, required: true },
    clickOnSave: { type: Function, default: null },
    canReadOnlyWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageWorkDisabilities: { type: Boolean, default: false, required: true }
  },
  data: () => ({
    workDisabilityTypeList: [] as WorkDisabilityTypeInterface[],
    submitted: false,
    isNewWorkDisabilityPeriod: false,
    isReady: false,
    isDeleted: false,
    files: [] as Array<any>,
    canManageCurrentPeriod: false,
    isValidTicketFolio: false,
    isInternalDisability: false,
    daysToApply: 0 as number
  }),
  computed: {
  },
  watch: {
    'workDisabilityPeriod.workDisabilityPeriodTicketFolio': {
      handler: function (val: string) {
        this.isValidFolio(val)
      },
      immediate: true
    },
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewWorkDisabilityPeriod = !this.workDisabilityPeriod.workDisabilityPeriodId ? true : false
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    this.canManageCurrentPeriod = this.canManageWorkDisabilities
    if (this.workDisability.insuranceCoverageType?.insuranceCoverageTypeSlug === 'incapacidad-interna') {
      this.isInternalDisability = true
    }
    if (this.workDisabilityPeriod.workDisabilityPeriodId) {
      await this.validateDisabilityDateRange()
      if (this.workDisabilityPeriod.workDisabilityPeriodStartDate) {
        const startIsoDate = this.workDisabilityPeriod.workDisabilityPeriodStartDate.toString()
        const startNewDate = DateTime.fromISO(startIsoDate, { zone: 'utc' }).toISODate()
        if (startNewDate) {
          this.workDisabilityPeriod.workDisabilityPeriodStartDate = startNewDate
        }
      }
      if (this.workDisabilityPeriod.workDisabilityPeriodEndDate) {
        const endIsoDate = this.workDisabilityPeriod.workDisabilityPeriodEndDate.toString()
        const endNewDate = DateTime.fromISO(endIsoDate, { zone: 'utc' }).toISODate()
        if (endNewDate) {
          this.workDisabilityPeriod.workDisabilityPeriodEndDate = endNewDate
        }
      }
    }
    let hasAccess = false
    const fullPath = this.$route.path;
    const firstSegment = fullPath.split('/')[1]
    const systemModuleSlug = firstSegment
    hasAccess = await myGeneralStore.hasAccess(systemModuleSlug, 'add-exception')
    this.workDisabilityTypeList = await this.getWorkDisabilityTypes()

    myGeneralStore.setFullLoader(false)
    this.isReady = true
  },
  methods: {
    getDate(date: string) {
      const dateWorDisabilityPeriod = DateTime.fromISO(date, { zone: 'utc' })
      return dateWorDisabilityPeriod.setLocale('en').toFormat('DDDD')
    },
    async getWorkDisabilityTypes() {
      const response = await new WorkDisabilityTypeService().getFilteredList('', 1, 100)
      const list: WorkDisabilityTypeInterface[] = response.status === 200 ? response._data.data.workDisabilityTypes.data : []
      return list
    },
    async onSave() {
      this.submitted = true
      const workDisabilityPeriodService = new WorkDisabilityPeriodService()
      if (!this.workDisabilityPeriod.workDisabilityPeriodStartDate) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (!this.workDisabilityPeriod.workDisabilityPeriodId) {
        if (!this.daysToApply) {
          this.$toast.add({
            severity: 'warn',
            summary: 'Validation data',
            detail: 'Missing data',
            life: 5000,
          })
          return
        }
        const newDate = new Date(this.workDisabilityPeriod.workDisabilityPeriodStartDate)
        const daysToApply = this.daysToApply > 1 ? this.daysToApply - 1  : 0
        newDate.setDate(newDate.getDate() + daysToApply);
        this.workDisabilityPeriod.workDisabilityPeriodEndDate = newDate.toString()
      }

      if (!this.workDisabilityPeriod.workDisabilityTypeId) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (!this.isInternalDisability && !this.workDisabilityPeriod.workDisabilityPeriodTicketFolio) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (!this.workDisabilityPeriod.workDisabilityPeriodEndDate) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }
      if (!this.workDisabilityPeriod.workDisabilityPeriodId && this.files.length === 0) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }
      this.isValidTicketFolio = true
      if (this.workDisabilityPeriod.workDisabilityPeriodTicketFolio && !this.isValidFolio(this.workDisabilityPeriod.workDisabilityPeriodTicketFolio)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      for await (const file of this.files) {
        if (file) {
          const mimeType = file.type;
          const isAudioOrVideo = mimeType.startsWith('audio/') || mimeType.startsWith('video/');
          if (isAudioOrVideo) {
            this.$toast.add({
              severity: 'warn',
              summary: 'File invalid',
              detail: 'Audio or video files are not allowed.',
              life: 5000,
            })
            return
          }
        }
      }
      const files = this.files.length > 0 ? this.files[0] : null
      this.isReady = false
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      let workDisabilityPeriodResponse = null
      const workDisabilityPeriodStartDateTemp = this.workDisabilityPeriod.workDisabilityPeriodStartDate
      if (this.workDisabilityPeriod.workDisabilityPeriodStartDate) {
        this.workDisabilityPeriod.workDisabilityPeriodStartDate = DateTime.fromJSDate(new Date(this.workDisabilityPeriod.workDisabilityPeriodStartDate))
          .toFormat('yyyy-MM-dd');
      }
      const workDisabilityPeriodEndDateTemp = this.workDisabilityPeriod.workDisabilityPeriodEndDate
      if (this.workDisabilityPeriod.workDisabilityPeriodEndDate) {
        this.workDisabilityPeriod.workDisabilityPeriodEndDate = DateTime.fromJSDate(new Date(this.workDisabilityPeriod.workDisabilityPeriodEndDate))
          .toFormat('yyyy-MM-dd');
      }
      if (!this.workDisabilityPeriod.workDisabilityPeriodId) {
        workDisabilityPeriodResponse = await workDisabilityPeriodService.store(this.workDisabilityPeriod, files)
      } else {
        workDisabilityPeriodResponse = await workDisabilityPeriodService.update(this.workDisabilityPeriod, files)
      }

      if (workDisabilityPeriodResponse.status === 201 || workDisabilityPeriodResponse.status === 200) {
        let shiftExceptionsError = [] as Array<ShiftExceptionErrorInterface>
        if (workDisabilityPeriodResponse._data.data.shiftExceptionsError) {
          shiftExceptionsError = workDisabilityPeriodResponse._data.data.shiftExceptionsError
        }
        workDisabilityPeriodResponse = await workDisabilityPeriodService.show(workDisabilityPeriodResponse._data.data.workDisabilityPeriod.workDisabilityPeriodId)
        if (workDisabilityPeriodResponse.status === 200) {
          const workDisabilityPeriod = workDisabilityPeriodResponse._data.data.workDisabilityPeriod
          this.$emit('onWorkDisabilityPeriodSave', workDisabilityPeriod as WorkDisabilityPeriodInterface, shiftExceptionsError as Array<ShiftExceptionErrorInterface>)
        }
      } else {
        const msgError = workDisabilityPeriodResponse._data.error ? workDisabilityPeriodResponse._data.error : workDisabilityPeriodResponse._data.message
        const severityType = workDisabilityPeriodResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Work disability period ${this.workDisabilityPeriod.workDisabilityPeriodId ? 'update' : 'create'}`,
          detail: msgError,
          life: 5000,
        })
      }
      this.workDisabilityPeriod.workDisabilityPeriodStartDate = workDisabilityPeriodStartDateTemp
      this.workDisabilityPeriod.workDisabilityPeriodEndDate = workDisabilityPeriodEndDateTemp
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
    validateFiles(event: any) {
      let validFiles = event.files;
      this.files = validFiles;
      this.$forceUpdate()
    },
    getObjectURL(file: any) {
      return URL.createObjectURL(file);
    },
    openFile() {
      window.open(this.workDisabilityPeriod?.workDisabilityPeriodFile)
    },
    getNextPayThursday() {
      const today = DateTime.now(); // Fecha actual
      let nextPayDate = today.set({ weekday: 4 })
      if (nextPayDate < today) {
        nextPayDate = nextPayDate.plus({ weeks: 1 });
      }
      while (nextPayDate.weekNumber % 2 !== 0) {
        nextPayDate = nextPayDate.plus({ weeks: 1 });
      }
      return nextPayDate.toJSDate()
    },
    async validateDisabilityDateRange() {
      const datePay = this.getNextPayThursday()
      const monthPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('LL'))
      const yearPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('yyyy'))
      const dayPeriod = parseInt(DateTime.fromJSDate(datePay).toFormat('dd'))

      const date = DateTime.local(yearPeriod, monthPeriod, dayPeriod)
      const startOfWeek = date.startOf('week')
      const thursday = startOfWeek.plus({ days: 3 })
      const start = thursday.minus({ days: 24 })
      const currentDay = start.minus({ days: 1 }).startOf('day').setZone('utc')
      const normalizedCurrentDay = currentDay.startOf('day')

      const startDateISO = this.workDisabilityPeriod.workDisabilityPeriodStartDate
      const endDateISO = this.workDisabilityPeriod.workDisabilityPeriodEndDate

      if (!startDateISO || !endDateISO) {
        return
      }

      const currentDate = DateTime.fromISO(startDateISO, { zone: 'utc' }).startOf('day');
      const endDate = DateTime.fromISO(endDateISO, { zone: 'utc' }).startOf('day');

      if (!currentDate.isValid || !endDate.isValid || !normalizedCurrentDay.isValid) {
        console.error('Date invalid', {
          currentDate: currentDate.invalidExplanation,
          endDate: endDate.invalidExplanation,
          currentDay: normalizedCurrentDay.invalidExplanation,
        })
        return
      }

      for await (const dateRange of this.iterateDates(currentDate, endDate)) {
        const normalizedDateRange = dateRange.startOf('day')
        if (normalizedDateRange < normalizedCurrentDay) {
          this.canManageCurrentPeriod = false
          return
        }
      }
    },
    async *iterateDates(startDate: DateTime, endDate: DateTime) {
      while (startDate <= endDate) {
        yield startDate
        startDate = startDate.plus({ days: 1 })
      }
    },
    isValidFolio(value: string) {
      const regex = /^[A-Z]{2}[0-9]{6}$/
      this.isValidTicketFolio = regex.test(value)
      return this.isValidTicketFolio
    }
  }
})