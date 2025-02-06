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
import type { PilotInterface } from '~/resources/scripts/interfaces/PilotInterface';
import PilotService from '~/resources/scripts/services/PilotService'
import FlightAttendantService from '~/resources/scripts/services/FlightAttendantService'
import type { FlightAttendantInterface } from '~/resources/scripts/interfaces/FlightAttendantInterface';
import type { CountrySearchInterface } from '~/resources/scripts/interfaces/CountrySearchInterface';
import type { CitySearchInterface } from '~/resources/scripts/interfaces/CitySearchInterface';
import type { StateSearchInterface } from '~/resources/scripts/interfaces/StateSearchInterface';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'employeePersonInfoForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    pilot: { type: Object as PropType<PilotInterface>, required: false, default: null },
    flightAttendant: { type: Object as PropType<FlightAttendantInterface>, required: false, default: null },
    clickOnSave: { type: Function, default: null },
    clickOnClose: { type: Function, default: null },
  },
  data: () => ({
    activeSwicht: true,
    positions: [] as PositionInterface[],
    departments: [] as DepartmentInterface[],
    submitted: false,
    maritalStatus: [
        { label: 'Soltero (a)', value: 'Single' },
        { label: 'Casado (a)', value: 'Married' },
        { label: 'Divorciado (a)', value: 'Divorced' },
        { label: 'Viudo (a)', value: 'Widower' },
        { label: 'Unión Libre', value: 'Free Union' }
    ],
    assistDiscriminatorOptions: [
      { label: 'Do not discriminate in assistance report', value: 0 },
      { label: 'Yes, discriminate in assistance report', value: 1 }
    ],
    currenEmployee: null as EmployeeInterface | null,
    passwordConfirm: '',
    dateWasChange: false,
    changePassword: false,
    files: [] as Array<any>,
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
    filteredCountries: [] as CountrySearchInterface[],
    filteredStates: [] as StateSearchInterface[],
    filteredCities: [] as CitySearchInterface[],
    selectCountry: '',
    selectState: '',
    selectCity: '',
  }),
  computed: {
    getAge() {
      if (this.employee.person?.personBirthday) {
        const birthday = (this.employee.person?.personBirthday instanceof Date) 
        ? DateTime.fromJSDate(this.employee.person?.personBirthday)
        : DateTime.fromISO(this.employee.person?.personBirthday)
        const now = DateTime.now()
        const year = now.diff(birthday, 'years').years
        return Math.floor(year)
      }
      return 0
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
    this.isNewUser = !this.employee?.employeeId ? true : false
    // this.setFormatDates()
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
      if (this.employee.department) {
        const existCurrentDepartment = this.departments.find(a => a.departmentId === this.employee.departmentId)
        if (!existCurrentDepartment) {
          this.departments.push(this.employee.department)
        }
      }
      if (this.employee.position) {
        const existCurrentPosition = this.positions.find(a => a.positionId === this.employee.positionId)
        if (!existCurrentPosition) {
          this.positions.push(this.employee.position)
        }
      }
    } else {
      this.employee.employeeAssistDiscriminator = 0

      if (this.businessUnits.length > 0) {
        this.employee.businessUnitId = this.businessUnits[0].businessUnitId
      }
    }
    
    

    this.isReady = true
  },
  methods: {
    async handlerSearchCountries(event: any) {
      if (event.query.trim().length) {
        const response = await new PersonService().getPlacesBirth(event.query.trim(), 'countries')
        const list = response.status === 200 ? response._data.data.places : []
        this.filteredCountries = list
      }
    },
    async handlerSearchStates(event: any) {
      if (event.query.trim().length) {
        const response = await new PersonService().getPlacesBirth(event.query.trim(), 'states')
        const list = response.status === 200 ? response._data.data.places : []
        this.filteredStates = list
      }
    },
    async handlerSearchCities(event: any) {
      if (event.query.trim().length) {
        const response = await new PersonService().getPlacesBirth(event.query.trim(), 'cities')
        const list = response.status === 200 ? response._data.data.places : []
        this.filteredCities = list
      }
    },
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
      this.employeeTypes = response._data.data.employeeTypes.data
      this.setDefaultEmployeeType(response._data.data.employeeTypes.data)
    },
    setDefaultEmployeeType(employeeTypes: any) {
      if (this.pilot) {
        this.employee.employeeTypeId = employeeTypes.find((employeeType: any) => employeeType.employeeTypeSlug === 'pilot')?.employeeTypeId
      } else if(this.flightAttendant) {
        this.employee.employeeTypeId = employeeTypes.find((employeeType: any) => employeeType.employeeTypeSlug === 'flight-attendant')?.employeeTypeId
      }
    },
    onUpload(event: any) {
      this.employee.employeePhoto = event.files[0];
    },
    onSelect(event: any) {
      this.employee.employeePhoto = event.files[0];
    },
    validateFiles(event: any) {
      let validFiles = event.files;
      this.files = validFiles;
      this.$forceUpdate()
    },
    getObjectURL(file: any) {
      return URL.createObjectURL(file);
    },
    dateYear(date: string) {
      if (!date) {
        return 0
      }

      const year = parseInt(`${date.toString().split('-')[0]}`)
      return year
    },
    dateMonth(date: string) {
      if (!date) {
        return 0
      }

      const month = parseInt(`${date.toString().split('-')[1]}`)
      return month
    },
    dateDay(date: string) {
      if (!date) {
        return 0
      }

      const day = parseInt(`${date.toString().split('-')[2]}`)
      return day
    },
    formatDate(propertyName: string, isPilot = true) {
      let currentDate = propertyName === 'birthday' ? this.pilot.person?.personBirthday : (isPilot ? this.pilot.pilotHireDate : this.flightAttendant.flightAttendantHireDate)
      if ((this.pilot || this.flightAttendant) && currentDate) {
        let newDate = null
        currentDate = currentDate.toString()
        const date = DateTime.local(this.dateYear(currentDate), this.dateMonth(currentDate), this.dateDay(currentDate), 0)
        const day = date.toFormat('yyyy-MM-dd')
        if (date.isValid) {
          newDate = day
        } else {
          const otherDate = DateTime.fromHTTP(currentDate)
          if (date.isValid) {
            const day = otherDate.toFormat('yyyy-MM-dd')
            newDate = day
          }
        }
        if (newDate) {
          if (propertyName === 'hireDate') {
            if (isPilot) {
              this.pilot.pilotHireDate = newDate
            } else {
              this.flightAttendant.flightAttendantHireDate = newDate
            }
          } else {
            if (this.pilot.person) {
              this.pilot.person.personBirthday = newDate
            }
          }
        }
        if (propertyName === 'hireDate') {
          this.dateWasChange = true
        }
      }
    },
    getDate(date: string) {
      return  DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd');
    },
    hasPhotoEmployee() {
      return (this.pilot && this.pilot.pilotPhoto) || (this.flightAttendant && this.flightAttendant.flightAttendantPhoto)
    },
    getUrlPhoto() {
      if(this.pilot && this.pilot.pilotPhoto) {
        return this.pilot.pilotPhoto
      }
      if(this.flightAttendant && this.flightAttendant.flightAttendantPhoto) {
        return this.flightAttendant.flightAttendantPhoto
      }
    },
    async onSave() {
      this.isEmailInvalid = false
      this.submitted = true
      this.isValidCURP = true
      this.isValidRFC = true
      const employeeService = new EmployeeService()
      const personService = new PersonService()
      const pilotService = new PilotService()
      const flightAttendantService = new FlightAttendantService()
    
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
      if (this.pilot !== null && this.files.length > 1) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Image invalid',
          detail: 'Only one image is allowed',
          life: 5000,
        })
        return
      } else if(this.pilot !== null){
        for await (const file of this.files) {
          if (file) {
            const mimeType = file.type;
            const isAudioOrVideo = mimeType.startsWith('image/');
            if (!isAudioOrVideo) {
              this.$toast.add({
                severity: 'warn',
                summary: 'Image invalid',
                detail: 'Only select image.',
                life: 5000,
              })
              return
            }
          }
        }
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
        personPhoneSecondary: this.employee.person?.personPhoneSecondary ?? null,
        personMaritalStatus: this.employee.person?.personMaritalStatus ?? null,
        personPlaceOfBirthCountry: this.employee.person?.personPlaceOfBirthCountry ?? null,
        personPlaceOfBirthState: this.employee.person?.personPlaceOfBirthState ?? null,
        personPlaceOfBirthCity: this.employee.person?.personPlaceOfBirthCity ?? null,
        personCreatedAt: this.employee.person?.personCreatedAt ?? null,
        personUpdatedAt: this.employee.person?.personUpdatedAt ?? null,
        personDeletedAt: null,
      }
      if (typeof this.selectCountry === 'string' && this.selectCountry.trim() !== '' && !person.personPlaceOfBirthCountry) {
        person.personPlaceOfBirthCountry = this.selectCountry
      }
      if (typeof this.selectState === 'string' && this.selectState.trim() !== '' && !person.personPlaceOfBirthState) {
        person.personPlaceOfBirthState = this.selectState
      }
      if (typeof this.selectCity === 'string' && this.selectCity.trim() !== '' && !person.personPlaceOfBirthCity) {
        person.personPlaceOfBirthCity = this.selectCity
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
        if (employeeResponse?.status === 200 && this.pilot === null && this.flightAttendant === null) {
          const employee = employeeResponse._data.data.employee
          this.$emit('save', employee as EmployeeInterface)
        }
        let pilotResponse = null
        if (this.pilot !== null && employeeResponse?.status === 200) {
          const image = this.files.length > 0 ? this.files[0] : null
          this.pilot.pilotHireDate = this.employee.employeeHireDate
          this.pilot.employeeId = employeeResponse._data.data.employee.employeeId
          this.formatDate('hireDate', true)
          if (this.pilot.pilotHireDate) {
            this.pilot.pilotHireDate = this.getDate(this.pilot.pilotHireDate.toString())
          }
          if (!this.pilot.pilotId) {
            pilotResponse = await pilotService.store(this.pilot, image)
          } else {
            pilotResponse = await pilotService.update(this.pilot, image)
           }
          if (pilotResponse.status === 201 || pilotResponse.status === 200) {
            this.$toast.add({
              severity: 'success',
              summary: `Pilot ${this.pilot.pilotId ? 'updated' : 'created'}`,
              detail: pilotResponse._data.message,
                life: 5000,
            })
            pilotResponse = await pilotService.show(pilotResponse._data.data.pilot.pilotId)
            if (pilotResponse?.status === 200) {
              const pilot = pilotResponse._data.data.pilot
              this.$emit('save', pilot as PilotInterface)
            }
          } else {
            const msgError = pilotResponse._data.error ? pilotResponse._data.error : pilotResponse._data.message
            this.$toast.add({
              severity: 'error',
              summary: `Pilot ${this.pilot.pilotId ? 'updated' : 'created'}`,
              detail: msgError,
                life: 5000,
            })
          }
        }
        let FlightAttendantResponse = null
        if (this.flightAttendant !== null && employeeResponse?.status === 200) {
          const image = this.files.length > 0 ? this.files[0] : null
          this.flightAttendant.flightAttendantHireDate = this.employee.employeeHireDate
          this.flightAttendant.employeeId = employeeResponse._data.data.employee.employeeId
          this.formatDate('hireDate', false)
          if (this.flightAttendant.flightAttendantHireDate) {
            this.flightAttendant.flightAttendantHireDate = this.getDate(this.flightAttendant.flightAttendantHireDate.toString())
          }
          if (!this.flightAttendant.flightAttendantId) {
            FlightAttendantResponse = await flightAttendantService.store(this.flightAttendant, image)
          } else {
            FlightAttendantResponse = await flightAttendantService.update(this.flightAttendant, image)
          }
          if (FlightAttendantResponse.status === 201 || FlightAttendantResponse.status === 200) {
            this.$toast.add({
              severity: 'success',
              summary: `Pilot ${this.flightAttendant.flightAttendantId ? 'updated' : 'created'}`,
              detail: FlightAttendantResponse._data.message,
                life: 5000,
            })
            FlightAttendantResponse = await flightAttendantService.show(FlightAttendantResponse._data.data.flightAttendant.flightAttendantId)
            if (FlightAttendantResponse?.status === 200) {
              const flightAttendant = FlightAttendantResponse._data.data.flightAttendant
              this.$emit('save', flightAttendant as FlightAttendantInterface)
            }
          } else {
            const msgError = FlightAttendantResponse._data.error ? FlightAttendantResponse._data.error : FlightAttendantResponse._data.message
            this.$toast.add({
              severity: 'error',
              summary: `Pilot ${this.flightAttendant.flightAttendantId ? 'updated' : 'created'}`,
              detail: msgError,
                life: 5000,
            })
          }
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
    },
    handlerClickOnClose () {
      if (this.clickOnClose) {
        this.clickOnClose()
      }
    },
    onCountrySelect(selectedOption: any) {
      if (this.employee.person) {
        this.employee.person.personPlaceOfBirthCountry = selectedOption.value.personPlaceOfBirthCountry
      }
    },
    onStateSelect(selectedOption: any) {
      if (this.employee.person) {
        this.employee.person.personPlaceOfBirthState = selectedOption.value.personPlaceOfBirthState
      }
    },
    onCitySelect(selectedOption: any) {
      if (this.employee.person) {
        this.employee.person.personPlaceOfBirthCity = selectedOption.value.personPlaceOfBirthCity
      }
    }
    
  }
})