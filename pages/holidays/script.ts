import HolidayService from '../../resources/scripts/services/HolidayService'
import HolidayInterface from '~/resources/scripts/interfaces/HolidayInterface';

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
        periodSelected: new Date(),
        minDate: new Date() as Date,
        maxDate: new Date() as Date,
        holidayService: new HolidayService(),
        drawerHolidayForm: false,
        drawerHolidayDelete: false
    }),
    async mounted() {
        const { firstDay, lastDayFormatted } = this.getDateRange(this.date);
        this.firstDate = firstDay;
        this.lastDate = lastDayFormatted
        await this.handlerSearchHoliday()
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
        handlerPeriodChange() {
            const { firstDay, lastDayFormatted } = this.getDateRange(this.periodSelected);
            this.firstDate = firstDay;
            this.lastDate = lastDayFormatted;
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