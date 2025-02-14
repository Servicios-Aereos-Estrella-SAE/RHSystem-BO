import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import EmployeeRecordPropertyService from '~/resources/scripts/services/EmployeeRecordPropertyService'
import EmployeeRecordService from '~/resources/scripts/services/EmployeeRecordService'
import type { EmployeeRecordInterface } from '~/resources/scripts/interfaces/EmployeeRecordInterface'

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeRecords',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
  },
  data: () => ({
    isReady: false,
    employeeRecordCategories: [] as Array<any>,
  }),
  computed: {

  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getCategories()
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    async getCategories() {
      if (this.employee.employeeId) {
        const employeeRecordPropertyService = new EmployeeRecordPropertyService()
        const employeeRecordPropertyResponse = await employeeRecordPropertyService.getCategories(this.employee.employeeId)
        this.employeeRecordCategories = employeeRecordPropertyResponse._data.data.employeeRecordCategories
      }
    },
    async onSave() {
      if (this.employee.employeeId) {
        const employeeRecordService = new EmployeeRecordService()
        for (const [category, items] of Object.entries(this.employeeRecordCategories)) {
          for (const item of items as any[]) {
            const employeeRecord: EmployeeRecordInterface = {
              employeeRecordId: item.employeeRecordId,
              employeeRecordPropertyId: item.employeeRecordPropertyId,
              employeeId: this.employee.employeeId,
              employeeRecordValue: item.value,
              employeeRecordActive: 1
            }
            let employeeRecordResponse = null
            const file = item.files.length > 0 ? item.files[0] : null
            if (!item.employeeRecordId) {
              employeeRecordResponse = await employeeRecordService.store(employeeRecord, file)
            } else {
              employeeRecordResponse = await employeeRecordService.update(employeeRecord, file)
            }
            if (employeeRecordResponse.status === 201 || employeeRecordResponse.status === 200) {
              this.$toast.add({
                severity: 'success',
                summary: `Employee record ${employeeRecord.employeeRecordId ? 'updated' : 'created'}`,
                detail: employeeRecordResponse._data.message,
                life: 5000,
              })
            } else {
              const msgError = employeeRecordResponse._data.error ? employeeRecordResponse._data.error : employeeRecordResponse._data.message
              this.$toast.add({
                severity: 'error',
                summary: `Employee record ${employeeRecord.employeeRecordId ? 'updated' : 'created'}`,
                detail: msgError,
                life: 5000,
              })
            }
          }
        }
      }

    },
    validateFiles(event: any, property: any) {
      let validFiles = event.files;
      property.files = validFiles;
      this.$forceUpdate()
    },
    openFile(path: string) {
      window.open(path)
    },
    getObjectURL(file: any) {
      return URL.createObjectURL(file);
    },
  }
})