import type { CustomerInterface } from "~/resources/scripts/interfaces/CustomerInterface";
import type { PeopleInterface } from "~/resources/scripts/interfaces/PeopleInterface";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import CustomerService from "~/resources/scripts/services/CustomerService";
import { useMyGeneralStore } from "~/store/general";
export default defineComponent({
  name: 'Customers',
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
  props: {},
  data: () => ({
    search: '' as string,
    filteredCustomers: [] as CustomerInterface[],
    customer: null as CustomerInterface | null,
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 50,
    drawerCustomerForm: false,
    drawerCustomerPhotoForm: false,
    drawerCustomerDelete: false,
    drawerCustomerSync: false,
    canCreate: false,
    canUpdate: false,
    canDelete: false
  }),
  computed: {},
  created() { },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    const systemModuleSlug = this.$route.path.toString().replaceAll('/', '')
    const permissions = await myGeneralStore.getAccess(systemModuleSlug)
    if (myGeneralStore.isRoot) {
      this.canCreate = true
      this.canUpdate = true
      this.canDelete = true
    } else {
      this.canCreate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'create') ? true : false
      this.canUpdate = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'update') ? true : false
      this.canDelete = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'delete') ? true : false
    }
    myGeneralStore.setFullLoader(false)
    this.handlerSearchCustomer();
  },
  methods: {
    async handlerSearchCustomer() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new CustomerService().getFilteredList(this.search, this.currentPage, this.rowsPerPage);
      const list = response.status === 200 ? response._data.data.customers.data : [];
      this.totalRecords = response.status === 200 ? response._data.data.customers.meta.total : 0;
      this.first = response.status === 200 ? response._data.data.customers.meta.first_page : 0;
      this.filteredCustomers = list;
      myGeneralStore.setFullLoader(false)
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1;
      this.rowsPerPage = event.rows;
      this.handlerSearchCustomer();
    },
    addNew() {
      const person: PeopleInterface = {
        personId: null,
        personFirstname: "",
        personLastname: "",
        personSecondLastname: "",
        personGender: "",
        personBirthday: null,
        personCurp: null,
        personPhone: "",
        personRfc: null,
        personImssNss: null,
        personCreatedAt: new Date(),
        personUpdatedAt: new Date(),
        personDeletedAt: null,
        personEmail: null,
        personPhoneSecondary: null,
        personMaritalStatus: null,
        personPlaceOfBirthCountry: null,
        personPlaceOfBirthState: null,
        personPlaceOfBirthCity: null
      }
      const newCustomer: CustomerInterface = {
        customerId: null,
        customerUuid: null,
        personId: 0,
        person: person,
        customerCreatedAt: new Date(),
        customerUpdatedAt: new Date(),
        customerDeletedAt: null
      }
      this.customer = newCustomer
      this.drawerCustomerForm = true
    },
    onEdit(customer: CustomerInterface) {
      this.customer = { ...customer };
      this.drawerCustomerForm = true;
    },
    onDelete(customer: CustomerInterface) {
      this.customer = { ...customer };
      this.drawerCustomerDelete = true;
    },
    async confirmDelete() {
      if (this.customer) {
        this.drawerCustomerDelete = false;
        const customerService = new CustomerService();
        const customerResponse = await customerService.delete(this.customer);
        if (customerResponse.status === 200) {
          const index = this.filteredCustomers.findIndex((customer: CustomerInterface) => customer.customerId === this.customer?.customerId);
          if (index !== -1) {
            this.filteredCustomers.splice(index, 1);
            this.$forceUpdate();
          }
          this.$toast.add({
            severity: 'success',
            summary: `${this.t('delete')} ${this.t('customer')}`,
            detail: customerResponse._data.message,
            life: 5000,
          });
        } else {
          this.$toast.add({
            severity: 'error',
            summary: `${this.t('delete')} ${this.t('customer')}`,
            detail: customerResponse._data.message,
            life: 5000,
          });
        }
      }
    },
    onSave(customer: CustomerInterface) {
      this.customer = { ...customer };
      const index = this.filteredCustomers.findIndex((s: CustomerInterface) => s.customerId === this.customer?.customerId);
      if (index !== -1) {
        this.filteredCustomers[index] = customer;
        this.$forceUpdate();
      } else {
        this.filteredCustomers.push(customer);
        this.$forceUpdate();
      }
      this.drawerCustomerForm = false;
      this.drawerCustomerPhotoForm = false;
    },
  }
});
