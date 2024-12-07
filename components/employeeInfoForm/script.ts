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
import BusinessUnitService from '~/resources/scripts/services/BusinessUnitService';
import type { BusinessUnitInterface } from '~/resources/scripts/interfaces/BusinessUnitInterface';
import { DateTime } from 'luxon';
import EmployeeTypeService from '~/resources/scripts/services/EmployeeTypeService';

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
        { label: 'Not specified', value: 'Otro' }
    ],
    assistDiscriminatorOptions: [
      { label: 'Do not discriminate in assistance report', value: 0 },
      { label: 'Yes, discriminate in assistance report', value: 1 }
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
    businessUnits: [] as BusinessUnitInterface[],
    employeeHireDate: '' as string,
    displayHireDateCalendar: false as boolean,
    employeeTerminatedDate: '' as string,
    displayTerminatedDateCalendar: false as boolean,
    personBirthday: '' as string,
    displayBirthDateCalendar: false as boolean,
    typesOfContract: [
        { label: 'Internal', value: 'Internal' },
        { label: 'External', value: 'External' },
    ],
    isDeleted: false,
    drawerEmployeeReactivate: false,
    employeeTypes: [] as EmployeeTypeService[],
  }),
  computed: {
  },
  watch: {
    'employee.departmentId': function(newVal) {
      if (newVal) {
        this.getPositions(newVal);
      }
    },
    'activeSwicht': function (newVal) {
      this.employee.employeeWorkSchedule = newVal ? 'Onsite' : 'Remote'
    },
    'employee.employeeHireDate' (val: Date) {
      this.employeeHireDate = this.getHireDateFormatted(val)
    },
    'employee.employeeTerminatedDate' (val: Date) {
      this.employeeTerminatedDate = this.getTerminatedDateFormatted(val)
    },
    'employee.person.personBirthday' (val: Date) {
      this.personBirthday = this.getBirthdayFormatted(val)
    }
  },
  async mounted() {
    this.isReady = false
    this.isNewUser = !this.employee.employeeId ? true : false

    await Promise.all([
      this.getBusinessUnits(),
      this.getDepartments(),
      this.getEmployeeTypes()
    ])

    if (!this.isNewUser) {
      this.activeSwicht = this.employee.employeeWorkSchedule === 'Onsite' ? true : false

      if (this.employee.employeeHireDate) {
        const hireDate = DateTime.fromISO(`${this.employee.employeeHireDate}T00:00:00.000-06:00`, { setZone: true })
          .setZone('America/Mexico_City')
          .setLocale('en')
          .toJSDate()

        this.employee.employeeHireDate = hireDate
        this.employeeHireDate = this.getHireDateFormatted(this.employee.employeeHireDate as Date)
      }

      if (this.employee.employeeTerminatedDate) {
        const terminatedDate = DateTime.fromISO(`${this.employee.employeeTerminatedDate.toString().split('T')[0] + 'T00:00:00.000-06:00'}`, { setZone: true })
          .setZone('America/Mexico_City')
          .setLocale('en')
          .toJSDate()
        this.employee.employeeTerminatedDate = terminatedDate
        this.employeeTerminatedDate = this.getTerminatedDateFormatted(this.employee.employeeTerminatedDate as Date)
      }

      if (this.employee?.person?.personBirthday) {
        const year = `${this.employee.person.personBirthday}`.split('T')[0].split('-')[0]
        const month = `${this.employee.person.personBirthday}`.split('T')[0].split('-')[1]
        const day = `${this.employee.person.personBirthday}`.split('T')[0].split('-')[2]

        const birthDay = DateTime.fromISO(`${year}-${month}-${day}T00:00:00.000-06:00`, { setZone: true })
          .setZone('America/Mexico_City')
          .setLocale('en')
          .toJSDate()

        this.employee.person.personBirthday = birthDay
        this.personBirthday = this.getBirthdayFormatted(this.employee.person.personBirthday as Date)
      }
      if (this.employee.deletedAt) {
        this.isDeleted = true
      }

      await this.getPositions(this.employee.departmentId)
    } else {
      this.employee.employeeAssistDiscriminator = 0

      if (this.businessUnits.length > 0) {
        this.employee.businessUnitId = this.businessUnits[0].businessUnitId
      }
    }

    this.isReady = true
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
    async getEmployeeTypes() {
      let response = null
      const employeeTypeService = new EmployeeTypeService()
      response = await employeeTypeService.getFilteredList('')
      console.log(response)
      this.employeeTypes = response._data.data.employeeTypes.data
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
      const terminatedDateTemp = this.employee.employeeTerminatedDate
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
      this.employee.employeeTerminatedDate = terminatedDateTemp
    },
    async onReactivate () {
      this.drawerEmployeeReactivate = true
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
    },
    async getBusinessUnits () {
      const body = await new BusinessUnitService().index()
      this.businessUnits =  body.status === 200 ? body._data.data.data || [] : []
    },
    getHireDateFormatted (date: Date) {
      if (!this.employee.employeeHireDate) {
        return ''
      }

      return DateTime.fromJSDate(date)
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toFormat('DDDD')
    },
    getTerminatedDateFormatted (date: Date) {
      if (!this.employee.employeeTerminatedDate) {
        return ''
      }

      return DateTime.fromJSDate(date)
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toFormat('DDDD')
    },
    getBirthdayFormatted (date: Date) {
      if (!this.employee.employeeHireDate) {
        return ''
      }

      return DateTime.fromJSDate(date)
        .setZone('America/Mexico_City')
        .setLocale('en')
        .toFormat('DDD')
    },
    handlerDisplayHireDate () {
      this.displayHireDateCalendar = true
    },
    handlerDisplayTerminatedDate () {
      this.displayTerminatedDateCalendar = true
    },
    handlerDisplayBirthDate () {
      this.displayBirthDateCalendar = true
    },
    onCancelEmployeeReactivate () {
      this.drawerEmployeeReactivate = false
    },
    async confirmReactivate () {
      const employeeService = new EmployeeService()
      let employeeResponse = await employeeService.reactivate(this.employee)
      if (employeeResponse.status === 200) {
        this.$toast.add({
          severity: 'success',
          summary: 'Employee Reactivate',
          detail: employeeResponse._data.message,
            life: 5000,
        })
        employeeResponse = await employeeService.show(employeeResponse._data.data.employee.employeeId)
        if (employeeResponse?.status === 200) {
          const employee = employeeResponse._data.data.employee
          this.drawerEmployeeReactivate = false
          this.$emit('save', employee as EmployeeInterface)
        }
      } else {
        const msgError = employeeResponse._data.error ? employeeResponse._data.error : employeeResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: 'Employee Reactivate',
          detail: msgError,
            life: 5000,
        })
        return
      }
    }
  }
})