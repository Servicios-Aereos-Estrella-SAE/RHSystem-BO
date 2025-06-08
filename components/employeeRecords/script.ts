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
import type { EmployeeRecordPropertyInterface } from '~/resources/scripts/interfaces/EmployeeRecordPropertyInterface'

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'employeeRecords',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    canUpdate: { type: Boolean, default: false, required: true },
  },
  data: () => ({
    isReady: false,
    employeeRecordCategories: [] as Array<any>,//Array<EmployeeRecordCategoryInterface>,
    drawerEmployeeRecordDelete: false,
    employeeRecord: null as EmployeeRecordInterface | null,
    employeeRecordProperty: null as EmployeeRecordPropertyInterface | null,
    canManageUserResponsible: false
  }),
  computed: {

  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getCategoriesEmployee()
    myGeneralStore.setFullLoader(false)
    const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
    this.canManageUserResponsible = await myGeneralStore.canManageUserResponsibleEmployee(employeeId)
    if (this.canManageUserResponsible && !this.canUpdate) {
      this.canManageUserResponsible = false
    }
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

        for (const [category, properties] of Object.entries(this.employeeRecordCategories)) {
          for (const item of properties as any[]) {
            for (const value of item.values as any[]) {
              const file = value.files.length > 0 ? value.files[0] : null
              if (value.employeeRecordId || value.employeeRecordValue || file) {
                const employeeRecord: EmployeeRecordInterface = {
                  employeeRecordId: value.employeeRecordId,
                  employeeRecordPropertyId: item.employeeRecordPropertyId,
                  employeeId: this.employee.employeeId,
                  employeeRecordValue: value.employeeRecordValue,
                  employeeRecordActive: 1
                }
                const request = !value.employeeRecordId
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
    addNew(employeeRecordProperty: any) {
      employeeRecordProperty.values.push({
        employeeRecordId: null,
        employeeRecordValue: '',
        files: []
      })
    },
    onDelete(employeeRecord: EmployeeRecordInterface, employeeRecordProperty: EmployeeRecordPropertyInterface) {
      this.employeeRecord = { ...employeeRecord };
      this.employeeRecordProperty = { ...employeeRecordProperty };
      this.drawerEmployeeRecordDelete = true;
    },
    onCancelDelete() {
      this.drawerEmployeeRecordDelete = false
    },
    async confirmDelete() {
      if (this.employeeRecord && this.employeeRecordProperty) {
        this.drawerEmployeeRecordDelete = false
        if (this.employeeRecord.employeeRecordId) {
          const employeeRecordService = new EmployeeRecordService();
          const employeeRecordResponse = await employeeRecordService.delete(this.employeeRecord)
          if (employeeRecordResponse.status === 200) {
            this.deleteEmployeeRecord()
            this.$toast.add({
              severity: 'success',
              summary: 'Delete employee record',
              detail: employeeRecordResponse._data.message,
              life: 5000,
            });
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'Delete employee record',
              detail: employeeRecordResponse._data.message,
              life: 5000,
            });
          }
        } else {
          this.deleteEmployeeRecord()
          this.$toast.add({
            severity: 'success',
            summary: 'Delete employee record',
            detail: 'Employee record deleted',
            life: 5000,
          });
        }
      }
    },
    deleteEmployeeRecord() {
      if (this.employeeRecordProperty) {
        const index = this.employeeRecordProperty.values.findIndex((employeeRecord: EmployeeRecordInterface) => employeeRecord.employeeRecordId === this.employeeRecord?.employeeRecordId)
        if (index !== -1) {
          this.employeeRecordProperty.values.splice(index, 1);
          this.$forceUpdate();
        }
      }
    },
    validateFiles(event: any, value: any) {
      let validFiles = event.files;
      value.files = validFiles;
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