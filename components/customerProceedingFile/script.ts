import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { CustomerInterface } from '~/resources/scripts/interfaces/CustomerInterface'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'
import Calendar from 'primevue/calendar'
import { useMyGeneralStore } from '~/store/general'
import type { CustomerProceedingFileInterface } from '~/resources/scripts/interfaces/CustomerProceedingFileInterface';
import type { ProceedingFileInterface } from '~/resources/scripts/interfaces/ProceedingFileInterface';
import CustomerProceedingFileService from '~/resources/scripts/services/CustomerProceedingFileService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
    Calendar
  },
  name: 'customerProceedingFile',
  props: {
    customer: { type: Object as PropType<CustomerInterface>, required: true }
  },
  data: () => ({
    isReady: false,
    customerProceedingFilesList: [] as CustomerProceedingFileInterface[],
    proceedingFilesList: [] as ProceedingFileInterface[],
    selectedProceedingFileId: null as number | null,
    customerProceedingFile: null as CustomerProceedingFileInterface | null,
    customerProceedingFileActiveId: 0 as number | null,
    drawerCustomerProceedingFileForm: false,
    drawerCustomerProceedingFileDelete: false,
    selectedDateTimeDeleted: '' as string | null
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getCustomerProceedingFiles()
    myGeneralStore.setFullLoader(false)
    this.isReady = true
   
  },
  methods: {
    async getCustomerProceedingFiles() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.customerProceedingFilesList = []
      const customerId = this.customer.customerId ? this.customer.customerId : 0
      const customerProceedingFileService = new CustomerProceedingFileService()
      const customerProceedingFileResponse = await customerProceedingFileService.getByCustomer(customerId)
      this.customerProceedingFilesList = customerProceedingFileResponse.proceedingFiles
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newCustomerProceedingFile: CustomerProceedingFileInterface = {
        customerProceedingFileId: null,
        customerId: this.customer.customerId,
        proceedingFileId: null,
        customerProceedingFileCreatedAt: null,
        customerProceedingFileUpdatedAt: null,
        customerProceedingFileDeletedAt: null
      }
      this.customerProceedingFile = newCustomerProceedingFile
      this.drawerCustomerProceedingFileForm = true
    },
    async onSave(customerProceedingFile: CustomerProceedingFileInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.customerProceedingFile = {...customerProceedingFile}
      
      const index = this.customerProceedingFilesList.findIndex((customerProceedingFile: CustomerProceedingFileInterface) => customerProceedingFile.customerProceedingFileId === this.customerProceedingFile?.customerProceedingFileId)
      if (index !== -1) {
        this.customerProceedingFilesList[index] = customerProceedingFile
        this.$forceUpdate()
      } else {
        this.customerProceedingFilesList.push(customerProceedingFile)
        this.$forceUpdate()
      }
      this.drawerCustomerProceedingFileForm = false
      myGeneralStore.setFullLoader(false)
    },
    onEdit(customerProceedingFile: CustomerProceedingFileInterface) {
      this.customerProceedingFile = {...customerProceedingFile}
      this.drawerCustomerProceedingFileForm = true
    },
    onDelete(customerProceedingFile: CustomerProceedingFileInterface) {
      this.customerProceedingFile = {...customerProceedingFile}
      this.selectedDateTimeDeleted = ''
      this.drawerCustomerProceedingFileDelete = true
    },
    async confirmDelete() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      if (this.customerProceedingFile) {
        this.drawerCustomerProceedingFileDelete = false
        const customerProceedingFileService = new CustomerProceedingFileService()
        const customerProceedingFileResponse = await customerProceedingFileService.delete(this.customerProceedingFile)
        if (customerProceedingFileResponse.status === 200) {
          const index = this.customerProceedingFilesList.findIndex((customerProceedingFile: CustomerProceedingFileInterface) => customerProceedingFile.customerProceedingFileId === this.customerProceedingFile?.customerProceedingFileId)
          if (index !== -1) {
            this.customerProceedingFilesList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete proceeding file customer',
            detail: customerProceedingFileResponse._data.message,
              life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete proceeding file customer',
            detail: customerProceedingFileResponse._data.message,
              life: 5000,
          })
        }
      }
      myGeneralStore.setFullLoader(false)
    },
  }
})