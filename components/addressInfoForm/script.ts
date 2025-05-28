import type { AddressInterface } from "~/resources/scripts/interfaces/AddressInterface";
import type { AddressTypeInterface } from "~/resources/scripts/interfaces/AddressTypeInterface";
import type { CitySearchInterface } from "~/resources/scripts/interfaces/CitySearchInterface";
import type { CountrySearchInterface } from "~/resources/scripts/interfaces/CountrySearchInterface";
import type { EmployeeInterface } from "~/resources/scripts/interfaces/EmployeeInterface";
import type { StateSearchInterface } from "~/resources/scripts/interfaces/StateSearchInterface";
import AddressService from "~/resources/scripts/services/AddressService";
import AddressTypeService from "~/resources/scripts/services/AddressTypeService";
import { useMyGeneralStore } from "~/store/general";

export default defineComponent({

  name: 'AddressInfoForm',
  props: {
    employee: { type: Object as PropType<EmployeeInterface>, required: true },
    address: { type: Object as PropType<AddressInterface>, required: true },
    clickOnSave: { type: Function, default: null },

  },
  data: () => ({
    submitted: false,
    addressTypes: [] as AddressTypeInterface[],
    filteredCountries: [] as CountrySearchInterface[],
    filteredStates: [] as StateSearchInterface[],
    filteredCities: [] as CitySearchInterface[],
    selectCountry: '',
    selectState: '',
    selectCity: '',
    canManageUserResponsible: false
  }),
  computed: {
  },
  watch: {
  },
  async mounted() {
    if (this.address?.addressCountry) {
      this.selectCountry = this.address.addressCountry
    }
    if (this.address?.addressState) {
      this.selectState = this.address?.addressState
    }
    if (this.address?.addressCity) {
      this.selectCity = this.address?.addressCity
    }
    await this.getAddressTypes()
    const myGeneralStore = useMyGeneralStore()
    const employeeId = this.employee.employeeId ? this.employee.employeeId : 0
    this.canManageUserResponsible = await myGeneralStore.canManageUserResponsibleEmployee(employeeId)
  },
  methods: {
    async getAddressTypes() {
      let response = null
      const addressTypeService = new AddressTypeService()
      response = await addressTypeService.getFilteredList('')
      this.addressTypes = response._data.data.addressTypes.data
    },
    async handlerSearchCountries(event: any) {
      if (event.query.trim().length) {
        const response = await new AddressService().getPlaces(event.query.trim(), 'countries')
        const list = response.status === 200 ? response._data.data.places : []
        this.filteredCountries = list
      }
    },
    async handlerSearchStates(event: any) {
      if (event.query.trim().length) {
        const response = await new AddressService().getPlaces(event.query.trim(), 'states')
        const list = response.status === 200 ? response._data.data.places : []
        this.filteredStates = list
      }
    },
    async handlerSearchCities(event: any) {
      if (event.query.trim().length) {
        const response = await new AddressService().getPlaces(event.query.trim(), 'cities')
        const list = response.status === 200 ? response._data.data.places : []
        this.filteredCities = list
      }
    },
    async onSave() {
      this.submitted = true;
      if (typeof this.selectCountry === 'string' && this.selectCountry.trim() !== '') {
        this.address.addressCountry = this.selectCountry
      }
      if (typeof this.selectState === 'string' && this.selectState.trim() !== '') {
        this.address.addressState = this.selectState
      }
      if (typeof this.selectCity === 'string' && this.selectCity.trim() !== '') {
        this.address.addressCity = this.selectCity
      }
      if (!this.address.addressCountry || !this.address.addressState || !this.address.addressCity || !this.address.addressTownship || !this.address.addressZipcode || !this.address.addressSettlement || !this.address.addressStreet || !this.address.addressTypeId || !this.address.addressExternalNumber) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }
      const addressService = new AddressService()

      const response = this.address.addressId ? await addressService.update(this.address) : await addressService.create(this.address)
      if (response.status === 200 || response.status === 201) {
        this.$toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Address saved successfully',
          life: 5000
        });
        const address = response._data.data.address
        this.$emit('save', address as AddressInterface)
        this.$emit('save-success');
      } else {
        this.$toast.add({
          severity: 'warn',
          summary: 'Error',
          detail: response._data.error,
          life: 5000
        });
        this.$emit('save-error');
      }
    },
    onCountrySelect(selectedOption: any) {
      if (this.address) {
        this.address.addressCountry = selectedOption.value.addressCountry
      }
    },
    onStateSelect(selectedOption: any) {
      if (this.address) {
        this.address.addressState = selectedOption.value.addressState
      }
    },
    onCitySelect(selectedOption: any) {
      if (this.address) {
        this.address.addressCity = selectedOption.value.addressCity
      }
    }
  }
});
