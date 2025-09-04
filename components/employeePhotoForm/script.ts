import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'employeePhotoForm',
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    submitted: false,
    currenEmployee: null as EmployeeInterface | null,
    isNewEmployee: false,
    isReady: false,
    maxFileSize: 2000000,
    currentPhotoUrl: ''
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    this.isNewEmployee = !this.employee.employeeId ? true : false
    if (!this.isNewEmployee && this.employee.employeePhoto) {
      this.currentPhotoUrl = this.employee.employeePhoto
    }


    this.isReady = true
  },
  methods: {
    async onUpload(event: any) {
      this.employee.employeePhoto = event.files[0];
      const employeeService = new EmployeeService();
      const employeeResponse = await employeeService.updatePhoto(this.employee.employeeId ?? 0, this.employee.employeePhoto)
      const employee = employeeResponse._data.employee
      if (employeeResponse?.status === 200) {
        this.$toast.add({
          severity: 'success',
          summary: this.t('success'),
          detail: this.t('photo_saved_successfully'),
          life: 5000
        });
        this.currentPhotoUrl = employee.employeePhoto
        this.$emit('save', employee as EmployeeInterface)

      }

    },
    onSelect(event: any) {
      console.info(event)
      // this.employee.employeePhoto = event.files[0];
    },
  },
})