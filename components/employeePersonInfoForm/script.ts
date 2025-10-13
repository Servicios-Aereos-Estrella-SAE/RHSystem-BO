import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { EmployeeInterface } from '~/resources/scripts/interfaces/EmployeeInterface'
import EmployeeService from '~/resources/scripts/services/EmployeeService'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PeopleInterface } from '~/resources/scripts/interfaces/PeopleInterface'
import PersonService from '~/resources/scripts/services/PersonService'
import type { BusinessUnitInterface } from '~/resources/scripts/interfaces/BusinessUnitInterface'
import { DateTime } from 'luxon'
import EmployeeTypeService from '~/resources/scripts/services/EmployeeTypeService'
import type { PilotInterface } from '~/resources/scripts/interfaces/PilotInterface'
import type { FlightAttendantInterface } from '~/resources/scripts/interfaces/FlightAttendantInterface'
import type { CountrySearchInterface } from '~/resources/scripts/interfaces/CountrySearchInterface'
import type { CitySearchInterface } from '~/resources/scripts/interfaces/CitySearchInterface'
import type { StateSearchInterface } from '~/resources/scripts/interfaces/StateSearchInterface'
import type { EmployeeSpouseInterface } from '~/resources/scripts/interfaces/EmployeeSpouseInterface'
import EmployeeSpouseService from '~/resources/scripts/services/EmployeeSpouseService'
import type { EmployeeChildrenInterface } from '~/resources/scripts/interfaces/EmployeeChildrenInterface'
import EmployeeChildrenService from '~/resources/scripts/services/EmployeeChildrenService'
import UserService from '~/resources/scripts/services/UserService'
import type { EmployeeEmergencyContactInterface } from '~/resources/scripts/interfaces/EmployeeEmergencyContactInterface'
import EmployeeEmergencyContactService from '~/resources/scripts/services/EmployeeEmergencyContactService'
import type { EmployeeMedicalConditionInterface } from '~/resources/scripts/interfaces/EmployeeMedicalConditionInterface'
import EmployeeMedicalConditionService from '~/resources/scripts/services/EmployeeMedicalConditionService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'employeePersonInfoForm',
  setup() {
    const { t, locale } = useI18n()
    return {
      t,
      locale
    }
  },
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    pilot: { type: Object as PropType<PilotInterface>, required: false, default: null },
    flightAttendant: { type: Object as PropType<FlightAttendantInterface>, required: false, default: null },
    clickOnSave: { type: Function, default: null },
    clickOnClose: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true },
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
    spouseBirthday: '' as string,
    displaySpouseBirthDateCalendar: false as boolean,
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
    employeeSpouse: null as EmployeeSpouseInterface | null,
    employeeChildren: null as EmployeeChildrenInterface | null,
    drawerEmployeeChildrenForm: false,
    drawerEmployeeChildrenDelete: false,
    employeeChildrenList: [] as EmployeeChildrenInterface[],
    genders: [
      { label: 'Male', value: 'Hombre' },
      { label: 'Female', value: 'Mujer' },
      { label: 'Not_specified', value: 'Otro' }
    ],
    employeeEmergencyContact: null as EmployeeEmergencyContactInterface | null,
    emergencyContactIsRequired: false,
    employeeMedicalCondition: null as EmployeeMedicalConditionInterface | null,
    drawerEmployeeMedicalConditionForm: false,
    drawerEmployeeMedicalConditionDelete: false,
    employeeMedicalConditionsList: [] as EmployeeMedicalConditionInterface[],
    canManageUserResponsible: false,
    localeToUse: 'en',
  }),
  computed: {
    getGenders() {
      return this.genders.map(gender => ({
        label: this.$t(`genders.${gender.label.toLowerCase()}`),
        value: gender.value
      }));
    },
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
    'employee.person.personBirthday'(val: Date) {
      this.personBirthday = this.getBirthdayFormatted(val)
    },
    'employeeSpouse.employeeSpouseBirthday'(val: Date) {
      this.spouseBirthday = this.getBirthdayFormatted(val)
    }
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  async mounted() {
    this.isReady = false
    this.isNewUser = !this.employee?.employeeId ? true : false

    if (!this.isNewUser) {
      this.activeSwicht = this.employee.employeeWorkSchedule === 'Onsite' ? true : false


      if (this.employee?.person?.personBirthday) {
        this.personBirthday = this.getBirthdayFormatted(this.employee.person.personBirthday as Date)
      }
      if (this.employee.deletedAt) {
        this.isDeleted = true
      }
      if (this.employee?.person?.personPlaceOfBirthCountry) {
        this.selectCountry = this.employee?.person?.personPlaceOfBirthCountry
      }
      if (this.employee?.person?.personPlaceOfBirthState) {
        this.selectState = this.employee?.person?.personPlaceOfBirthState
      }
      if (this.employee?.person?.personPlaceOfBirthCity) {
        this.selectCity = this.employee?.person?.personPlaceOfBirthCity
      }
    }

    if (this.employee.employeeId) {
      const employeeService = new EmployeeService()
      const employeeResponse = await employeeService.show(this.employee.employeeId)

      if (employeeResponse && employeeResponse.status === 200) {
        this.employeeChildrenList = employeeResponse._data.data.employee.children
        this.employee.person = employeeResponse._data.data.employee.person
        if (this.employee?.person?.personBirthday) {
          const year = `${this.employee.person.personBirthday}`.split('T')[0].split('-')[0]
          const month = `${this.employee.person.personBirthday}`.split('T')[0].split('-')[1]
          const day = `${this.employee.person.personBirthday}`.split('T')[0].split('-')[2]

          const birthDay = DateTime.fromISO(`${year}-${month}-${day}T00:00:00.000-06:00`, { setZone: true })
            .setZone('UTC-6')
            .setLocale(this.lo)
            .toJSDate()

          this.employee.person.personBirthday = birthDay
          this.personBirthday = this.getBirthdayFormatted(this.employee.person.personBirthday as Date)
        }
        if (employeeResponse._data.data.employee.spouse) {
          this.employeeSpouse = employeeResponse._data.data.employee.spouse
          this.setSpouseBirthday()
        }
        if (employeeResponse._data.data.employee.emergencyContact) {
          this.employeeEmergencyContact = employeeResponse._data.data.employee.emergencyContact
        }
      }

      // Cargar condiciones médicas del empleado
      await this.loadEmployeeMedicalConditions()
      if (!this.employeeSpouse) {
        this.employeeSpouse = {
          employeeSpouseId: null,
          employeeSpouseFirstname: '',
          employeeSpouseLastname: '',
          employeeSpouseSecondLastname: '',
          employeeSpouseBirthday: '',
          employeeSpouseOcupation: '',
          employeeSpousePhone: '',
          employeeId: this.employee.employeeId
        }
      }
      if (!this.employeeEmergencyContact) {
        this.employeeEmergencyContact = {
          employeeEmergencyContactId: null,
          employeeEmergencyContactFirstname: '',
          employeeEmergencyContactLastname: '',
          employeeEmergencyContactSecondLastname: '',
          employeeEmergencyContactRelationship: '',
          employeeEmergencyContactPhone: '',
          employeeId: this.employee.employeeId
        }
      }
    }
    const myGeneralStore = useMyGeneralStore()
    const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
    this.canManageUserResponsible = await myGeneralStore.canManageUserResponsibleEmployee(employeeId)
    if (this.canManageUserResponsible && !this.canUpdate) {
      this.canManageUserResponsible = false
    }
    this.isReady = true
  },
  methods: {
    setSpouseBirthday() {
      if (this.employeeSpouse?.employeeSpouseBirthday) {
        const year = `${this.employeeSpouse?.employeeSpouseBirthday}`.split('T')[0].split('-')[0]
        const month = `${this.employeeSpouse?.employeeSpouseBirthday}`.split('T')[0].split('-')[1]
        const day = `${this.employeeSpouse?.employeeSpouseBirthday}`.split('T')[0].split('-')[2]

        const birthDay = DateTime.fromISO(`${year}-${month}-${day}T00:00:00.000-06:00`, { setZone: true })
          .setZone('UTC-6')
          .setLocale(this.localeToUse)
          .toJSDate()

        this.employeeSpouse.employeeSpouseBirthday = birthDay
        this.spouseBirthday = this.getBirthdayFormatted(this.employeeSpouse?.employeeSpouseBirthday as Date)
      }
    },
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
      return DateTime.fromJSDate(new Date(date)).toFormat('yyyy-MM-dd')
    },
    async onSave() {
      this.isEmailInvalid = false
      this.submitted = true
      this.isValidCURP = true
      this.isValidRFC = true
      this.emergencyContactIsRequired = false
      const employeeService = new EmployeeService()

      if (this.pilot !== null && this.files.length > 1) {
        this.$toast.add({
          severity: 'warn',
          summary: this.t('image_invalid'),
          detail: this.t('only_one_image_is_allowed'),
          life: 5000,
        })
        return
      } else if (this.pilot !== null) {
        for await (const file of this.files) {
          if (file) {
            const mimeType = file.type
            const isAudioOrVideo = mimeType.startsWith('image/')
            if (!isAudioOrVideo) {
              this.$toast.add({
                severity: 'warn',
                summary: this.t('image_invalid'),
                detail: this.t('only_select_image'),
                life: 5000,
              })
              return
            }
          }
        }
      }
      const userService = new UserService()
      if (this.employee.person?.personEmail) {
        if (!userService.validateEmail(this.employee.person.personEmail)) {
          this.isEmailInvalid = true
          this.$toast.add({
            severity: 'warn',
            summary: this.t('validation_data'),
            detail: `${this.t('email')} ${this.t('is_not_valid')}`,
            life: 5000,
          })
          return
        }
      }
      const employeeSpouseService = new EmployeeSpouseService()
      if (this.employee.person && (this.employee.person.personMaritalStatus === 'Married' || this.employee.person.personMaritalStatus === 'Free Union')) {
        if (this.employeeSpouse) {
          if (!employeeSpouseService.validateInfo(this.employeeSpouse)) {
            this.$toast.add({
              severity: 'warn',
              summary: this.t('validation_data'),
              detail: this.t('missing_data'),
              life: 5000,
            })
            return
          }
        }
      }

      const employeeEmergencyContactService = new EmployeeEmergencyContactService()
      if (this.employeeEmergencyContact) {
        this.emergencyContactIsRequired = employeeEmergencyContactService.hasAtLeastOneField(this.employeeEmergencyContact)
        if (this.emergencyContactIsRequired && !employeeEmergencyContactService.validateInfo(this.employeeEmergencyContact)) {
          this.$toast.add({
            severity: 'warn',
            summary: this.t('validation_data'),
            detail: this.t('missing_data'),
            life: 5000,
          })
          return
        }
      }


      if (this.employee.person && (this.employee.person.personMaritalStatus === 'Married' || this.employee.person.personMaritalStatus === 'Free Union')) {
        if (this.employeeSpouse) {
          const employeeSpouseBirthday: string | Date | null = this.employeeSpouse.employeeSpouseBirthday ?? null
          this.employeeSpouse.employeeSpouseBirthday = this.convertToDateTime(employeeSpouseBirthday)
          let employeeSpouseResponse = null
          if (!this.employeeSpouse.employeeSpouseId) {
            employeeSpouseResponse = await employeeSpouseService.store(this.employeeSpouse)
          } else {
            employeeSpouseResponse = await employeeSpouseService.update(this.employeeSpouse)
          }
          if (employeeSpouseResponse.status === 201 || employeeSpouseResponse.status === 200) {
            this.$toast.add({
              severity: 'success',
              summary: `${this.t('employee_spouse')} ${this.employeeSpouse.employeeSpouseId ? this.t('updated') : this.t('created')}`,
              detail: employeeSpouseResponse._data.message,
              life: 5000,
            })

            employeeSpouseResponse = await employeeSpouseService.show(employeeSpouseResponse._data.data.employeeSpouse.employeeSpouseId)
            if (employeeSpouseResponse.status === 200) {
              this.employeeSpouse = JSON.parse(JSON.stringify(employeeSpouseResponse._data.data.employeeSpouse.employeeSpouse))
              this.setSpouseBirthday()
            }

          } else {
            const msgError = employeeSpouseResponse._data.error ? employeeSpouseResponse._data.error : employeeSpouseResponse._data.message
            this.$toast.add({
              severity: 'error',
              summary: `${this.t('employee_spouse')} ${this.employeeSpouse.employeeSpouseId ? this.t('updated') : this.t('created')}`,
              detail: msgError,
              life: 5000,
            })
            return
          }
        }
      }

      if (this.employeeEmergencyContact && this.emergencyContactIsRequired) {
        let employeeEmergencyContactResponse = null
        if (!this.employeeEmergencyContact.employeeEmergencyContactId) {
          employeeEmergencyContactResponse = await employeeEmergencyContactService.store(this.employeeEmergencyContact)
        } else {
          employeeEmergencyContactResponse = await employeeEmergencyContactService.update(this.employeeEmergencyContact)
        }
        if (employeeEmergencyContactResponse.status === 201 || employeeEmergencyContactResponse.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: `${this.t('employee_emergency_contact')} ${this.employeeEmergencyContact.employeeEmergencyContactId ? this.t('updated') : this.t('created')}`,
            detail: employeeEmergencyContactResponse._data.message,
            life: 5000,
          })

          employeeEmergencyContactResponse = await employeeEmergencyContactService.show(employeeEmergencyContactResponse._data.data.employeeEmergencyContact.employeeEmergencyContactId)
          if (employeeEmergencyContactResponse.status === 200) {
            this.employeeEmergencyContact = JSON.parse(JSON.stringify(employeeEmergencyContactResponse._data.data.employeeEmergencyContact.employeeEmergencyContact))
          }

        } else {
          const msgError = employeeEmergencyContactResponse._data.error ? employeeEmergencyContactResponse._data.error : employeeEmergencyContactResponse._data.message
          this.$toast.add({
            severity: 'error',
            summary: `${this.t('employee_emergency_contact')} ${this.employeeEmergencyContact.employeeEmergencyContactId ? this.t('updated') : this.t('created')}`,
            detail: msgError,
            life: 5000,
          })
          return
        }
      }
      const lastname = this.employee.employeeLastName
      const secondLastname = this.employee.employeeSecondLastName
      const personBirthday: string | Date | null = this.employee.person?.personBirthday ?? null

      const person: PeopleInterface = {
        personId: this.employee.person?.personId ?? null,
        personFirstname: this.employee.employeeFirstName,
        personLastname: lastname,
        personSecondLastname: secondLastname,
        personGender: this.employee.person?.personGender ?? null,
        personBirthday: this.convertToDateTime(personBirthday),
        personPhone: this.employee.person?.personPhone ?? null,
        personEmail: this.employee.person?.personEmail ?? null,
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
      if (typeof this.selectCountry === 'string' && this.selectCountry.trim() !== '') {
        person.personPlaceOfBirthCountry = this.selectCountry
      }
      if (typeof this.selectState === 'string' && this.selectState.trim() !== '') {
        person.personPlaceOfBirthState = this.selectState
      }
      if (typeof this.selectCity === 'string' && this.selectCity.trim() !== '') {
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
        const person = personResponse._data.data.person
        this.$emit('savePerson', person as PeopleInterface)
        this.$toast.add({
          severity: 'success',
          summary: `${this.t('person')} ${person.personId ? this.t('updated') : this.t('created')}`,
          detail: personResponse._data.message,
          life: 5000,
        })
      } else {
        const msgError = personResponse._data.error ? personResponse._data.error : personResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: `${this.t('employee')} ${this.employee.employeeId ? this.t('updated') : this.t('created')}`,
          detail: msgError,
          life: 5000,
        })
        return
      }
    },
    async onReactivate() {
      this.drawerEmployeeReactivate = true
    },
    convertToDateTime(birthday: string | Date | null): Date | null {
      if (birthday === '' || birthday === null || birthday === undefined) {
        return null
      }
      // Si el cumpleaños ya es un objeto Date, retorna directamente
      if (birthday instanceof Date) {
        return birthday
      }
      // Si el cumpleaños es una cadena de texto, intenta convertirla a Date
      const date = new Date(birthday)
      return isNaN(date.getTime()) ? null : date
    },
    getHireDateFormatted(date: Date) {
      if (!this.employee.employeeHireDate) {
        return ''
      }

      return DateTime.fromJSDate(date)
        .setZone('UTC-6')
        .setLocale(this.localeToUse)
        .toFormat('DDDD')
    },
    getTerminatedDateFormatted(date: Date) {
      if (!this.employee.employeeTerminatedDate) {
        return ''
      }

      return DateTime.fromJSDate(date)
        .setZone('UTC-6')
        .setLocale(this.localeToUse)
        .toFormat('DDDD')
    },
    getBirthdayFormatted(date: Date) {
      return DateTime.fromJSDate(date)
        .setZone('UTC-6')
        .setLocale(this.localeToUse)
        .toFormat('DDDD')
    },
    handlerDisplayHireDate() {
      this.displayHireDateCalendar = true
    },
    handlerDisplayTerminatedDate() {
      this.displayTerminatedDateCalendar = true
    },
    handlerDisplayBirthDate() {
      this.displayBirthDateCalendar = true
    },
    handlerDisplaySpouseBirthDate() {
      this.displaySpouseBirthDateCalendar = true
    },
    onCancelEmployeeReactivate() {
      this.drawerEmployeeReactivate = false
    },
    handlerClickOnClose() {
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
    },
    addNewChildren() {
      if (this.employee.employeeId) {
        const newEmployeeChildren: EmployeeChildrenInterface = {
          employeeChildrenId: null,
          employeeId: this.employee.employeeId,
          employeeChildrenFirstname: '',
          employeeChildrenLastname: '',
          employeeChildrenSecondLastname: '',
          employeeChildrenGender: '',
          employeeChildrenBirthday: null
        }
        this.employeeChildren = newEmployeeChildren
        this.drawerEmployeeChildrenForm = true
      }
    },
    onEditEmployeeChildren(employeeChildren: EmployeeChildrenInterface) {
      this.employeeChildren = { ...employeeChildren }
      this.drawerEmployeeChildrenForm = true
    },
    onDeleteEmployeeChildren(employeeChildren: EmployeeChildrenInterface) {
      this.employeeChildren = { ...employeeChildren }
      this.drawerEmployeeChildrenDelete = true
    },
    onCancelEmployeeChildrenDelete() {
      this.drawerEmployeeChildrenDelete = false
    },
    async confirmDeleteEmployeeChildren() {
      if (this.employeeChildren) {
        this.drawerEmployeeChildrenDelete = false
        const employeeChildrenService = new EmployeeChildrenService()
        const employeeChildrenResponse = await employeeChildrenService.delete(this.employeeChildren)

        if (employeeChildrenResponse.status === 201) {
          const index = this.employeeChildrenList.findIndex((employeeChildren: EmployeeChildrenInterface) => employeeChildren.employeeChildrenId === this.employeeChildren?.employeeChildrenId)
          if (index !== -1) {
            this.employeeChildrenList.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: this.t('delete_employee_children'),
            detail: employeeChildrenResponse._data.message,
            life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: this.t('delete_employee_children'),
            detail: employeeChildrenResponse._data.message,
            life: 5000,
          })
        }
      }
    },
    onSaveChildren(employeeChildren: EmployeeChildrenInterface) {
      this.employeeChildren = { ...employeeChildren }
      const index = this.employeeChildrenList.findIndex((a: EmployeeChildrenInterface) => a.employeeChildrenId === this.employeeChildren?.employeeChildrenId)
      if (index !== -1) {
        this.employeeChildrenList[index] = employeeChildren
        this.$forceUpdate()
      } else {
        this.employeeChildrenList.push(employeeChildren)
        this.$forceUpdate()
      }
      this.drawerEmployeeChildrenForm = false
    },

    // Métodos para condiciones médicas
    async loadEmployeeMedicalConditions() {
      if (this.employee.employeeId) {
        const employeeMedicalConditionService = new EmployeeMedicalConditionService()
        this.employeeMedicalConditionsList = await employeeMedicalConditionService.getByEmployee(this.employee.employeeId)
      }
    },
    addNewMedicalCondition() {
      if (this.employee.employeeId) {
        const newEmployeeMedicalCondition: EmployeeMedicalConditionInterface = {
          employeeMedicalConditionId: null,
          employeeId: this.employee.employeeId,
          medicalConditionTypeId: 0,
          employeeMedicalConditionDiagnosis: '',
          employeeMedicalConditionTreatment: '',
          employeeMedicalConditionNotes: '',
          employeeMedicalConditionActive: 1,
          propertyValues: []
        }
        this.employeeMedicalCondition = newEmployeeMedicalCondition
        this.drawerEmployeeMedicalConditionForm = true
      }
    },
    onEditEmployeeMedicalCondition(employeeMedicalCondition: EmployeeMedicalConditionInterface) {
      this.employeeMedicalCondition = { ...employeeMedicalCondition }
      this.drawerEmployeeMedicalConditionForm = true
    },
    onDeleteEmployeeMedicalCondition(employeeMedicalCondition: EmployeeMedicalConditionInterface) {
      this.employeeMedicalCondition = { ...employeeMedicalCondition }
      this.drawerEmployeeMedicalConditionDelete = true
    },
    onCancelEmployeeMedicalConditionDelete() {
      this.drawerEmployeeMedicalConditionDelete = false
    },
    async confirmDeleteEmployeeMedicalCondition() {
      if (this.employeeMedicalCondition) {
        this.drawerEmployeeMedicalConditionDelete = false
        const employeeMedicalConditionService = new EmployeeMedicalConditionService()
        const employeeMedicalConditionResponse = await employeeMedicalConditionService.delete(this.employeeMedicalCondition)

        if (employeeMedicalConditionResponse.status === 200) {
          this.$toast.add({
            severity: 'success',
            summary: this.t('delete_employee_medical_condition'),
            detail: employeeMedicalConditionResponse._data.message,
            life: 5000,
          })
          // Recargar la lista completa para evitar cuadros vacíos
          await this.loadEmployeeMedicalConditions()
        } else {
          const severityType = employeeMedicalConditionResponse.status === 500 ? 'error' : 'warn'
          const msgError = employeeMedicalConditionResponse._data.error ? employeeMedicalConditionResponse._data.error : employeeMedicalConditionResponse._data.message
          this.$toast.add({
            severity: severityType,
            summary: this.t('delete_employee_medical_condition'),
            detail: msgError,
            life: 5000,
          })
        }
      }
    },
    async onSaveMedicalCondition(employeeMedicalCondition: EmployeeMedicalConditionInterface) {
      this.employeeMedicalCondition = { ...employeeMedicalCondition }
      const index = this.employeeMedicalConditionsList.findIndex((a: EmployeeMedicalConditionInterface) =>
        a.employeeMedicalConditionId === this.employeeMedicalCondition?.employeeMedicalConditionId)
      if (index !== -1) {
        this.employeeMedicalConditionsList[index] = employeeMedicalCondition
        this.$forceUpdate()
      } else {
        this.employeeMedicalConditionsList.push(employeeMedicalCondition)
        this.$forceUpdate()
      }
      this.drawerEmployeeMedicalConditionForm = false

      // Recargar la lista completa para evitar cuadros vacíos
      await this.loadEmployeeMedicalConditions()
    }
  }
})
