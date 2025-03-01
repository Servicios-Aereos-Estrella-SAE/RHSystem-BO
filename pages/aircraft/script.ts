import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface';
import AircraftService from '../../resources/scripts/services/AircraftService';
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface';
import { useMyGeneralStore } from '~/store/general';
import type { AircraftMaintenanceInterface } from '~/resources/scripts/interfaces/AircraftMaintenanceInterface';
import type { MaintenanceExpenseInterface } from '~/resources/scripts/interfaces/MaintenanceExpenseInterface';
import { v4 as uuidv4 } from 'uuid';

export default defineComponent({
  name: 'Aircrafts',
  props: {},
  data: () => ({
    date: new Date(),
    filterAircrafts: [] as AircraftInterface[],
    aircraft: null as AircraftInterface | null,
    search: '',
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    rowsPerPage: 20,
    randInfo: Math.random(),
    drawerMaintenanceExpense: false,
    aircraftService: new AircraftService(),
    drawerAircraftForm: false,
    drawerAircraftDelete: false,
    drawerAircraftFormGallery: false,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    aircraftMaintenance: null as AircraftMaintenanceInterface | null,
    maintenanceExpense: null as MaintenanceExpenseInterface | null,
    drawerProceedingFiles: false as boolean,
    drawerMaintenance: false as boolean,
    drawerMaintenanceForm: false as boolean
  }),
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
    await this.handlerSearchAircraft()
  },

  methods: {
    addNew() {
      const newAircraft: AircraftInterface = {
        aircraftId: null,
        aircraftRegistrationNumber: '',
        aircraftSerialNumber: '',
        airportId: null,
        aircraftPropertiesId: null,
        aircraftCreatedAt: new Date(),
        aircraftUpdatedAt: new Date(),
        aircraftOperator: null,
        aircraftDeletedAt: null,
        aircraftOperatorId: null,
        aircraftProperty: null,
        reservations: [],
        pilots: [],
        aircraftActive: 1
      }
      this.aircraft = newAircraft;
      this.drawerAircraftForm = true;
    },
    async handlerSearchAircraft() {
      const response = await this.aircraftService.getFilteredList(this.search, this.currentPage, this.rowsPerPage);
      const list = response.status === 200 ? response._data.data.data : [];
      this.totalRecords = response.status === 200 ? response._data.data.meta.total : 0;
      this.first = response.status === 200 ? response._data.data.meta.first_page : 0;
      this.filterAircrafts = list;
    },
    clearSearch() {
      this.search = '';
      this.handlerSearchAircraft();
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1;
      this.rowsPerPage = event.rows;
      this.handlerSearchAircraft();
    },
    onSave(aircraft: AircraftInterface) {
      this.aircraft = { ...aircraft };
      const index = this.filterAircrafts.findIndex((a: AircraftInterface) => a.aircraftId === this.aircraft?.aircraftId);
      if (index !== -1) {
        this.filterAircrafts[index] = aircraft;
        this.$forceUpdate();
      } else {
        this.filterAircrafts.push(aircraft);
        this.$forceUpdate();
      }
      this.drawerAircraftForm = false;
    },
    onSaveGallery() {
    },
    onDelete(aircraft: AircraftInterface) {
      this.aircraft = { ...aircraft };
      this.drawerAircraftDelete = true;
    },
    onEdit(aircraft: AircraftInterface) {
      this.aircraft = { ...aircraft };
      this.drawerAircraftForm = true;
    },
    onGallery(aircraft: AircraftInterface) {
      if (!aircraft) {
        console.error('No aircraft provided');
        return;
      }
      this.aircraft = { ...aircraft };
      this.drawerAircraftFormGallery = true;
    },
    async confirmDelete() {
      if (this.aircraft) {
        this.drawerAircraftDelete = false;
        const aircraftResponse = await this.aircraftService.delete(this.aircraft);
        if (aircraftResponse.status === 201 || aircraftResponse.status === 200) {
          const index = this.filterAircrafts.findIndex((aircraft: AircraftInterface) => aircraft.aircraftId === this.aircraft?.aircraftId);
          if (index !== -1) {
            this.filterAircrafts.splice(index, 1);
            this.$forceUpdate();
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete aircraft',
            detail: aircraftResponse._data.message,
            life: 5000,
          });
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete aircraft',
            detail: aircraftResponse._data.message,
            life: 5000,
          });
        }
      }
    },
    editMaintenance(aircraftMaintenance: AircraftMaintenanceInterface) {
      this.drawerMaintenanceForm = true;
      this.aircraftMaintenance = { ...aircraftMaintenance } as AircraftMaintenanceInterface;
    },
    addNewMaintenanceExpense(maintenance: AircraftMaintenanceInterface) {
      console.info('maintenance', maintenance);
      const newMaintenanceExpense = {
        maintenanceExpenseId: null,
        aircraftMaintenanceId: maintenance.aircraftMaintenanceId,
        maintenanceExpenseAmount: 0,
        maintenanceExpenseTrackingNumber: '',
        maintenanceExpenseTicket: null,
        maintenanceExpenseInternalFolio: uuidv4().substring(0, 8),
        maintenanceExpenseCategoryId: 0,
        maintenanceExpenseCreatedAt: new Date(),
        maintenanceExpenseUpdatedAt: new Date(),
        maintenanceExpenseDeletedAt: null
      } as MaintenanceExpenseInterface;
      this.maintenanceExpense = newMaintenanceExpense;
      this.drawerMaintenanceExpense = true;
    },
    editMaintenanceExpense(maintenanceExpense: MaintenanceExpenseInterface) {
      this.drawerMaintenanceExpense = true;
      this.maintenanceExpense = { ...maintenanceExpense };
    },
    addNewMaintenance(aircraft: AircraftInterface) {
      // this.drawerMaintenance = false;
      let currentDayMoreSeven = new Date();
      currentDayMoreSeven.setDate(currentDayMoreSeven.getDate() + 7);

      const newAircraftMaintenance = {
        aircraftMaintenanceId: null,
        aircraftId: aircraft?.aircraftId ?? 0,
        maintenanceTypeId: 0,
        aircraftMaintenanceStartDate: new Date(),
        aircraftMaintenanceEndDate: currentDayMoreSeven,
        maintenanceUrgencyLevelId: 1,
        aircraftMaintenanceStatusId: 2,
        aircraftMaintenanceNotes: '',
        aircraftMaintenanceCreatedAt: new Date(),
        aircraftMaintenanceUpdatedAt: new Date(),
        aircraftMaintenanceDeletedAt: null
      } as AircraftMaintenanceInterface;
      this.aircraftMaintenance = newAircraftMaintenance;
      this.drawerMaintenanceForm = true;
    },
    saveAircraftMaintenance(aircraftMaintenance: AircraftMaintenanceInterface) {
      this.drawerMaintenanceForm = false;
      this.drawerMaintenance = true;
      this.randInfo = Math.random();
      console.info('aircraftMaintenance', aircraftMaintenance);
    },
    saveMaintenanceExpense(maintenanceExpense: MaintenanceExpenseInterface) {
      this.drawerMaintenanceExpense = false;
      console.info('maintenanceExpense', maintenanceExpense);
      this.randInfo = Math.random();
    },
    handlerOpenProceedingFiles(aircraft: AircraftInterface) {
      if (!aircraft) {
        console.error('No aircraft provided');
        return;
      }
      this.aircraft = { ...aircraft };
      this.drawerProceedingFiles = true;
    },
    handlerOpenMaintenance(aircraft: AircraftInterface) {
      if (!aircraft) {
        console.error('No aircraft provided');
        return;
      }
      this.aircraft = { ...aircraft };
      this.drawerMaintenance = true;
    }
  },
});
