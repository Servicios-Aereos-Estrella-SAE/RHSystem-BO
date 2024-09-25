import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { ProceedingFileTypeInterface } from '~/resources/scripts/interfaces/ProceedingFileTypeInterface'
import ProceedingFileTypeService from '~/resources/scripts/services/ProceedingFileTypeService'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'proceedingFileTypeInfoForm',
  props: {
    proceedingFileType: { type: Object as PropType<ProceedingFileTypeInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    activeSwicht: true,
    submitted: false,
    currenProceedingFileType: null as ProceedingFileTypeInterface | null,
    isNewProceedingFileType: false,
    isReady: false,
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    this.isNewProceedingFileType = !this.proceedingFileType.proceedingFileTypeId ? true : false
    this.isReady = true
  },
  methods: {
    async onSave() {
      this.submitted = true
      const proceedingFileTypeService = new ProceedingFileTypeService()
      if (!proceedingFileTypeService.validateInfo(this.proceedingFileType)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
            life: 5000,
        })
        return
      }
      let proceedingFileTypeResponse = null
      this.proceedingFileType.proceedingFileTypeActive = this.activeSwicht ? 1 : 0
      if (!this.proceedingFileType.proceedingFileTypeId) {
        proceedingFileTypeResponse = await proceedingFileTypeService.store(this.proceedingFileType)
      } else {
        proceedingFileTypeResponse = await proceedingFileTypeService.update(this.proceedingFileType)
      }
      if (proceedingFileTypeResponse.status === 201 || proceedingFileTypeResponse.status === 200) {
        this.$toast.add({
          severity: 'success',
          summary: `Proceeding file type ${this.proceedingFileType.proceedingFileTypeId ? 'updated' : 'created'}`,
          detail: proceedingFileTypeResponse._data.message,
            life: 5000,
        })
        proceedingFileTypeResponse = await proceedingFileTypeService.show(proceedingFileTypeResponse._data.data.proceedingFileType.proceedingFileTypeId)
        if (proceedingFileTypeResponse?.status === 200) {
          const proceedingFileType = proceedingFileTypeResponse._data.data.proceedingFileType
          this.$emit('save', proceedingFileType as ProceedingFileTypeInterface)
        }
      } else {
        const msgError = proceedingFileTypeResponse._data.error ? proceedingFileTypeResponse._data.error : proceedingFileTypeResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: `Proceeding file type ${this.proceedingFileType.proceedingFileTypeId ? 'updated' : 'created'}`,
          detail: msgError,
            life: 5000,
        })
      }
    },
  },
})