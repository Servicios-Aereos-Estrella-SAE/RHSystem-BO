import type { AircraftPropertyInterface } from "~/resources/scripts/interfaces/AircraftPropertyInterface";
import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface";
import AircraftPropertyService from "~/resources/scripts/services/AircraftPropertyService";
import { useMyGeneralStore } from "~/store/general";


export default defineComponent({
  name: 'AircraftProperty',
  props: {},
  data: () => ({
    search: '' as string,
    filteredAircraftProperties: [] as AircraftPropertyInterface[],
    aircraftProperty: null as AircraftPropertyInterface | null,
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 30,
    drawerAircraftPropertyForm: false,
    drawerAircraftPropertyDelete: false,
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
    this.handlerSearchAircraftProperty();
  },
  methods: {
    async handlerSearchAircraftProperty() {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      const response = await new AircraftPropertyService().getFilteredList(this.search, this.currentPage, this.rowsPerPage);
      const list = response.status === 200 ? response._data.data.data : [];
      this.totalRecords = response.status === 200 ? response._data.data.meta.total : 0;
      this.first = response.status === 200 ? response._data.data.meta.first_page : 0;
      this.filteredAircraftProperties = list;
      myGeneralStore.setFullLoader(false)
    },
    onPageChange(event: any) {
      this.currentPage = event.page + 1;
      this.rowsPerPage = event.rows;
      this.handlerSearchAircraftProperty();
    },
    addNew() {
      const newAircraftProperty: AircraftPropertyInterface = {
        aircraftPropertiesId: null,
        aircraftPropertiesName: '',
        aircraftClassId: null,
        aircraftPropertiesPax: 0,
        aircraftPropertiesSpeed: 0,
        aircraftPropertiesMaxKg: 0,
        aircraftPropertiesAutonomy: 0,
        aircraftPropertiesAutonomyHours: 0,
        aircraftPropertiesLandingCostNational: 0,
        aircraftPropertiesOvernightStayInternational: 0,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
        aircraftPropertyBanner: undefined,
        aircraftPropertiesHourlyRate: 0,
        aircraftPropertiesLandingCostBase: 0,
        aircraftPropertiesLandingCostInternational: 0,
        aircraftPropertiesOvernightStayLocal: 0,
        aircraftPropertiesFuelSurcharge: 0,
        aircraftPropertiesDescription: ""
      }
      this.aircraftProperty = newAircraftProperty
      this.drawerAircraftPropertyForm = true
    },
    onEdit(aircraftProperty: AircraftPropertyInterface) {
      this.aircraftProperty = { ...aircraftProperty,
        aircraftPropertiesHourlyRate: Number(aircraftProperty.aircraftPropertiesHourlyRate),
        aircraftPropertiesLandingCostBase: Number(aircraftProperty.aircraftPropertiesLandingCostBase),
        aircraftPropertiesLandingCostNational: Number(aircraftProperty.aircraftPropertiesLandingCostNational),
        aircraftPropertiesLandingCostInternational: Number(aircraftProperty.aircraftPropertiesLandingCostInternational),
        aircraftPropertiesOvernightStayLocal: Number(aircraftProperty.aircraftPropertiesOvernightStayLocal),
        aircraftPropertiesOvernightStayInternational: Number(aircraftProperty.aircraftPropertiesOvernightStayInternational),
        aircraftPropertiesFuelSurcharge: Number(aircraftProperty.aircraftPropertiesFuelSurcharge),

       };
      this.drawerAircraftPropertyForm = true;
    },
    onDelete(aircraftProperty: AircraftPropertyInterface) {
      this.aircraftProperty = { ...aircraftProperty };
      this.drawerAircraftPropertyDelete = true;
    },
    async confirmDelete() {
      if (this.aircraftProperty) {
        this.drawerAircraftPropertyDelete = false;
        const aircraftPropertyService = new AircraftPropertyService();
        const aircraftPropertyResponse = await aircraftPropertyService.delete(this.aircraftProperty);
        if (aircraftPropertyResponse.status === 200) {
          const index = this.filteredAircraftProperties.findIndex((ap: AircraftPropertyInterface) => ap.aircraftPropertiesId === this.aircraftProperty?.aircraftPropertiesId);
          if (index !== -1) {
            this.filteredAircraftProperties.splice(index, 1);
            this.$forceUpdate();
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete aircraft property',
            detail: aircraftPropertyResponse._data.message,
            life: 5000,
          });
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete aircraft property',
            detail: aircraftPropertyResponse._data.message,
            life: 5000,
          });
        }
      }
    },
    onSave(aircraftProperty: AircraftPropertyInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.aircraftProperty = { ...aircraftProperty };
      const index = this.filteredAircraftProperties.findIndex((ap: AircraftPropertyInterface) => ap.aircraftPropertiesId === this.aircraftProperty?.aircraftPropertiesId);
      if (index !== -1) {
        this.filteredAircraftProperties[index] = aircraftProperty;
        this.$forceUpdate();
        myGeneralStore.setFullLoader(false)
      } else {
        this.filteredAircraftProperties.push(aircraftProperty);
        this.$forceUpdate();
        myGeneralStore.setFullLoader(false)
      }
      
      myGeneralStore.setFullLoader(false)
      this.drawerAircraftPropertyForm = false;
    }
  }
});
