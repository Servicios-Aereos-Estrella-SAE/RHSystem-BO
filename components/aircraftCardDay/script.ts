import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Tooltip from 'primevue/tooltip'
import type { CalendarDayReservation } from '~/resources/scripts/interfaces/CalendarDayReservation'
import type { ReservationLegInterface } from '~/resources/scripts/interfaces/ReservationLegInterface'
import { DateTime } from 'luxon'

export default defineComponent({
  name: 'aircraftCardDay',
  directives: {
    tooltip: Tooltip
  },
  props: {
    calendarDay: { type: Object as PropType<CalendarDayReservation>, required: true },
  },
  data: () => ({
    dateTimeLine: [] as any[]
  }),
  computed: {
    isPernoctaDay() {
      const dateCard = this.calendarDay.date.toFormat('yyyy-MM-dd')
      const aircraft = this.calendarDay.aircraft
      const reservations = aircraft.reservations || []
      let lastArrival: any = null

      // Recorremos todas las reservas del avión
      const foundOvernight = reservations.some(reservation => {
        const legs = reservation.reservationLegs || []

        const legsArrivingBefore = legs.filter((leg) => {
          let arriveStr = ''

          if (typeof leg.reservationLegArriveDate === 'string') {
            arriveStr = leg.reservationLegArriveDate
          } else if (leg.reservationLegArriveDate instanceof Date) {
            arriveStr = leg.reservationLegArriveDate.toISOString().split('T')[0]
          }

          return arriveStr < dateCard // Retorna true si la fecha de llegada es lexicográficamente < dateCard
        })
        .map((leg) => { // 2. Convertimos en un objeto que guarde la fecha real (Date) o el string, para ordenarlo fácilmente.
          let arriveStr = ''

          if (typeof leg.reservationLegArriveDate === 'string') {
            arriveStr = leg.reservationLegArriveDate
          } else if (leg.reservationLegArriveDate instanceof Date) {
            arriveStr = leg.reservationLegArriveDate.toISOString().split('T')[0]
          }

          return { ...leg, arriveStr }
        })

        // 3. Ordenamos `legsArrivingBefore` de más reciente a más antigua
        //    (descendente) para encontrar la llegada *más cercana* a dateCard
        legsArrivingBefore.sort((a, b) => {
          if (a.arriveStr > b.arriveStr) return -1
          else if (a.arriveStr < b.arriveStr) return 1
          return 0
        })

        const lastArrivalBefore = legsArrivingBefore[0]

        // Verificamos si hay ALGUNA salida después de dateCard
        const departsAfter = legs.some(leg => {
          let departStr = ''
          if (typeof leg.reservationLegDepartureDate === 'string') {
            departStr = leg.reservationLegDepartureDate
          } else if (leg.reservationLegDepartureDate instanceof Date) {
            departStr = leg.reservationLegDepartureDate.toISOString().split('T')[0]
          }
          return departStr > dateCard
        })

        // Si en la misma reserva hay un leg que llegue antes
        // y otro (o el mismo) que salga después => pernocta
        if (
          lastArrivalBefore &&
          lastArrivalBefore.airportDestination?.airportIcaoCode !== 'MMTO' &&
          departsAfter
        ) {
          // Si todo esto se cumple, ya podemos decir que hay pernocta
          lastArrival = lastArrivalBefore
          return true
        }

        // Si esta reservación no cumple, pasamos a la siguiente
        return false
      })

      return { isPernocta: foundOvernight, lastArrival }
    },
    legsFromToday() {
      const dateCard = this.calendarDay.date.toFormat('yyyy-MM-dd')
      const aircraft = this.calendarDay.aircraft
      const reservations = aircraft.reservations || []
      const allLegs = reservations.flatMap(reservation => reservation.reservationLegs || [] as ReservationLegInterface[])
      const legsToday = allLegs.filter(leg => {
        let legDateStr = ''
        let legDateArriveStr = ''
        
        if (typeof leg.reservationLegDepartureDate === 'string' && typeof leg.reservationLegArriveDate === 'string') {
          legDateStr = leg.reservationLegDepartureDate
          legDateArriveStr = leg.reservationLegArriveDate
        } else if (leg.reservationLegDepartureDate instanceof Date && leg.reservationLegArriveDate instanceof Date) {
          legDateStr = leg.reservationLegDepartureDate.toISOString().split('T')[0]
          legDateArriveStr = leg.reservationLegArriveDate.toISOString().split('T')[0]
        }

        return legDateStr === dateCard || legDateArriveStr === dateCard
      })


      const toDateTime = (dateObj: Date, timeString: string) => {
        const d = new Date(dateObj)
        const [hh, mm] = timeString.split(':')
        d.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0)
        return d
      }

      legsToday.sort((a, b) => {
        if (a.reservationLegDepartureTime && b.reservationLegDepartureTime) {
          const departureDateA = new Date(a.reservationLegDepartureDate as string)
          const departureDateB = new Date(b.reservationLegDepartureDate as string)
          
          const dateTimeA = toDateTime(departureDateA, a.reservationLegDepartureTime as string)
          const dateTimeB = toDateTime(departureDateB, b.reservationLegDepartureTime as string)
          return dateTimeA.getTime() - dateTimeB.getTime()
        }

        return 0
      })

      return legsToday

    },
  },
  mounted() {
    this.makeReservationTimeLine()
  },
  methods: {
    makeReservationTimeLine () {
      const dateTimeLine = []

      for (let index = 0; index < 24; index++) {
        let action = ''
        let actionTitle = ''
        let actionSubtitle = ''

        const actionLegDeparture = this.legsFromToday.find(leg => `${leg.reservationLegDepartureTime}`.split(':')[0] === `${index}`.padStart(2, '0'))
        const postPernoctas = this.getPernoctasPostArrive()

        postPernoctas.hours.forEach((fh) => {
          if (parseInt(fh) === index) {
            action = 'pernocta'
            actionTitle = 'Pernocta'
            actionSubtitle = `${postPernoctas.destination.airportDestination.airportIcaoCode} (${postPernoctas.destination.airportDestination.airportDisplayLocationName})`
          }
        })

        const prePernoctas = this.getPernoctasPreDeparture()

        prePernoctas.hours.forEach((fh) => {
          if (parseInt(fh) === index) {
            action = 'pernocta'
            actionTitle = 'Pernocta'
            actionSubtitle = `${prePernoctas.origin.airportDeparture.airportIcaoCode} (${prePernoctas.origin.airportDeparture.airportDisplayLocationName})`
          }
        })
        
        if (actionLegDeparture) {
          action = 'departure'
          actionTitle = 'Departure'
          actionSubtitle = `${actionLegDeparture.airportDeparture?.airportIcaoCode} (${actionLegDeparture.airportDeparture?.airportDisplayLocationName})`
        }

        const flightHours = this.getFlightHours()

        flightHours.hours.forEach((fh) => {
          if (parseInt(fh) === index) {
            action = 'flight'
            actionTitle = 'At flight'
            actionSubtitle = `${flightHours.origin.airportDeparture?.airportIcaoCode} - ${flightHours.destination.airportDestination?.airportIcaoCode}`
          }
        })

        const actionLegArrive = this.legsFromToday.find(leg => `${leg.reservationLegArriveTime}`.split(':')[0] === `${index}`.padStart(2, '0'))

        if (actionLegArrive) {
          action = 'arrive'
          actionTitle = 'Arrive'
          actionSubtitle = `${actionLegArrive.airportDestination?.airportIcaoCode} (${actionLegArrive.airportDestination?.airportDisplayLocationName})`
        }

        if (this.isPernoctaDay.isPernocta && this.legsFromToday.length === 0) {
          action = 'pernocta'
          actionTitle = 'Pernocta'
          actionSubtitle = this.isPernoctaDay.lastArrival ? `${this.isPernoctaDay.lastArrival?.airportDestination?.airportIcaoCode} (${this.isPernoctaDay.lastArrival?.airportDestination?.airportDisplayLocationName})` : '---'
        }

        dateTimeLine.push({
          hour: index,
          hourLabel: `${`${index}`.padStart(2, '0')}:00`,
          action,
          actionTitle,
          actionSubtitle
        })
      }

      this.dateTimeLine = dateTimeLine
    },
    getFlightHours () {
      const flightHrs = {
        hours: [] as any[],
        origin: null as any,
        destination: null as any
      }

      if (this.legsFromToday.length > 0) {
        const departureLeg = this.legsFromToday[0]
        const arrivalLeg = this.legsFromToday.length >= 1 ? this.legsFromToday[this.legsFromToday.length - 1] : null

        const dtDeparture = DateTime.fromObject({
          year: parseInt(`${departureLeg.reservationLegDepartureDate}`.split('-')[0]),
          month: parseInt(`${departureLeg.reservationLegDepartureDate}`.split('-')[1]),
          day: parseInt(`${departureLeg.reservationLegDepartureDate}`.split('-')[2]),
          hour: parseInt(`${departureLeg.reservationLegDepartureTime}`.split(':')[0]),
          minute: parseInt(`${departureLeg.reservationLegDepartureTime}`.split(':')[1])
        })

        if (departureLeg && arrivalLeg) {
          flightHrs.origin = departureLeg
          flightHrs.destination = arrivalLeg

          const dtArrive = DateTime.fromObject({
            year: parseInt(`${arrivalLeg.reservationLegArriveDate}`.split('-')[0]),
            month: parseInt(`${arrivalLeg.reservationLegArriveDate}`.split('-')[1]),
            day: parseInt(`${arrivalLeg.reservationLegArriveDate}`.split('-')[2]),
            hour: parseInt(`${arrivalLeg.reservationLegArriveTime}`.split(':')[0]),
            minute: parseInt(`${arrivalLeg.reservationLegArriveTime}`.split(':')[1])
          })
  
          const hoursDiff = dtArrive.diff(dtDeparture, 'hours').hours
  
          if (hoursDiff > 1) {
            for (let hr = 0; hr < hoursDiff; hr++) {
              const flightHour = dtDeparture.plus({ hour: (hr + 1) }).toFormat('HH')
              flightHrs.hours.push(flightHour)
            }
          }
        }
      }
      
      return flightHrs
    },
    getPernoctasPreDeparture () {
      const pernoctas = {
        hours: [] as any[],
        origin: null as any
      }

      if (this.legsFromToday.length > 0) {
        const departureLeg = this.legsFromToday[0]

        if (departureLeg && departureLeg.airportDeparture?.airportIcaoCode !== 'MMTO') {
          pernoctas.origin = departureLeg

          const startTimeDayArrive = DateTime.fromObject({
            year: parseInt(`${departureLeg.reservationLegDepartureDate}`.split('-')[0]),
            month: parseInt(`${departureLeg.reservationLegDepartureDate}`.split('-')[1]),
            day: parseInt(`${departureLeg.reservationLegDepartureDate}`.split('-')[2]),
            hour: 0,
            minute: 0,
            second: 0
          })

          const dtDeparture = DateTime.fromObject({
            year: parseInt(`${departureLeg.reservationLegDepartureDate}`.split('-')[0]),
            month: parseInt(`${departureLeg.reservationLegDepartureDate}`.split('-')[1]),
            day: parseInt(`${departureLeg.reservationLegDepartureDate}`.split('-')[2]),
            hour: parseInt(`${departureLeg.reservationLegDepartureTime}`.split(':')[0]),
            minute: parseInt(`${departureLeg.reservationLegDepartureTime}`.split(':')[1])
          })
  
          const diffToPercocta = dtDeparture.diff(startTimeDayArrive, 'hours').hours
  
          if (diffToPercocta >= 1) {
            for (let hr = 0; hr < diffToPercocta; hr++) {  
              pernoctas.hours.push(`${hr}`)
            }
          }
        }
      }

      return pernoctas
    },
    getPernoctasPostArrive () {
      const pernoctas = {
        hours: [] as any[],
        destination: null as any
      }

      if (this.legsFromToday.length > 0) {
        const arrivalLeg = this.legsFromToday[0]

        if (arrivalLeg && arrivalLeg.airportDestination?.airportIcaoCode !== 'MMTO') {
          pernoctas.destination = arrivalLeg
  
          const dtArrive = DateTime.fromObject({
            year: parseInt(`${arrivalLeg.reservationLegArriveDate}`.split('-')[0]),
            month: parseInt(`${arrivalLeg.reservationLegArriveDate}`.split('-')[1]),
            day: parseInt(`${arrivalLeg.reservationLegArriveDate}`.split('-')[2]),
            hour: parseInt(`${arrivalLeg.reservationLegArriveTime}`.split(':')[0]),
            minute: parseInt(`${arrivalLeg.reservationLegArriveTime}`.split(':')[1])
          })
  
          const endTimeDayArrive = DateTime.fromObject({
            year: parseInt(`${arrivalLeg.reservationLegArriveDate}`.split('-')[0]),
            month: parseInt(`${arrivalLeg.reservationLegArriveDate}`.split('-')[1]),
            day: parseInt(`${arrivalLeg.reservationLegArriveDate}`.split('-')[2]),
            hour: 23,
            minute: 59,
            second: 59
          })
  
          const diffToPercocta = endTimeDayArrive.diff(dtArrive, 'hours').hours
          
          if (diffToPercocta >= 1) {
            for (let hr = 0; hr < diffToPercocta; hr++) {
              const percnotaHour = dtArrive.plus({ hour: (hr) }).toFormat('HH')
              pernoctas.hours.push(percnotaHour)
            }
          }
        }
      }

      return pernoctas
    }
  }
})
