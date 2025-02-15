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
    await this.getCategoriesEmployee()
    myGeneralStore.setFullLoader(false)
    this.isReady = true

  },
  methods: {
    async getCategoriesEmployee() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.employeeRecordCategories = []
      if (this.employee.employeeId) {
        const employeeRecordPropertyService = new EmployeeRecordPropertyService()
        const employeeRecordPropertyResponse = await employeeRecordPropertyService.getCategories(this.employee.employeeId)
        this.employeeRecordCategories = employeeRecordPropertyResponse._data.data.employeeRecordCategories
      }
      myGeneralStore.setFullLoader(false)
    },
    async onSave() {
      if (this.employee.employeeId) {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        const employeeRecordService = new EmployeeRecordService()
        const promises = []

        for (const [category, items] of Object.entries(this.employeeRecordCategories)) {
          for (const item of items as any[]) {
            const file = item.files.length > 0 ? item.files[0] : null
            if (item.employeeRecordId || item.value || file) {
              const employeeRecord: EmployeeRecordInterface = {
                employeeRecordId: item.employeeRecordId,
                employeeRecordPropertyId: item.employeeRecordPropertyId,
                employeeId: this.employee.employeeId,
                employeeRecordValue: item.value,
                employeeRecordActive: 1
              }

              const request = !item.employeeRecordId
                ? employeeRecordService.store(employeeRecord, file)
                : employeeRecordService.update(employeeRecord, file)

              promises.push(
                request
                  .then((response) => {
                    if (response.status === 201 || response.status === 200) {
                      return {
                        success: true,
                        message: `Employee record ${employeeRecord.employeeRecordId ? 'updated' : 'created'}`,
                      }
                    } else {
                      const msgError = response._data.error ? response._data.error : response._data.message;
                      return {
                        success: false,
                        message: `Employee record ${employeeRecord.employeeRecordId ? 'updated' : 'created'}`,
                        error: msgError
                      }
                    }
                  })
                  .catch((error) => {
                    return {
                      success: false,
                      message: `Employee record ${employeeRecord.employeeRecordId ? 'updated' : 'created'}`,
                      error: error.message || 'Unknown error'
                    }
                  })
              )
            }
          }
        }
        try {
          const results = await Promise.all(promises)
          const errors = results.filter((result) => !result.success);
          if (errors.length > 0) {
            this.$toast.add({
              severity: 'error',
              summary: 'Error saving employee records',
              detail: errors.map((e) => e.error).join(', '),
              life: 5000,
            })
          } else {
            this.$toast.add({
              severity: 'success',
              summary: 'All employee records were saved successfully',
              detail: 'The records were created or updated successfully.',
              life: 5000,
            })
          }
        } catch (error: any) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error saving employee records',
            detail: error.message || 'There was a problem processing the employee records.',
            life: 5000,
          })
        }
        myGeneralStore.setFullLoader(false)
        await this.getCategoriesEmployee()
      }
    },
    addNew(employeeRecordPropertyId: number) {

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