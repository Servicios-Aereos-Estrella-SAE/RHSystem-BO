import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import PositionService from '~/resources/scripts/services/PositionService'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PeopleInterface } from '~/resources/scripts/interfaces/PeopleInterface'
import PersonService from '~/resources/scripts/services/PersonService';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'employeeInfoForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    activeSwicht: true,
    positions: [] as PositionInterface[],
    departments: [] as DepartmentInterface[],
    submitted: false,
    genders: [
        { label: 'Male', value: 'Hombre' },
        { label: 'Female', value: 'Mujer' },
        { label: 'Other', value: 'Otro' }
    ],
    currenEmployee: null as EmployeeInterface | null,
    passwordConfirm: '',
    changePassword: false,
    isNewUser: false,
    isReady: false,
    isEmailInvalid: false,
    drawerShiftExceptions: false,
    drawerShifts: false,
    drawerProceedingFiles: false,
    isValidCURP: true,
    isValidRFC: true,
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    this.isNewUser = !this.employee.employeeId ? true : false
    this.isReady = true
    this.getDepartments()
    if (!this.isNewUser) {
      this.activeSwicht = this.employee.employeeWorkSchedule === 'Onsite' ? true : false
      this.getPositions(this.employee.departmentId)
    }
  },
  methods: {
    async getPositions(departmentId: number) {
      const positionService = new PositionService()
      this.positions = await positionService.getPositionsDepartment(departmentId)
    },
    async getDepartments() {
      let response = null
      const departmentService = new DepartmentService()
      response = await departmentService.getAllDepartmentList()
      this.departments = response._data.data.departments
    },
    onUpload(event: any) {
      this.employee.employeePhoto = event.files[0];
    },
    onSelect(event: any) {
      this.employee.employeePhoto = event.files[0];
    },
    async onSave() {
      this.isEmailInvalid = false
      this.submitted = true
      this.isValidCURP = true
      this.isValidRFC = true
      const employeeService = new EmployeeService()
      const personService = new PersonService()
      if (!employeeService.validateEmployeeInfo(this.employee)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
            life: 5000,
        })
        return
      }
      if (this.employee.person?.personCurp && !personService.isValidCURP(this.employee.person?.personCurp)) {
        this.isValidCURP = false
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Personal identification is not valid',
            life: 5000,
        })
        return
      }
      if (this.employee.person?.personRfc && !personService.isValidRFC(this.employee.person?.personRfc)) {
        this.isValidRFC = false
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'RFC is not valid',
            life: 5000,
        })
        return
      }
      // convert employee last name to last name and second last name
      const lastnames = this.employee.employeeLastName.split(' ')
      const personBirthday: string | Date | null = this.employee.person?.personBirthday ?? null

      const person: PeopleInterface = {
        personId: this.employee.person?.personId ?? null,
        personFirstname: this.employee.employeeFirstName,
        personLastname: lastnames[0],
        personSecondLastname: lastnames.length > 1 ? lastnames[1] : '',
        personGender: this.employee.person?.personGender ?? null,
        personBirthday: this.convertToDateTime(personBirthday),
        personPhone: this.employee.person?.personPhone ?? null,
        personCurp: this.employee.person?.personCurp ?? null,
        personRfc: this.employee.person?.personRfc ?? null,
        personImssNss: this.employee.person?.personImssNss ?? null,
        personCreatedAt: this.employee.person?.personCreatedAt ?? null,
        personUpdatedAt: this.employee.person?.personUpdatedAt ?? null,
        personDeletedAt: null,
      }
      let personResponse = null
      if (!person.personId) {
        personResponse = await employeeService.storePerson(person)
      } else {
        personResponse = await employeeService.updatePerson(person)
      }
      if (personResponse.status === 201) {
        this.employee.personId = personResponse._data.data.person.personId
        this.employee.person = {
          ...this.employee.person,
          personId: personResponse._data.data.person.personId
        } as PeopleInterface
      } else {
        const msgError = personResponse._data.error ? personResponse._data.error : personResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: `Employee ${this.employee.employeeId ? 'updated' : 'created'}`,
          detail: msgError,
            life: 5000,
        })
        return
      }
      

      let employeeResponse = null
      if (!this.employee.employeeId) {
        employeeResponse = await employeeService.store(this.employee)
      } else {
        employeeResponse = await employeeService.update(this.employee)
      }
      if (employeeResponse.status === 201) {
        this.$toast.add({
          severity: 'success',
          summary: `User ${this.employee.employeeId ? 'updated' : 'created'}`,
          detail: employeeResponse._data.message,
            life: 5000,
        })
        employeeResponse = await employeeService.show(employeeResponse._data.data.employee.employeeId)
        if (employeeResponse?.status === 200) {
          const employee = employeeResponse._data.data.employee
          this.$emit('save', employee as EmployeeInterface)
        }
      } else {
        const msgError = employeeResponse._data.error ? employeeResponse._data.error : employeeResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: `Employee ${this.employee.employeeId ? 'updated' : 'created'}`,
          detail: msgError,
            life: 5000,
        })
      }
    },
    convertToDateTime(birthday: string | Date | null): Date | null {
      if (birthday === '' || birthday === null || birthday === undefined) {
        return null;
      }
      // Si el cumpleaños ya es un objeto Date, retorna directamente
      if (birthday instanceof Date) {
        return birthday;
      }
      // Si el cumpleaños es una cadena de texto, intenta convertirla a Date
      const date = new Date(birthday);
      return isNaN(date.getTime()) ? null : date;
    },
    getShiftExceptions() {
      this.drawerShiftExceptions = true
    },
    getShifts() {
      this.drawerShifts = true
    },
    getProceedingFiles() {
      this.drawerProceedingFiles = true
    }
  },
  watch: {
    'employee.departmentId': function(newVal) {
      if (newVal) {
        this.getPositions(newVal);
      }
    },
    'activeSwicht': function (newVal) {
      this.employee.employeeWorkSchedule = newVal ? 'Onsite' : 'Remote'
    }
  },
})