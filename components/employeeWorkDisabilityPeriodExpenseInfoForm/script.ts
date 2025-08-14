import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { useMyGeneralStore } from '~/store/general';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import type { WorkDisabilityTypeInterface } from '~/resources/scripts/interfaces/WorkDisabilityTypeInterface';
import WorkDisabilityTypeService from '~/resources/scripts/services/WorkDisabilityTypeService';
import { DateTime } from 'luxon';
import type { WorkDisabilityPeriodExpenseInterface } from '~/resources/scripts/interfaces/WorkDisabilityPeriodExpenseInterface';
import WorkDisabilityPeriodExpenseService from '~/resources/scripts/services/WorkDisabilityPeriodExpenseService';
import type { WorkDisabilityPeriodInterface } from '~/resources/scripts/interfaces/WorkDisabilityPeriodInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'WorkDisabilityPeriodExpenseInfoForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    workDisabilityPeriod: { type: Object as PropType<WorkDisabilityPeriodInterface>, required: true },
    workDisabilityPeriodExpense: { type: Object as PropType<WorkDisabilityPeriodExpenseInterface>, required: true },
    clickOnSave: { type: Function, default: null },
    canReadOnlyWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageWorkDisabilities: { type: Boolean, default: false, required: true },
    canManageUserResponsible: { type: Boolean, required: true },
    startDateLimit: { type: Date, required: true }
  },
  data: () => ({
    submitted: false,
    isNewWorkDisabilityPeriodExpense: false,
    isReady: false,
    isDeleted: false,
    files: [] as Array<any>,
    dates: [] as Array<any>,
    canManageCurrentPeriod: false
  }),
  computed: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewWorkDisabilityPeriodExpense = !this.workDisabilityPeriodExpense.workDisabilityPeriodExpenseId ? true : false
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    this.canManageCurrentPeriod = this.canManageWorkDisabilities
    if (this.canManageCurrentPeriod) {
      const workDisabilityPeriodStartDate = DateTime
        .fromISO(this.workDisabilityPeriod.workDisabilityPeriodStartDate)
        .startOf('day')

      const limitDate = DateTime
        .fromJSDate(this.startDateLimit)
        .startOf('day')
      if (workDisabilityPeriodStartDate.toMillis() >= limitDate.toMillis()) {
        this.canManageCurrentPeriod = true
      } else {
        this.canManageCurrentPeriod = false
      }
    }

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
      const workDisabilityPeriodExpenseService = new WorkDisabilityPeriodExpenseService()
      if (!this.workDisabilityPeriodExpense.workDisabilityPeriodExpenseAmount) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (!this.workDisabilityPeriodExpense.workDisabilityPeriodExpenseId && this.files.length === 0) {
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
      let workDisabilityPeriodExpenseResponse = null
      if (!this.workDisabilityPeriodExpense.workDisabilityPeriodExpenseId) {
        workDisabilityPeriodExpenseResponse = await workDisabilityPeriodExpenseService.store(this.workDisabilityPeriodExpense, files)
      } else {
        workDisabilityPeriodExpenseResponse = await workDisabilityPeriodExpenseService.update(this.workDisabilityPeriodExpense, files)
      }

      if (workDisabilityPeriodExpenseResponse.status === 201 || workDisabilityPeriodExpenseResponse.status === 200) {
        workDisabilityPeriodExpenseResponse = await workDisabilityPeriodExpenseService.show(workDisabilityPeriodExpenseResponse._data.data.workDisabilityPeriodExpense.workDisabilityPeriodExpenseId)
        if (workDisabilityPeriodExpenseResponse.status === 200) {
          const workDisabilityPeriodExpense = workDisabilityPeriodExpenseResponse._data.data.workDisabilityPeriodExpense
          this.$emit('onWorkDisabilityPeriodExpenseSave', workDisabilityPeriodExpense as WorkDisabilityPeriodExpenseInterface)
        }
      } else {
        const msgError = workDisabilityPeriodExpenseResponse._data.error ? workDisabilityPeriodExpenseResponse._data.error : workDisabilityPeriodExpenseResponse._data.message
        const severityType = workDisabilityPeriodExpenseResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Work disability period expense ${this.workDisabilityPeriodExpense.workDisabilityPeriodExpenseId ? 'update' : 'create'}`,
          detail: msgError,
          life: 5000,
        })
      }
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
      window.open(this.workDisabilityPeriodExpense?.workDisabilityPeriodExpenseFile)
    },
  }
})