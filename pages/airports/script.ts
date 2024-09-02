import { useMyGeneralStore } from '~/store/general';
import AirportService from '../../resources/scripts/services/AirportService';
import type { AirportInterface } from '~/resources/scripts/interfaces/AirportInterface';
import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface';

export default defineComponent({
    name: 'Airports',
    props: {},
    data: () => ({
        date: new Date(),
        filterAirports: [] as AirportInterface[],
        airport: null as AirportInterface | null,
        search: '',
        currentPage: 1,
        totalRecords: 0,
        first: 0,
        rowsPerPage: 20,
        airportService: new AirportService(),
        drawerAirportForm: false,
        drawerAirportDelete: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false
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
        await this.handlerSearchAirport()
    },
    methods: {
        addNew() {
            const newAirport: AirportInterface = {
                airportId: null,
                airportType: '', 
                airportName: '',
                airportLatitudeDeg: 0, 
                airportLongitudeDeg: 0, 
                airportElevationFt: null, 
                airportDisplayLocationName: '',
                airportIsoCountry: '',
                airportIsoRegion: '',
                airportActive: 1, 
                airportIcaoCode: null,
                airportIataCode: null, 
                airportCreatedAt: new Date(),
                airportUpdatedAt: new Date(),
                airportDeletedAt: null
                
            }
            this.airport = newAirport
            this.drawerAirportForm = true
        },
        async handlerSearchAirport() {
            const response = await this.airportService.getFilteredList(this.search, this.currentPage, this.rowsPerPage);
            const list = response.status === 200 ? response._data.data.data : [];
            this.totalRecords = response.status === 200 ? response._data.data.meta.total : 0;
            this.first = response.status === 200 ? response._data.data.meta.first_page : 0;
            this.filterAirports = list;
        },
        clearSearch() {
            this.search = '';
            this.handlerSearchAirport();
        },
        onPageChange(event: any) {
            this.currentPage = event.page + 1;
            this.rowsPerPage = event.rows;
            this.handlerSearchAirport();
        },
        onSave(airport: AirportInterface) {
            this.airport = { ...airport };
            const index = this.filterAirports.findIndex((a: AirportInterface) => a.airportId === this.airport?.airportId);
            if (index !== -1) {
                this.filterAirports[index] = airport;
                this.$forceUpdate();
            } else {
                this.filterAirports.push(airport);
                this.$forceUpdate();
            }
            this.drawerAirportForm = false;
        },
        onDelete(airport: AirportInterface) {
            this.airport = { ...airport };
            this.drawerAirportDelete = true;
        },
        onEdit(airport: AirportInterface) {
            this.airport = { ...airport };
            this.drawerAirportForm = true;
        },
        async confirmDelete() {
            if (this.airport) {
                this.drawerAirportDelete = false;
                const airportResponse = await this.airportService.delete(this.airport);
                if (airportResponse.status === 201 || airportResponse.status === 200) {
                    const index = this.filterAirports.findIndex((airport: AirportInterface) => airport.airportId === this.airport?.airportId);
                    if (index !== -1) {
                        this.filterAirports.splice(index, 1);
                        this.$forceUpdate();
                    }
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Delete airport',
                        detail: airportResponse._data.message,
                        life: 5000,
                    });
                    
                } else {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Delete airport',
                        detail: airportResponse._data.message,
                        life: 5000,
                    });
                }
            }
        }
    },
})
