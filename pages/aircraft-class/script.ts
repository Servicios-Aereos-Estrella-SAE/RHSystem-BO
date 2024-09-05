import type { AircraftClassInterface } from "~/resources/scripts/interfaces/AircraftClassInterface";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import AircraftClassService from "~/resources/scripts/services/AircraftClassService";
import { useMyGeneralStore } from "~/store/general";

export default defineComponent({
  name: 'AircraftClass',
  props: {},
  data: () => ({
    search: '' as string,
    filteredAircraftClasses: [] as AircraftClassInterface[],
    aircraftClass: null as AircraftClassInterface | null,
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 30,
    drawerAircraftClassForm: false,
    drawerAircraftClassDelete: false,
    canCreate: false,
    canUpdate: false,
    canDelete: false
  }),
  computed: {},
  created() {},
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
    this.handlerSearchAircraftClass();
  },
  methods: {
    async handlerSearchAircraftClass() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new AircraftClassService().getFilteredList(this.search, this.currentPage, this.rowsPerPage);
      const list = response.status === 200 ? response._data.data.data : [];
      this.totalRecords = response.status === 200 ? response._data.data.meta.total : 0;
      this.first = response.status === 200 ? response._data.data.meta.first_page : 0;
      this.filteredAircraftClasses = list;
      myGeneralStore.setFullLoader(false)
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1;
      this.rowsPerPage = event.rows;
      this.handlerSearchAircraftClass();
    },
    addNew() {
      const newAircraftClass: AircraftClassInterface = {
        aircraftClassId: null,
        aircraftClassName: '',
        aircraftClassBanner: '',
        aircraftClassLongDescription: '',
        aircraftClassShortDescription: '',
        aircraftClassSlug: '',
        aircraftClassStatus: 1,
        createdAt: null,
        updatedAt: null,
        deletedAt: null
      }
      this.aircraftClass = newAircraftClass
      this.drawerAircraftClassForm = true
    },
    onEdit(aircraftClass: AircraftClassInterface) {
      this.aircraftClass = { ...aircraftClass };
      this.drawerAircraftClassForm = true;
    },
    onDelete(aircraftClass: AircraftClassInterface) {
      this.aircraftClass = { ...aircraftClass };
      this.drawerAircraftClassDelete = true;
    },
    async confirmDelete() {
      if (this.aircraftClass) {
        this.drawerAircraftClassDelete = false;
        const aircraftClassService = new AircraftClassService();
        const aircraftClassResponse = await aircraftClassService.delete(this.aircraftClass);
        if (aircraftClassResponse.status === 200) {
          const index = this.filteredAircraftClasses.findIndex((ac: AircraftClassInterface) => ac.aircraftClassId === this.aircraftClass?.aircraftClassId);
          if (index !== -1) {
            this.filteredAircraftClasses.splice(index, 1);
            this.$forceUpdate();
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete aircraft class',
            detail: aircraftClassResponse._data.message,
            life: 5000,
          });
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete aircraft class',
            detail: aircraftClassResponse._data.message,
            life: 5000,
          });
        }
      }
    },
    onSave(aircraftClass: AircraftClassInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.aircraftClass = { ...aircraftClass };
      const index = this.filteredAircraftClasses.findIndex((ac: AircraftClassInterface) => ac.aircraftClassId === this.aircraftClass?.aircraftClassId);
      if (index !== -1) {
        this.filteredAircraftClasses[index] = aircraftClass;
        this.$forceUpdate();
        myGeneralStore.setFullLoader(false)
      } else {
        this.filteredAircraftClasses.push(aircraftClass);
        this.$forceUpdate();
        myGeneralStore.setFullLoader(false)
      }
      myGeneralStore.setFullLoader(false)
      this.drawerAircraftClassForm = false;
    }
  }
});
