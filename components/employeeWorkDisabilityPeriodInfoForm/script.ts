import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import { useMyGeneralStore } from '~/store/general';
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface';
import WorkDisabilityService from '~/resources/scripts/services/WorkDisabilityService';
import type { InsuranceCoverageTypeInterface } from '~/resources/scripts/interfaces/InsuranceCoverageTypeInterface';
import InsuranceCoverageTypeService from '~/resources/scripts/services/InsuranceCoverageTypeService';
import type { WorkDisabilityInterface } from '~/resources/scripts/interfaces/WorkDisabilityInterface';
import type { WorkDisabilityPeriodInterface } from '~/resources/scripts/interfaces/WorkDisabilityPeriodInterface';
import type { WorkDisabilityTypeInterface } from '~/resources/scripts/interfaces/WorkDisabilityTypeInterface';
import WorkDisabilityPeriodService from '~/resources/scripts/services/WorkDisabilityPeriodService';
import WorkDisabilityTypeService from '~/resources/scripts/services/WorkDisabilityTypeService';
import { DateTime } from 'luxon';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'WorkDisabilityPeriodInfoForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    workDisabilityPeriod: { type: Object as PropType<WorkDisabilityPeriodInterface>, required: true },
    canManageWorkDisability: { type: Boolean, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    workDisabilityTypeList: [] as WorkDisabilityTypeInterface[],
    submitted: false,
    isNewWorkDisabilityPeriod: false,
    isReady: false,
    isDeleted: false,
  }),
  computed: {
  },
  watch: {
  },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    this.isReady = false
    this.isNewWorkDisabilityPeriod = !this.workDisabilityPeriod.workDisabilityPeriodId ? true : false
    if (this.employee.deletedAt) {
      this.isDeleted = true
    }
    if (this.workDisabilityPeriod.workDisabilityPeriodId) {
      if (this.workDisabilityPeriod && this.workDisabilityPeriod.workDisabilityPeriodStartDate) {
        const isoDate = this.workDisabilityPeriod.workDisabilityPeriodStartDate.toString();
        const newDate = DateTime.fromISO(isoDate).toUTC().toFormat('yyyy-MM-dd')
        if (newDate) {
          this.workDisabilityPeriod.workDisabilityPeriodStartDate = newDate;
        } else {
          this.workDisabilityPeriod.workDisabilityPeriodStartDate = '';
        }
      }
      if (this.workDisabilityPeriod && this.workDisabilityPeriod.workDisabilityPeriodEndDate) {
        const isoDate = this.workDisabilityPeriod.workDisabilityPeriodEndDate.toString();
        const newDate = DateTime.fromISO(isoDate).toUTC().toFormat('yyyy-MM-dd')
        if (newDate) {
          this.workDisabilityPeriod.workDisabilityPeriodEndDate = newDate;
        } else {
          this.workDisabilityPeriod.workDisabilityPeriodEndDate = '';
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
    async getWorkDisabilityTypes() {
      const response = await new WorkDisabilityTypeService().getFilteredList('', 1, 100)
      const list: WorkDisabilityTypeInterface[] = response.status === 200 ? response._data.data.workDisabilityTypes.data : []
      return list
    },
    async onSave() {
      this.submitted = true
      const workDisabilityPeriodService = new WorkDisabilityPeriodService()
      if (!this.workDisabilityPeriod.workDisabilityTypeId) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (!this.workDisabilityPeriod.workDisabilityPeriodTicketFolio) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      if (!this.workDisabilityPeriod.workDisabilityPeriodStartDate) {
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
        workDisabilityPeriodResponse = await workDisabilityPeriodService.store(this.workDisabilityPeriod)
      } else {
        workDisabilityPeriodResponse = await workDisabilityPeriodService.update(this.workDisabilityPeriod)
      }

      if (workDisabilityPeriodResponse.status === 201 || workDisabilityPeriodResponse.status === 200) {
        workDisabilityPeriodResponse = await workDisabilityPeriodService.show(workDisabilityPeriodResponse._data.data.workDisabilityPeriod.workDisabilityPeriodId)
        if (workDisabilityPeriodResponse.status === 200) {
          const workDisabilityPeriod = workDisabilityPeriodResponse._data.data.workDisabilityPeriod
          this.$emit('onWorkDisabilityPeriodSave', workDisabilityPeriod as WorkDisabilityPeriodInterface)
        }
      } else {
        const msgError = workDisabilityPeriodResponse._data.error ? workDisabilityPeriodResponse._data.error : workDisabilityPeriodResponse._data.message
        const severityType = workDisabilityPeriodResponse.status === 500 ? 'error' : 'warn'
        this.$toast.add({
          severity: severityType,
          summary: `Work disability ${this.workDisabilityPeriod.workDisabilityPeriodId ? 'update' : 'create'}`,
          detail: msgError,
          life: 5000,
        })
      }
      this.workDisabilityPeriod.workDisabilityPeriodStartDate = workDisabilityPeriodStartDateTemp
      this.workDisabilityPeriod.workDisabilityPeriodEndDate = workDisabilityPeriodEndDateTemp
      this.isReady = true
      myGeneralStore.setFullLoader(false)
    },
  }
})