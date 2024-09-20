import type { RoleSystemPermissionInterface } from '~/resources/scripts/interfaces/RoleSystemPermissionInterface'
import HolidayService from '../../resources/scripts/services/HolidayService'
import { useMyGeneralStore } from '~/store/general'

export default defineComponent({
    name: 'Holidays',
    props: {},
    data: () => ({
        date: new Date(),
        firstDate: null as string | null,
        lastDate: null as string | null,
        filterHolidays: [] as HolidayInterface[],
        holiday: null as HolidayInterface | null,
        search: '',
        currentPage: 1,
        totalRecords: 0,
        first: 0,
        last: 0,
        rowsPerPage: 20,
        periodSelected: null as Date | null,
        minDate: new Date() as Date,
        maxDate: new Date() as Date,
        holidayService: new HolidayService(),
        drawerHolidayForm: false,
        drawerHolidayDelete: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        isReady: false
    }),
    async mounted() {
        this.isReady = false
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
        await this.handlerSearchHoliday()
        this.isReady = true
    },
    methods: {
        addNew() {
            const newHoliday: HolidayInterface = {
                holidayId: null,
                holidayName: '',
                holidayIcon: null,
                holidayFrequency: 1,
                holidayDate: new Date(),
                holidayIconId: null,
                holidayCreatedAt: new Date(),
                holidayUpdatedAt: new Date(),
                holidayDeletedAt: null
            }
            this.holiday = newHoliday
            this.drawerHolidayForm = true
        },
        setShowDate(date: Date) {
            this.date = date
        },
        async handlerSearchHoliday() {
            if (this.search !== '' && this.search !== null) {
                this.periodSelected = null
                this.firstDate = null
                this.lastDate = null
            }
            const response = await this.holidayService.getFilteredList(this.search,this.firstDate, this.lastDate, this.currentPage, this.rowsPerPage);
            const list = response.status === 200 ? response._data.holidays.data : [];
            this.totalRecords = response.status === 200 ? response._data.holidays.meta.total : 0;
            this.first = response.status === 200 ? response._data.holidays.meta.first_page : 0;
            this.filterHolidays = list;
        },
        getDateRange(date: Date) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            // Obtener el primer día del mes
            const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;

            // Obtener el último día del mes
            const lastDay = new Date(year, month, 0);
            const lastDayFormatted = `${year}-${String(month).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;

            return { firstDay, lastDayFormatted };
        },
        clearPeriod() {
            this.periodSelected = null;
            this.firstDate = null;
            this.lastDate = null;
            this.handlerSearchHoliday();
        },
        handlerPeriodChange() {
            if (this.periodSelected) {
                const { firstDay, lastDayFormatted } = this.getDateRange(this.periodSelected);
                this.firstDate = firstDay;
                this.lastDate = lastDayFormatted;
            }
            this.handlerSearchHoliday();
        },
        onPageChange(event: any) {
            this.currentPage = event.page + 1;
            this.rowsPerPage = event.rows;
            this.handlerSearchHoliday();
        },
        onSave(holiday: HolidayInterface) {
            this.holiday = { ...holiday };
            const index = this.filterHolidays.findIndex((s: HolidayInterface) => s.holidayId === this.holiday?.holidayId);
            if (index !== -1) {
                this.filterHolidays[index] = holiday;
                this.$forceUpdate();
            } else {
                this.filterHolidays.push(holiday);
                this.$forceUpdate();
            }
            this.drawerHolidayForm = false;
        },
        onDelete(holiday: HolidayInterface) {
            this.holiday = { ...holiday };
            this.drawerHolidayDelete = true;
        },
        onEdit(holiday: HolidayInterface) {
            this.holiday = { ...holiday };
            this.drawerHolidayForm = true;
        },
        async confirmDelete() {
            if (this.holiday) {
                this.drawerHolidayDelete = false;
                const holidayResponse = await this.holidayService.delete(this.holiday);
                if (holidayResponse.status === 201 || holidayResponse.status === 200) {
                const index = this.filterHolidays.findIndex((holiday: HolidayInterface) => holiday.holidayId === this.holiday?.holidayId);
                if (index !== -1) {
                    this.filterHolidays.splice(index, 1);
                    this.$forceUpdate();
                }
                this.$toast.add({
                    severity: 'success',
                    summary: 'Delete holiday',
                    detail: holidayResponse._data.message,
                    life: 5000,
                });
            } else {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Delete holiday',
                    detail: holidayResponse._data.message,
                    life: 5000,
                });
              }
            }
        }
    },
})