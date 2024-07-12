import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
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
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    submitted: false,
    currenEmployee: null as EmployeeInterface | null,
    isNewEmployee: false,
    isReady: false,
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    this.isNewEmployee = !this.employee.employeeId ? true : false
    console.log(this.employee, 'Employee updated')
    this.isReady = true
  },
  methods: {
    onUpload(event: any) {
      this.employee.employeePhoto = event.files[0];
      console.log('Photo uploaded:', this.employee.employeePhoto);
    },
    onSelect(event: any) {
      this.employee.employeePhoto = event.files[0];
      console.log('Photo selected:', this.employee.employeePhoto);
    },
  },
})