import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import Tooltip from 'primevue/tooltip'
import type { CalendarDayReservation } from '~/resources/scripts/interfaces/CalendarDayReservation'
import type { ReservationLegInterface } from '~/resources/scripts/interfaces/ReservationLegInterface'
import { DateTime } from 'luxon'
import type { AircraftMaintenanceInterface } from '~/resources/scripts/interfaces/AircraftMaintenanceInterface';

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
    aircraftMaintenanceFromToday() {
      const aircraftMaintenances = this.calendarDay.aircraftMaintenances || []

      // "Día local" que estás dibujando
      const dayLocal = this.calendarDay.date // un DateTime de Luxon en tu zona local
      // 2025-02-26 00:00 local
      const dayStartLocal = dayLocal.startOf('day')
      // 2025-02-26 23:59:59 local
      const dayEndLocal = dayLocal.endOf('day')

      // Convertimos a UTC
      const dayStartUTC = dayStartLocal.toUTC()
      const dayEndUTC = dayEndLocal.toUTC()

      // Filtramos los mantenimientos que se traslapan con [dayStartUTC, dayEndUTC]
      const maintenancesToday = aircraftMaintenances.filter(m => {
        const startUTC = DateTime.fromISO(m.aircraftMaintenanceStartDate as string, { zone: 'utc' })
        let endUTC = DateTime.fromISO(m.aircraftMaintenanceEndDate as string, { zone: 'utc' })
        if (m.aircraftMaintenanceFinishDate) {
          endUTC = DateTime.fromISO(m.aircraftMaintenanceFinishDate as string, { zone: 'utc' })
        } else {
          endUTC = DateTime.fromISO('9999-12-31T23:59:59Z', { zone: 'utc' })
        }

        // Verificamos traslape: 
        // (startUTC <= dayEndUTC) && (endUTC >= dayStartUTC)
        return (startUTC <= dayEndUTC) && (endUTC >= dayStartUTC)
      })

      return maintenancesToday
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
    makeReservationTimeLine() {
      const dateTimeLine = []
      const maintenanceHrs = this.getMaintenanceHours() // { hours: ["03","04"], ...}
      for (let index = 0; index < 24; index++) {
        let action = ''
        let actionTitle = ''
        let actionSubtitle = ''
        let bgColor = ''
        let color = ''

        const actionLegDeparture = this.legsFromToday.find(leg => `${leg.reservationLegDepartureTime}`.split(':')[0] === `${index}`.padStart(2, '0'))
        const postPernoctas = this.getPernoctasPostArrive()

        postPernoctas.hours.forEach((fh) => {
          if (parseInt(fh) === index) {
            action = 'pernocta'
            actionTitle = 'Pernocta'
            actionSubtitle = `${postPernoctas.destination.airportDestination.airportIcaoCode} (${postPernoctas.destination.airportDestination.airportDisplayLocationName})`
          }
        })
        // Si la hora actual está dentro de las horas de mantenimiento
        if (maintenanceHrs.hours.includes(String(index).padStart(2, '0'))) {
          const maintenance = maintenanceHrs.maintenances.length > 0 ? maintenanceHrs.maintenances[0] : null
          action = 'maintenance'
          actionTitle = 'Maintenance'
          actionSubtitle = `${maintenance !== null ? maintenance.maintenanceType?.maintenanceTypeName : 'Aircraft in Maintenance'}`
          bgColor = `${maintenance !== null ? maintenance.aircraftMaintenanceStatus?.aircraftMaintenanceStatusBg : ''}`
          color = `${maintenance !== null ? maintenance.aircraftMaintenanceStatus?.aircraftMaintenanceStatusColor : ''}`
        }

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
          actionSubtitle,
          bgColor,
          color
        })
      }

      this.dateTimeLine = dateTimeLine
    },
    getFlightHours() {
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
    getPernoctasPreDeparture() {
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
    getPernoctasPostArrive() {
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
    },
    getFormattedRangeDate(maintenance: AircraftMaintenanceInterface) {
      const startDate = this.formattedDate(maintenance.aircraftMaintenanceStartDate);
      const endDate = maintenance.aircraftMaintenanceFinishDate ? this.formattedDate(maintenance.aircraftMaintenanceFinishDate) : this.formattedDate(maintenance.aircraftMaintenanceEndDate);
      return `${startDate} - ${endDate}`;
    },

    formattedDate(date: string | Date | null) {
      // formated aircraftMaintenance.aircraftMaintenanceStartDate with Luxon
      if (date) {
        // parse date to Luxon DateTime
        const dateTime = DateTime.fromISO(date as string)
        // format date with name of day, name of month, day, year and time
        return dateTime.toFormat('dd/MM/yyyy')
      }
    },
    getMaintenanceHours() {
      const maintenanceHrs = {
        hours: [] as string[], // aquí guardaremos ["00", "01", "02", ..., "23"]
        maintenances: [] as AircraftMaintenanceInterface[]
      }

      // Día que estoy dibujando: [00:00, 23:59]
      // Supongamos que this.calendarDay.date es un objeto Luxon DateTime
      const dateCard = this.calendarDay.date.toFormat('yyyy-MM-dd')
      const dayStart = DateTime.fromISO(dateCard).startOf('day') // 2025-02-26 00:00
      const dayEnd = DateTime.fromISO(dateCard).endOf('day')   // 2025-02-26 23:59

      // Obtenemos la lista de mantenimientos relevantes al día (ya lo tienes):
      const maintenancesToday = this.aircraftMaintenanceFromToday

      // Recorremos cada mantenimiento que “toca” este día
      maintenancesToday.forEach(maintenance => {
        // 1) Parseamos su fecha de inicio UTC y convertimos a la zona local
        const dtStart = DateTime
          .fromISO(maintenance.aircraftMaintenanceStartDate as string, { zone: 'utc' })
          .setZone('America/Mexico_City')

        // 2) Parseamos su fecha de fin UTC y convertimos a la zona local
        //    (si no tiene `aircraftMaintenanceFinishDate`, usamos `aircraftMaintenanceEndDate`)
        let dtEnd = DateTime
          .fromISO(maintenance.aircraftMaintenanceEndDate as string, { zone: 'utc' })
          .setZone('America/Mexico_City')

        if (maintenance.aircraftMaintenanceFinishDate) {
          dtEnd = DateTime
            .fromISO(maintenance.aircraftMaintenanceFinishDate as string, { zone: 'utc' })
            .setZone('America/Mexico_City')
        } else {
          dtEnd = DateTime.fromISO('9999-12-31T23:59:59Z', { zone: 'utc' }).setZone('America/Mexico_City')

        }

        // "Recortamos" el inicio y fin para que no salgan del día actual.
        // Si el mantenimiento inicia antes de 'dayStart', lo ponemos a las 00:00 del día
        // Si termina después de 'dayEnd', lo ponemos a las 23:59 del día
        const localStart = dtStart < dayStart ? dayStart : dtStart
        const localEnd = dtEnd > dayEnd ? dayEnd : dtEnd

        // Si, tras acotar, aún tenemos un rango válido:
        if (localStart <= localEnd) {
          // Obtengo las horas “enteras” dentro de localStart..localEnd
          // Por ejemplo, si localStart = 2025-02-26 08:00 y localEnd = 2025-02-26 23:59
          // iteraríamos hr = 8..23
          const startHour = localStart.hour  // entero 0..23
          const endHour = localEnd.hour    // entero 0..23

          for (let hr = startHour; hr <= endHour; hr++) {
            const hourStr = String(hr).padStart(2, '0')
            if (!maintenanceHrs.hours.includes(hourStr)) {
              maintenanceHrs.hours.push(hourStr)
            }
          }

          maintenanceHrs.maintenances.push(maintenance)
        }
      })

      // Ordena el arreglo de horas por si quedaron en orden diferente
      maintenanceHrs.hours.sort()
      return maintenanceHrs
    }
  }
})
