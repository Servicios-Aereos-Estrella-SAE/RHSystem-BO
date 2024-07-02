import { DateTime } from 'luxon'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AssistDayInterface } from '~/resources/scripts/interfaces/AssistDayInterface'
import type { DailyEmployeeShiftsInterface } from '~/resources/scripts/interfaces/DailyEmployeeShiftsInterface'
import type { EmployeeShiftInterface } from '~/resources/scripts/interfaces/EmployeeShiftInterface'
import type { ShiftInterface } from '~/resources/scripts/interfaces/ShiftInterface'

export default defineComponent({
  name: 'attendanceCalendarDay',
  props: {
    checkAssist: { type: Object as PropType<AssistDayInterface>, required: true }
  },
  data: () => ({
    dailyShifs: [] as EmployeeShiftInterface[]
  }),
  computed: {
    dateYear () {
      if (!this.checkAssist?.day) {
        return 0
      }

      const year = parseInt(`${this.checkAssist.day.split('-')[0]}`)
      return year
    },
    dateMonth () {
      if (!this.checkAssist?.day) {
        return 0
      }

      const month = parseInt(`${this.checkAssist.day.split('-')[1]}`)
      return month
    },
    dateDay () {
      if (!this.checkAssist?.day) {
        return 0
      }

      const day = parseInt(`${this.checkAssist.day.split('-')[2]}`)
      return day
    },
    weekDayName () {
      const date = DateTime.local(this.dateYear, this.dateMonth, this.dateDay, 0)
      const day = date.toFormat('cccc')
      return day
    },
    calendarDay () {
      const date = DateTime.local(this.dateYear, this.dateMonth, this.dateDay, 0)
      const day = date.toFormat('DD')
      return day
    },
    chekInTime () {
      if (!this.checkAssist?.assist?.checkIn?.assistPunchTimeOrigin) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.checkIn.assistPunchTimeOrigin.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-5')
      return timeCST.toFormat('tt')
    },
    chekOutTime () {
      if (!this.checkAssist?.assist?.checkOut?.assistPunchTimeOrigin) {
        return ''
      }

      const time = DateTime.fromISO(this.checkAssist.assist.checkOut.assistPunchTimeOrigin.toString(), { setZone: true })
      const timeCST = time.setZone('UTC-5')
      return timeCST.toFormat('tt')
    }
  },
  mounted() {
    const dailyShifts: DailyEmployeeShiftsInterface[] = [{
      employeeId: 178,
      employeeSyncId: '191',
      employeeCode: '28000008',
      employeeFirstName: 'Fernando',
      employeeLastName: 'Hernández Cruz',
      employeePayrollNum: 'SILER',
      employeeHireDate: '2023-02-21',
      companyId: 1,
      departmentId: 14,
      positionId: 52,
      departmentSyncId: '28',
      positionSyncId: '110',
      personId: 183,
      employeeLastSynchronizationAt: '2024-06-25T14:23:39.000Z',
      employeeCreatedAt: '2024-06-23T00:34:10.000+00:00',
      employeeUpdatedAt: '2024-06-25T14:23:38.000+00:00',
      employeeDeletedAt: null,
      employeeShifts: [{
        employeeShiftId: 1,
        employeeId: 178,
        shiftId: 1,
        employeShiftsApplySince: '2024-05-01T00:06:00.000+00:00',
        employeShiftsCreatedAt: '2024-04-30 16:00:16',
        employeShiftsUpdatedAt: '2024-04-30 16:00:16',
        employeShiftsDeletedAt: null,
        shift: {
          shiftId: 1,
          shiftName: 'Estandar',
          shiftDayStart: 1,
          shiftTimeStart: '08:00:00',
          shiftActiveHours: 10,
          shiftRestDays: '6,7',
          shiftCreatedAt: '2024-04-30 16:00:16',
          shiftUpdatedAt: '2024-04-30 16:00:16',
          shiftDeletedAt: null
        }
      },
      {
        employeeShiftId: 2,
        employeeId: 178,
        shiftId: 2,
        employeShiftsApplySince: '2024-06-18T00:06:00.000+00:00',
        employeShiftsCreatedAt: '2024-06-18 00:00:16',
        employeShiftsUpdatedAt: '2024-06-18 00:00:16',
        employeShiftsDeletedAt: null,
        shift: {
          shiftId: 2,
          shiftName: 'Estandar',
          shiftDayStart: 1,
          shiftTimeStart: '07:00:00',
          shiftActiveHours: 10,
          shiftRestDays: '6,7',
          shiftCreatedAt: '2024-04-30 16:00:16',
          shiftUpdatedAt: '2024-04-30 16:00:16',
          shiftDeletedAt: null
        }
      }]
    }]

    this.dailyShifs = dailyShifts[0].employeeShifts as EmployeeShiftInterface[]
  },
  methods: {
    getAssignedDateShift (compareDateTime: string) {
      const availableShifts = this.dailyShifs.filter((shift) => {
        const shiftDate = DateTime.fromJSDate(new Date(`${shift.employeShiftsApplySince}`))
        const DayTime = DateTime.fromJSDate(new Date(`${compareDateTime}`))
        const checkTime = DayTime.setZone('UTC-5')
        if (checkTime > shiftDate) {
          return shiftDate
        }
      })

      availableShifts.sort((a, b) => {
        const shiftAssignedDate_A = DateTime.fromJSDate(new Date(`${a.employeShiftsApplySince}`))
        const shiftAssignedDate_B = DateTime.fromJSDate(new Date(`${b.employeShiftsApplySince}`))

        if ( shiftAssignedDate_B < shiftAssignedDate_A ){
          return -1
        }

        if ( shiftAssignedDate_B > shiftAssignedDate_A ){
          return 1
        }

        return 0
      })

      const selectedShift = availableShifts[0]
      return selectedShift
    }
  }
})