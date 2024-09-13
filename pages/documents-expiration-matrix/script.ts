import { DateTime } from "luxon";
import type { ProceedingFileInterface } from "~/resources/scripts/interfaces/ProceedingFileInterface";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import CustomerProceedingFileService from "~/resources/scripts/services/CustomerProceedingFileService";
import EmployeeProceedingFileService from "~/resources/scripts/services/EmployeeProceedingFileService";
import FlightAttendantProceedingFileService from "~/resources/scripts/services/FlightAttendantProceedingFileService";
import PilotProceedingFileService from "~/resources/scripts/services/PilotProceedingFileService";
import { useMyGeneralStore } from "~/store/general";

export default defineComponent({
  name: 'DocumentsExpirationMatrix',
  props: {},
  data: () => ({
    employeeProceedingFiles: [] as Array<ProceedingFileInterface>,
    pilotProceedingFiles: [] as Array<ProceedingFileInterface>,
    customerProceedingFiles: [] as Array<ProceedingFileInterface>,
    flightAttendantProceedingFiles: [] as Array<ProceedingFileInterface>,
    canReadEmployees: false,
    canReadPilots: false,
    canReadCustomers: false,
    canReadFlightAttendant: false,
    // carousel settings
    settings: {
      itemsToShow: 3,
      snapAlign: 'start',
    },
    tabActive: '',
    // breakpoints are mobile first
    // any settings not specified will fallback to the carousel settings
    breakpoints: {
      // 700px and up
      300: {
        itemsToShow: 1,
        snapAlign: 'start',
      },
      500: {
        itemsToShow: 2,
        snapAlign: 'start',
      },
      700: {
        itemsToShow: 2.4,
        snapAlign: 'start',
      },
      // 1024 and up
      1024: {
        itemsToShow: 3,
        snapAlign: 'start',
      },
      2084: {
        itemsToShow: 6,
        snapAlign: 'start',
      },
    },
  }),
  computed: {
    getProceedingFiles() {
      switch (this.tabActive) {
        case 'employees':
          return this.employeeProceedingFiles;
        case 'pilots':
          return this.pilotProceedingFiles;
        case 'customers':
          return this.customerProceedingFiles;
        case 'flight-attendant':
          return this.flightAttendantProceedingFiles;
        default:
          return [];
      }
    }
  },
  created() { },
  async mounted() {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getEmployeeProceedingFiles()
    await this.getPilotProceedingFiles()
    await this.getCustomerProceedingFiles()
    await this.getFlightAttendantProceedingFiles()
    myGeneralStore.setFullLoader(false)
  },
  methods: {
    setActive(tab: string) {
      this.tabActive = tab
    },
    async getEmployeeProceedingFiles() {
      const myGeneralStore = useMyGeneralStore()
      const permissions = await myGeneralStore.getAccess('employees')
      if (myGeneralStore.isRoot) {
        this.canReadEmployees = true
      } else {
        this.canReadEmployees = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read') ? true : false
      }
      const employeeProceedingFileService = new EmployeeProceedingFileService()
      const dateNow = DateTime.now().toFormat('yyyy-LL-dd')
      const employeeProceedingFileResponse = await employeeProceedingFileService.getExpiresAndExpiring('2024-01-01', dateNow)
      if (employeeProceedingFileResponse.status === 200) {
        if (employeeProceedingFileResponse._data.data.employeeProceedingFiles) {
          const proceedingFilesExpired = employeeProceedingFileResponse._data.data.employeeProceedingFiles.proceedingFilesExpired
          for await (const file of proceedingFilesExpired) {
            this.employeeProceedingFiles.push(file)
          }
          const proceedingFilesExpiring = employeeProceedingFileResponse._data.data.employeeProceedingFiles.proceedingFilesExpiring
          for await (const file of proceedingFilesExpiring) {
            this.employeeProceedingFiles.push(file)
          }
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Employee proceeding files',
          detail: employeeProceedingFileResponse._data.message,
          life: 5000,
        });
      }
    },
    async getPilotProceedingFiles() {
      const myGeneralStore = useMyGeneralStore()
      const permissions = await myGeneralStore.getAccess('pilots')
      if (myGeneralStore.isRoot) {
        this.canReadPilots = true
      } else {
        this.canReadPilots = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read') ? true : false
      }
      this.pilotProceedingFiles = []
      const pilotProceedingFileService = new PilotProceedingFileService()
      const dateNow = DateTime.now().toFormat('yyyy-LL-dd')
      const pilotProceedingFileResponse = await pilotProceedingFileService.getExpiresAndExpiring('2024-01-01', dateNow)
      if (pilotProceedingFileResponse.status === 200) {
        if (pilotProceedingFileResponse._data.data.pilotProceedingFiles) {
          const proceedingFilesExpired = pilotProceedingFileResponse._data.data.pilotProceedingFiles.proceedingFilesExpired
          for await (const file of proceedingFilesExpired) {
            this.pilotProceedingFiles.push(file)
          }
          const proceedingFilesExpiring = pilotProceedingFileResponse._data.data.pilotProceedingFiles.proceedingFilesExpiring
          for await (const file of proceedingFilesExpiring) {
            this.pilotProceedingFiles.push(file)
          }
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Pilot proceeding files',
          detail: pilotProceedingFileResponse._data.message,
          life: 5000,
        });
      }
    },
    async getCustomerProceedingFiles() {
      const myGeneralStore = useMyGeneralStore()
      const permissions = await myGeneralStore.getAccess('customers')
      if (myGeneralStore.isRoot) {
        this.canReadCustomers = true
      } else {
        this.canReadCustomers = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read') ? true : false
      }
      this.customerProceedingFiles = []
      const customerProceedingFileService = new CustomerProceedingFileService()
      const dateNow = DateTime.now().toFormat('yyyy-LL-dd')
      const customerProceedingFileResponse = await customerProceedingFileService.getExpiresAndExpiring('2024-01-01', dateNow)
      if (customerProceedingFileResponse.status === 200) {
        if (customerProceedingFileResponse._data.data.customerProceedingFiles) {
          const proceedingFilesExpired = customerProceedingFileResponse._data.data.customerProceedingFiles.proceedingFilesExpired
          for await (const file of proceedingFilesExpired) {
            this.customerProceedingFiles.push(file)
          }
          const proceedingFilesExpiring = customerProceedingFileResponse._data.data.customerProceedingFiles.proceedingFilesExpiring
          for await (const file of proceedingFilesExpiring) {
            this.customerProceedingFiles.push(file)
          }
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Customer proceeding files',
          detail: customerProceedingFileResponse._data.message,
          life: 5000,
        });
      }
    },
    async getFlightAttendantProceedingFiles() {
      const myGeneralStore = useMyGeneralStore()
      const permissions = await myGeneralStore.getAccess('flight-attendants')
      if (myGeneralStore.isRoot) {
        this.canReadFlightAttendant = true
      } else {
        this.canReadFlightAttendant = permissions.find((a: RoleSystemPermissionInterface) => a.systemPermissions && a.systemPermissions.systemPermissionSlug === 'read') ? true : false
      }
      this.flightAttendantProceedingFiles = []
      const flightAttendantProceedingFileService = new FlightAttendantProceedingFileService()
      const dateNow = DateTime.now().toFormat('yyyy-LL-dd')
      const flightAttendantProceedingFileResponse = await flightAttendantProceedingFileService.getExpiresAndExpiring('2024-01-01', dateNow)
      if (flightAttendantProceedingFileResponse.status === 200) {
        if (flightAttendantProceedingFileResponse._data.data.flightAttendantProceedingFiles) {
          const proceedingFilesExpired = flightAttendantProceedingFileResponse._data.data.flightAttendantProceedingFiles.proceedingFilesExpired
          for await (const file of proceedingFilesExpired) {
            this.flightAttendantProceedingFiles.push(file)
          }
          const proceedingFilesExpiring = flightAttendantProceedingFileResponse._data.data.flightAttendantProceedingFiles.proceedingFilesExpiring
          for await (const file of proceedingFilesExpiring) {
            this.flightAttendantProceedingFiles.push(file)
          }
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'Flight attendant proceeding files',
          detail: flightAttendantProceedingFileResponse._data.message,
          life: 5000,
        });
      }
    },
  },
})
