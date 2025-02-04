import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import Tooltip from 'primevue/tooltip';
import type { ShiftExceptionInterface } from '~/resources/scripts/interfaces/ShiftExceptionInterface';
import type { CalendarDayReservation } from '~/resources/scripts/interfaces/CalendarDayReservation';
import type { ReservationLegInterface } from '~/resources/scripts/interfaces/ReservationLegInterface';
export default defineComponent({
  name: 'aircraftCardDay',
  directives: {
    tooltip: Tooltip
  },
  props: {
    calendarDay: { type: Object as PropType<CalendarDayReservation>, required: true },
  },
  data: () => ({
    commentsSidebar: false as boolean,
    dayExceptions: [] as ShiftExceptionInterface[]
  }),
  computed: {
    legsFromToday() {
      const dateCard = this.calendarDay.date.toFormat('yyyy-MM-dd');;        // fecha a comparar ("YYYY-MM-DD")
      const aircraft = this.calendarDay.aircraft;
      const reservations = aircraft.reservations || [];
      // 1. Obtener todos los legs de todas las reservaciones
      const allLegs = reservations.flatMap(reservation => reservation.reservationLegs || [] as ReservationLegInterface[]);

      // 2. Filtrar sólo los legs cuya fecha de despegue sea == dateCard
      const legsToday = allLegs.filter(leg => {
        let legDateStr = '';
        let legDateArriveStr = '';
        
        if (typeof leg.reservationLegDepartureDate === 'string' && typeof leg.reservationLegArriveDate === 'string') {
          // Asumimos que ya viene como "YYYY-MM-DD"
          legDateStr = leg.reservationLegDepartureDate;
          legDateArriveStr = leg.reservationLegArriveDate;
        } else if (leg.reservationLegDepartureDate instanceof Date && leg.reservationLegArriveDate instanceof Date) {
          // Convertir el objeto Date a "YYYY-MM-DD"
          legDateStr = leg.reservationLegDepartureDate.toISOString().split('T')[0];
          legDateArriveStr = leg.reservationLegArriveDate.toISOString().split('T')[0];
        }

        return legDateStr === dateCard || legDateArriveStr === dateCard;
      });


      const toDateTime = (dateObj: Date, timeString: string) => {
        const d = new Date(dateObj);
        const [hh, mm] = timeString.split(':');
        d.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
        return d;
      };
      // 3. Ordenar por hora de salida (de la más temprana a la más tardía)
      legsToday.sort((a, b) => {
        // Asumiendo "HH:MM" con ceros a la izquierda, la comparación de string funciona bien.
        // O podrías convertir a minutos: a.reservationLegDepartureTime.split(':') etc.
        if (a.reservationLegDepartureTime && b.reservationLegDepartureTime) {
          const departureDateA = new Date(a.reservationLegDepartureDate as string);
          const departureDateB = new Date(b.reservationLegDepartureDate as string);
          
          const dateTimeA = toDateTime(departureDateA, a.reservationLegDepartureTime as string);
          const dateTimeB = toDateTime(departureDateB, b.reservationLegDepartureTime as string);
          return dateTimeA.getTime() - dateTimeB.getTime();
        }
      });

      // 4. Regresar (o setear en una variable) los legs filtrados y ordenados
      return legsToday;

    },
    hasPeroctation() {
      const dateCard = this.calendarDay.date.toFormat('yyyy-MM-dd');
      const aircraft = this.calendarDay.aircraft;
      const reservations = aircraft.reservations || [];

      // Recorremos todas las reservas del avión
      const foundOvernight = reservations.some(reservation => {
      const legs = reservation.reservationLegs || [];

        // Verificamos si hay ALGUNA llegada antes de dateCard
        // if (this.calendarDay.formattedDate === 'Feb 11, 2025') {
          
        //   debugger;
        // }
        const legsArrivingBefore = legs
        .filter((leg) => {
          let arriveStr = '';
          if (typeof leg.reservationLegArriveDate === 'string') {
            arriveStr = leg.reservationLegArriveDate;
          } else if (leg.reservationLegArriveDate instanceof Date) {
            arriveStr = leg.reservationLegArriveDate.toISOString().split('T')[0];
          }
          // Retorna true si la fecha de llegada es lexicográficamente < dateCard
          return arriveStr < dateCard;
        })
        // 2. Convertimos en un objeto que guarde la fecha real (Date) o el string,
        //    para ordenarlo fácilmente.
        .map((leg) => {
          let arriveStr = '';
          if (typeof leg.reservationLegArriveDate === 'string') {
            arriveStr = leg.reservationLegArriveDate;
          } else if (leg.reservationLegArriveDate instanceof Date) {
            arriveStr = leg.reservationLegArriveDate.toISOString().split('T')[0];
          }
            return {
              ...leg,
              arriveStr,
            };
          });

        // 3. Ordenamos `legsArrivingBefore` de más reciente a más antigua
        //    (descendente) para encontrar la llegada *más cercana* a dateCard
        legsArrivingBefore.sort((a, b) => {
          // a.arriveStr > b.arriveStr => -1, para ordenar desc
          if (a.arriveStr > b.arriveStr) return -1;
          else if (a.arriveStr < b.arriveStr) return 1;
          return 0;
        });
        const lastArrivalBefore = legsArrivingBefore[0];

        // Verificamos si hay ALGUNA salida después de dateCard
        const departsAfter = legs.some(leg => {
          let departStr = '';
          if (typeof leg.reservationLegDepartureDate === 'string') {
            departStr = leg.reservationLegDepartureDate;
          } else if (leg.reservationLegDepartureDate instanceof Date) {
            departStr = leg.reservationLegDepartureDate.toISOString().split('T')[0];
          }
          return departStr > dateCard;
        });

        // Si en la misma reserva hay un leg que llegue antes
        // y otro (o el mismo) que salga después => pernocta
        if (
          lastArrivalBefore &&
          lastArrivalBefore.airportDestination?.airportIcaoCode !== 'MMTO' &&
          departsAfter
        ) {
          // Si todo esto se cumple, ya podemos decir que hay pernocta
          return true;
        }

        // Si esta reservación no cumple, pasamos a la siguiente
        return false;
      });

      return foundOvernight;
    }
  },
  mounted() {
    console.log(this.legsFromToday, 'legsFromToday' + this.calendarDay.formattedDate);
  },
  methods: {
    formatTime(timeString: string) {
      if (!timeString) return '';
      // Crear un objeto Date "falso" usando 1970-01-01
      //  => Soporta "HH:MM" o "HH:MM:SS"
      const dateObj = new Date(`1970-01-01T${timeString}`);

      // Formatear en 12 horas, ejemplo "12:00 AM"
      return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    },
    formatDate(dateString: string) {
      if (!dateString) return '';
      // Formatear la fecha en "YYYY-MM-DD" a "MMM DD, YYYY"
      return DateTime.fromISO(dateString).toFormat('MMM dd, yy');
    }
  }
})