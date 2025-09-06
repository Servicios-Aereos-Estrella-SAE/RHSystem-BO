import { DateTime, type DateObjectUnits } from 'luxon'
import type { CalendarDayMarkerInterface } from '~/resources/scripts/interfaces/CalendarDayMarkerInterface'

interface CalendarDay {
  day: number | string;
  marked: boolean;
  icon: string;
  quantity: number;
  isToday: boolean;
  isEmpty: boolean;
}

interface CalendarMonth {
  monthNumber: number;
  monthName: string;
  status: string;
  weeks: number;
  days: CalendarDay[][];
}

export default defineComponent({
  name: 'CalendarView',
  setup() {
    const { locale } = useI18n()
    return {
      locale
    }
  },
  props: {
    year: {
      type: Number,
      default: new Date().getFullYear()
    },
    markedDays: {
      type: Array as PropType<CalendarDayMarkerInterface[]>,
      default: () => []
    },
    markedDayClass: {
      type: String,
      default: 'marked-day'
    },
    hideIndicator: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['day-click'],
  data: () => ({
    weekDays: [0, 1, 2, 3, 4, 5, 6],
    calendarData: [] as CalendarMonth[],
    localeToUse: 'en',
  }),
  watch: {
    'year': function () {
      this.generateCalendarData()
    },
    'markedDays': {
      handler() {
        this.generateCalendarData()
      },
      deep: true
    }
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  mounted() {
    this.generateCalendarData()
  },
  methods: {
    weekDayName(numberDay: number) {
      const luxonWeekday = numberDay === 0 ? 7 : numberDay;

      if (luxonWeekday < 1 || luxonWeekday > 7) {
        return '';
      }

      const fecha = DateTime.fromObject({ weekday: luxonWeekday as DateObjectUnits['weekday'] }).setLocale(this.localeToUse);
      return fecha.toFormat('EEEE');
    },
    getMonthInfo(month: number = 0) {
      const monthDate = DateTime.fromObject({ year: this.year, month, day: 1 }).setLocale(this.localeToUse);
      const monthName = monthDate.monthLong || '';
      const daysInMonth = monthDate.daysInMonth;

      let firstWeekDay = monthDate.startOf('month').weekday;
      firstWeekDay = firstWeekDay === 7 ? 0 : firstWeekDay;

      const weeks = Math.ceil((daysInMonth as number + firstWeekDay) / 7);

      return { monthName, daysInMonth, firstWeekDay, weeks };
    },
    monthStatus(month: number = 0) {
      const monthDate = DateTime.fromObject({ year: this.year, month, day: 1 }).setLocale(this.localeToUse)
      const diff = monthDate.diffNow('months').months

      if (monthDate.toFormat('yyyy-MM') === DateTime.now().setLocale(this.localeToUse).toFormat('yyyy-MM')) {
        return 'current'
      }

      return diff < 0 ? 'past' : 'future'
    },
    isMarkedDay(month: number = 0, day: number = 0): CalendarDayMarkerInterface | null {
      const compareDay = DateTime.fromObject({ year: this.year, month, day }).setLocale(this.localeToUse)
      const markedDay = this.markedDays.find((day: CalendarDayMarkerInterface) => {
        const markedDate = DateTime.fromISO(day.date.toString(), { zone: 'UTC' }).setLocale(this.localeToUse)
        return markedDate.toFormat('MM-dd') === compareDay.toFormat('MM-dd')
      })

      return markedDay || null
    },
    getCountMarked(month: number = 0, day: number = 0) {
      const compareDay = DateTime.fromObject({ year: this.year, month, day }).setLocale(this.localeToUse)
      const markedDays = this.markedDays.filter((day: CalendarDayMarkerInterface) => {
        const markedDate = DateTime.fromISO(day.date.toString(), { zone: 'UTC' }).setLocale(this.localeToUse)
        return markedDate.toFormat('MM-dd') === compareDay.toFormat('MM-dd')
      })

      return markedDays.length > 0 ? markedDays[0].quantity : 0
    },
    isToday(month: number = 0, day: number = 0) {
      if (!month || !day) {
        return false
      }

      const compareDay = DateTime.fromObject({ year: this.year, month, day }).setLocale(this.localeToUse)
      const today = DateTime.now().setLocale(this.localeToUse)
      const isNow = compareDay.toFormat('yyyy-MM-dd') === today.toFormat('yyyy-MM-dd')
      return isNow
    },
    generateCalendarData() {
      this.calendarData = [];

      for (let monthNumber = 1; monthNumber <= 12; monthNumber++) {
        const monthInfo = this.getMonthInfo(monthNumber);
        const monthStatus = this.monthStatus(monthNumber);
        const calendarMonth: CalendarMonth = {
          monthNumber,
          monthName: monthInfo.monthName,
          status: monthStatus,
          weeks: monthInfo.weeks,
          days: []
        };

        for (let week = 0; week < monthInfo.weeks; week++) {
          const weekDays: CalendarDay[] = [];

          for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
            let dayNumber: number | string = '';
            let isEmpty = true;

            if (week === 0 && dayOfWeek < monthInfo.firstWeekDay) {
              dayNumber = '';
              isEmpty = true;
            } else {
              const day = (week * 7) + dayOfWeek - monthInfo.firstWeekDay + 1;

              if (day > 0 && day <= (monthInfo.daysInMonth || 30)) {
                dayNumber = day;
                isEmpty = false;
              } else {
                dayNumber = '';
                isEmpty = true;
              }
            }

            const markedDay = !isEmpty ? this.isMarkedDay(monthNumber, Number(dayNumber)) : null;
            const quantity = !isEmpty ? this.getCountMarked(monthNumber, Number(dayNumber)) : 0;
            const isCurrentDay = !isEmpty ? this.isToday(monthNumber, Number(dayNumber)) : false;

            weekDays.push({
              day: dayNumber,
              marked: !!markedDay,
              icon: markedDay ? markedDay.icon : '',
              quantity: quantity,
              isToday: isCurrentDay,
              isEmpty
            });
          }

          calendarMonth.days.push(weekDays);
        }

        this.calendarData.push(calendarMonth);
      }
    },
    onDayClick(month: number, day: number) {
      this.$emit('day-click', { year: this.year, month, day })
    },
    capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  }
})
