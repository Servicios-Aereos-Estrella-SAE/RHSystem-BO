import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface';
import AircraftService from '../../../resources/scripts/services/AircraftService';
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface';
import { useMyGeneralStore } from '~/store/general';
import { DateTime } from 'luxon';
import { type CalendarDayReservation } from '../../../resources/scripts/interfaces/CalendarDayReservation';
export default defineComponent({
    name: 'AircraftsDetails',
    props: {},
    data: () => ({
        date: new Date(),
        filterAircrafts: [] as AircraftInterface[],
        aircraft: null as AircraftInterface | null,
        aircraftSearch: null as AircraftInterface | null,
        calendarDayReservation: [] as CalendarDayReservation[],
        search: '',
        periodSelected: new Date() as Date,
        rowsPerPage: 20,
        aircraftService: new AircraftService(),
        drawerAircraftForm: false,
        drawerAircraftDelete: false,
        drawerAircraftFormGallery: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        drawerProceedingFiles: false as boolean
    }),
    async mounted() {
        const myGeneralStore = useMyGeneralStore()
        myGeneralStore.setFullLoader(true)
        const systemModuleSlug = this.$route.path.split('/')[1];
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
        await this.showAircraft()
        myGeneralStore.setFullLoader(false)
        
    },
    
    methods: {
        async handlerPeriodChange() {
            await this.showAircraft()
        },
        async showAircraft() {
            const aircraftId = this.$route.params.id
            if (aircraftId) {
                // parse string periodSelected 
                const dateFilterReservations = DateTime.fromISO(this.periodSelected.toISOString()).toFormat('yyyy-MM-dd');
                console.log(dateFilterReservations)
                const response = await this.aircraftService.show(parseInt(aircraftId as string), dateFilterReservations)
                console.log(response)
                if (response.status === 200) {
                    this.aircraft = response._data.data.aircraft
                    console.log(this.aircraft)
                }
                this.generateDaysOfMonth()
                console.log(this.calendarDayReservation, 'calendarDayReservation')
            }
        },
        async handlerSearchAircraft(event: any) {
            if (event.query.trim().length) {
                const response = await this.aircraftService.getFilteredList(event.query.trim(), 1, 99999999999);
                const list = response.status === 200 ? response._data.data.data : [];
                console.log(list);
                this.filterAircrafts = list;
            }
        },
        onAircraftSelect() {
            if (this.aircraftSearch && this.aircraftSearch.aircraftId) {
                this.$router.push(`/aircraft/${this.aircraftSearch.aircraftId}`)
            }
        },
        generateDaysOfMonth() {
            this.calendarDayReservation = [] as CalendarDayReservation[];
            console.log(this.calendarDayReservation, 'calendarDayReservation')

            // get startOfMonth form this.periodSelected and endOfMonth
            const startOfMonth = DateTime.fromISO(this.periodSelected.toISOString()).startOf('month');
            const endOfMonth = DateTime.fromISO(this.periodSelected.toISOString()).endOf('month');
            console.log(startOfMonth, endOfMonth)

            let currentDate = startOfMonth;

            while (currentDate <= endOfMonth) {
                this.calendarDayReservation.push({
                    date: currentDate,
                    formattedDate: currentDate.toFormat('LLL dd, yyyy'),
                    day: currentDate.toFormat('EEEE'),
                    aircraft: this.aircraft as AircraftInterface,
                });
                currentDate = currentDate.plus({ days: 1 });
            }
        },
    },
});
