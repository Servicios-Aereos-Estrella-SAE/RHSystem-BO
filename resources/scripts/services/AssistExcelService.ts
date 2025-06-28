import { DateTime } from "luxon"
import type { AssistDayInterface } from "../interfaces/AssistDayInterface"
import type { EmployeeInterface } from "../interfaces/EmployeeInterface"
import type { AssistExcelRowInterface } from "../interfaces/AssistExcelRowInterface"
import type { ShiftExceptionInterface } from "../interfaces/ShiftExceptionInterface"
import axios from "axios"
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { useMyGeneralStore } from "~/store/general"
import type { AssistIncidentExcelRowInterface } from "../interfaces/AssistIncidentExcelRowInterface"
import ToleranceService from "./ToleranceService"
import SystemSettingService from "./SystemSettingService"
import type { AssistIncidentPayrollExcelRowInterface } from "../interfaces/AssistIncidentPayrollExcelRowInterface"
import BusinessUnitService from "./BusinessUnitService"
import type { BusinessUnitInterface } from "../interfaces/BusinessUnitInterface"
import EmployeeService from "./EmployeeService"
import type { AssistExcelFilterIncidentSummaryPayRollInterface } from "../interfaces/AssistExcelFilterIncidentSummaryPayRollInterface"
import type { SystemSettingInterface } from "../interfaces/SystemSettingInterface"
import type { AssistIncidentPayrollCalendarExcelFilterInterface } from "../interfaces/AssistIncidentPayrollCalendarExcelFilterInterface"
import type { AssistIncidentSummaryCalendarExcelFilterInterface } from "../interfaces/AssistIncidentSummaryCalendarExcelFilterInterface"

export default class AssistExcelService {
  protected businessUnits: Array<BusinessUnitInterface>

  constructor() {
    this.businessUnits = []
  }

  async getExcelAllAssistance(assists: any[], title: string, dateEnd: string) {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    const rows = [] as AssistExcelRowInterface[]
    const workbook = new ExcelJS.Workbook()
    let worksheet = workbook.addWorksheet('Assistance Report')
    await this.addImageLogo(workbook, worksheet, 'assist')
    worksheet.getRow(1).height = 60
    worksheet.mergeCells('A1:Q1')
    const titleRow = worksheet.addRow(['Assistance Report'])
    let color = '244062'
    let fgColor = 'FFFFFFF'
    worksheet.getCell('A' + 2).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color },
    }
    titleRow.font = { bold: true, size: 24, color: { argb: fgColor } }
    titleRow.height = 42
    titleRow.alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.mergeCells('A2:Q2')
    color = '366092'
    const periodRow = worksheet.addRow([title])
    periodRow.font = { size: 15, color: { argb: fgColor } }

    worksheet.getCell('A' + 3).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color },
    }
    periodRow.alignment = { horizontal: 'center', vertical: 'middle' }
    periodRow.height = 30
    worksheet.mergeCells('A3:Q3')
    worksheet.views = [
      { state: 'frozen', ySplit: 1 }, // Fija la primera fila
      { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
      { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
      { state: 'frozen', ySplit: 4 }, // Fija la cuarta fila
    ]
    // Añadir columnas de datos (encabezados)
    this.addHeadRow(worksheet)
    assists.sort((a, b) => a.department.departmentId - b.department.departmentId)
    for await (const assist of assists) {
      for await (const employee of assist.employees) {
        const newRows = await this.addRowCalendar(employee.employee, employee.calendar, dateEnd)
        for await (const row of newRows) {
          rows.push(row)
        }
      }
    }
    await this.addRowToWorkSheet(rows, worksheet)
    // Convertir a blob y guardar
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, 'Assistance Report.xlsx')
    myGeneralStore.setFullLoader(false)
  }

  async getExcelIncidentSummary(assists: any[], title: string, dateEnd: string) {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook()
    // hasta aquí era lo de asistencia
    const worksheet = workbook.addWorksheet('Incident Summary')
    await this.addTitleIncidentToWorkSheet(workbook, worksheet, title)
    this.addHeadRowIncident(worksheet)
    const tardies = await this.getTardiesTolerance()
    const toleranceCountPerAbsences = await this.getToleranceCountPerAbsence()
    const rowsIncident = [] as AssistIncidentExcelRowInterface[]
    assists.sort((a, b) => a.department.departmentId - b.department.departmentId);
    let currentDepartmentId = 0
    let totalRowByDepartmentIncident = {} as AssistIncidentExcelRowInterface
    const totalRowIncident = {} as AssistIncidentExcelRowInterface
    this.cleanTotalByDepartment(totalRowIncident)
    this.cleanTotalByDepartment(totalRowByDepartmentIncident)
    let hasEmployees = false
    for await (const assist of assists) {

      if (currentDepartmentId != assist.department.departmentId) {
        if (currentDepartmentId > 0 && hasEmployees) {
          hasEmployees = false
          rowsIncident.push(JSON.parse(JSON.stringify(totalRowByDepartmentIncident)))
          this.addTotalRow(totalRowIncident, totalRowByDepartmentIncident)
          this.cleanTotalByDepartment(totalRowByDepartmentIncident)
        }

        currentDepartmentId = assist.department.departmentId

      }
      for await (const employee of assist.employees) {
        hasEmployees = true
        let newRows = [] as AssistIncidentExcelRowInterface[]
        const incidentSummaryFilters: AssistIncidentSummaryCalendarExcelFilterInterface = {
          employee: employee.employee,
          employeeCalendar: employee.calendar,
          tardies: tardies,
          toleranceCountPerAbsences: toleranceCountPerAbsences,
          dateEnd: dateEnd
        }
        newRows = await this.addRowIncidentCalendar(incidentSummaryFilters)
        for await (const row of newRows) {
          this.addTotalByDepartment(totalRowByDepartmentIncident, row)
          rowsIncident.push(row)
        }
      }

    }
    rowsIncident.push(totalRowByDepartmentIncident)
    this.addTotalRow(totalRowIncident, totalRowByDepartmentIncident)
    rowsIncident.push(totalRowIncident)
    await this.addRowIncidentToWorkSheet(rowsIncident, worksheet)
    // Convertir a blob y guardar
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, 'Incident summary Report.xlsx')
    myGeneralStore.setFullLoader(false)
  }

  async getExcelIncidentSummaryPayRoll(filters: AssistExcelFilterIncidentSummaryPayRollInterface) {
    const myGeneralStore = useMyGeneralStore()
    myGeneralStore.setFullLoader(true)
    await this.getBusinessUnits()
    const workbook = new ExcelJS.Workbook()
    const rowsIncidentPayroll = [] as AssistIncidentPayrollExcelRowInterface[]
    const worksheet = workbook.addWorksheet('Incident Summary Payroll')
    await this.addTitleIncidentPayrollToWorkSheet(workbook, worksheet, filters.title)
    this.addHeadRowIncidentPayroll(worksheet)
    const tardies = await this.getTardiesTolerance()
    const toleranceCountPerAbsences = await this.getToleranceCountPerAbsence()
    filters.assists.sort((a, b) => a.department.departmentId - b.department.departmentId)
    let totalRowByDepartmentIncident = {} as AssistIncidentExcelRowInterface
    const totalRowIncident = {} as AssistIncidentExcelRowInterface
    this.cleanTotalByDepartment(totalRowIncident)
    this.cleanTotalByDepartment(totalRowByDepartmentIncident)
    for await (const assist of filters.assists) {
      for await (const employee of assist.employees) {
        let newRows = [] as AssistIncidentPayrollExcelRowInterface[]
        const incidentPayrollFilters: AssistIncidentPayrollCalendarExcelFilterInterface = {
          employee: employee.employee,
          employeeCalendar: employee.calendar,
          tardies: tardies,
          datePay: filters.datePay,
          toleranceCountPerAbsences: toleranceCountPerAbsences,
          employeeWorkDisabilities: filters.employeeWorkDisabilities
        }
        newRows = await this.addRowIncidentPayrollCalendar(
          incidentPayrollFilters
        )
        for await (const row of newRows) {
          rowsIncidentPayroll.push(row)
        }
      }

    }
    await this.addRowIncidentPayrollToWorkSheet(rowsIncidentPayroll, worksheet)
    this.paintBorderAll(worksheet, rowsIncidentPayroll.length)
    // Convertir a blob y guardar
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, 'Incident summary payroll Report.xlsx')
    myGeneralStore.setFullLoader(false)
  }

  async addImageLogo(workbook: ExcelJS.Workbook, worksheet: ExcelJS.Worksheet, type: string) {
    const myGeneralStore = useMyGeneralStore()
    const imageLogoUrl = myGeneralStore.backgroundImage ? myGeneralStore.backgroundImage : 'https://sae-assets.sfo3.cdn.digitaloceanspaces.com/general/logos/logo_sae.webp'
    const imageResponse = await axios.get(imageLogoUrl, { responseType: 'arraybuffer' })
    const imageBuffer = imageResponse.data

    // Convertir imagen a base64 para obtener dimensiones
    const blob = new Blob([imageBuffer])
    const image = new Image();
    const imageUrl = URL.createObjectURL(blob)

    await new Promise((resolve) => {
      image.onload = resolve
      image.src = imageUrl
    })

    const imageWidth = image.width
    const imageHeight = image.height

    const targetWidth = 139
    const targetHeight = 49

    const scale = Math.min(targetWidth / imageWidth, targetHeight / imageHeight)
    let adjustedWidth = imageWidth * scale
    let adjustedHeight = imageHeight * scale

    let col = 0.27
    if (col === 0.27) {
      const increaseFactor = 1.05
      adjustedWidth *= increaseFactor
      adjustedHeight *= increaseFactor
    }

    const imageId = workbook.addImage({
      buffer: imageBuffer,
      extension: 'png',
    })
    if (type != 'payroll') {
      worksheet.addImage(imageId, {
        tl: { col, row: 0.6 },
        ext: { width: adjustedWidth, height: adjustedHeight },
      })
    } else {
      col = 14.2
      const increaseFactor = 1.3
      adjustedWidth *= increaseFactor
      adjustedHeight *= increaseFactor
      worksheet.addImage(imageId, {
        tl: { col, row: 1.2 },
        ext: { width: adjustedWidth, height: adjustedHeight },
      })
    }

  }

  addHeadRow(worksheet: ExcelJS.Worksheet) {
    const headerRow = worksheet.addRow([
      'Employee ID',
      'Employee Name',
      'Department',
      'Position',
      'Date',
      '',
      'Shift Assigned',
      'Shift Start Date',
      'Shift Ends Date',
      '',
      'Check-in',
      'Check go Eat',
      'Check back from Eat',
      'Check-out',
      'Hours worked',
      'Status',
      'Exception Notes',
    ])
    let fgColor = 'FFFFFFF'
    let color = '538DD5'
    for (let col = 1; col <= 6; col++) {
      const cell = worksheet.getCell(4, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    color = '16365C'
    for (let col = 7; col <= 9; col++) {
      const cell = worksheet.getCell(4, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    color = '538DD5'
    for (let col = 10; col <= 17; col++) {
      const cell = worksheet.getCell(4, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    headerRow.height = 30
    headerRow.font = { bold: true, color: { argb: fgColor } }
    const columnA = worksheet.getColumn(1)
    columnA.width = 20
    columnA.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnB = worksheet.getColumn(2)
    columnB.width = 44
    columnB.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnC = worksheet.getColumn(3)
    columnC.width = 44
    columnC.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnD = worksheet.getColumn(4)
    columnD.width = 44
    columnD.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnE = worksheet.getColumn(5)
    columnE.width = 25
    columnE.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnF = worksheet.getColumn(6)
    columnF.width = 5
    columnF.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnG = worksheet.getColumn(7)
    columnG.width = 25
    columnG.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnH = worksheet.getColumn(8)
    columnH.width = 25
    columnH.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnI = worksheet.getColumn(9)
    columnI.width = 25
    columnI.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnJ = worksheet.getColumn(10)
    columnJ.width = 5
    columnJ.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnK = worksheet.getColumn(11)
    columnK.width = 25
    columnK.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnL = worksheet.getColumn(12)
    columnL.width = 25
    columnL.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnM = worksheet.getColumn(13)
    columnM.width = 25
    columnM.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnN = worksheet.getColumn(14)
    columnN.width = 25
    columnN.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnO = worksheet.getColumn(15)
    columnO.width = 25
    columnO.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnP = worksheet.getColumn(16)
    columnP.width = 30
    columnP.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnQ = worksheet.getColumn(17)
    columnQ.width = 30
    columnQ.alignment = { vertical: 'middle', horizontal: 'center' }
  }

  async addRowCalendar(employee: EmployeeInterface, employeeCalendar: AssistDayInterface[], dateEnd: string) {
    const rows = [] as AssistExcelRowInterface[]
    const dateEndFormat = new Date(dateEnd);
    for await (const calendar of employeeCalendar) {
      const date = new Date(calendar.day);
      if (date <= dateEndFormat) {

        const exceptions = [] as ShiftExceptionInterface[]
        if (calendar.assist.exceptions.length > 0) {
          for await (const exception of calendar.assist.exceptions) {
            exceptions.push(exception)
          }
        }
        const day = this.dateDay(calendar.day)
        const month = this.dateMonth(calendar.day)
        const year = this.dateYear(calendar.day)
        const calendarDay = this.calendarDayMonth(year, month, day)
        const firstCheck = this.chekInTime(calendar)
        const lastCheck = this.chekOutTime(calendar)
        let status = calendar.assist.checkInStatus
          ? `${calendar.assist.checkInStatus}`.toUpperCase()
          : ''
        if (calendar.assist.isFutureDay) {
          status = 'NEXT'
        } else if (calendar.assist.isRestDay && !firstCheck) {
          status = 'REST'
        } else if (calendar.assist.isVacationDate && status !== 'ONTIME') {
          status = 'VACATIONS'
        } else if (calendar.assist.isHoliday) {
          status = 'HOLIDAY'
        }
        if (!calendar.assist.dateShift) {
          status = ''
        }
        let department = employee.department?.departmentAlias
          ? employee.department.departmentAlias
          : ''
        department =
          department === '' && employee.department?.departmentName
            ? employee.department.departmentName
            : ''
        let position = employee.position?.positionAlias ? employee.position.positionAlias : ''
        position =
          position === '' && employee.position?.positionName ? employee.position.positionName : ''
        let shiftName = ''
        let shiftStartDate = ''
        let shiftEndsDate = ''
        let hoursWorked = 0
        if (calendar && calendar.assist && calendar.assist.dateShift) {
          shiftName = calendar.assist.dateShift.shiftName
          shiftStartDate = calendar.assist.dateShift.shiftTimeStart
          const hoursToAddParsed = 0
          const time = DateTime.fromFormat(shiftStartDate, 'HH:mm:ss')
          const newTime = time.plus({ hours: hoursToAddParsed })
          shiftEndsDate = newTime.toFormat('HH:mm:ss')
        }

        const checkInTime = calendar.assist.checkIn?.assistPunchTimeUtc
        const checkOutTime = calendar.assist.checkOut?.assistPunchTimeUtc

        const firstCheckTime = checkInTime ? DateTime.fromISO(checkInTime.toString(), { zone: 'UTC-6' }) : null
        const lastCheckTime = checkOutTime ? DateTime.fromISO(checkOutTime.toString(), { zone: 'UTC-6' }) : null

        if (firstCheckTime && lastCheckTime && firstCheckTime.isValid && lastCheckTime.isValid) {
          const durationInMinutes = lastCheckTime.diff(firstCheckTime, 'minutes').as('minutes')
          let hours = Math.floor(durationInMinutes / 60)
          let minutes = Math.round(durationInMinutes % 60)
          if (minutes >= 60) {
            hours += Math.floor(minutes / 60)
            minutes = minutes % 60
          }
          const timeInDecimal = hours + minutes / 60
          hoursWorked += timeInDecimal
        }

        const rowCheckInTime = calendar.assist.checkIn?.assistPunchTimeUtc && !calendar.assist.isFutureDay ? DateTime.fromISO(calendar.assist.checkIn.assistPunchTimeUtc.toString(), { setZone: true }).setZone('UTC-6').toFormat('ff') : ''
        const rowLunchTime = calendar.assist?.checkEatIn?.assistPunchTimeUtc ? DateTime.fromISO(calendar.assist.checkEatIn.assistPunchTimeUtc.toString(), { setZone: true }).setZone('UTC-6').toFormat('MMM d, yyyy, h:mm:ss a') : ''
        const rowReturnLunchTime = calendar?.assist?.checkEatOut?.assistPunchTimeUtc ? DateTime.fromISO(calendar.assist.checkEatOut.assistPunchTimeUtc.toString(), { setZone: true }).setZone('UTC-6').toFormat('MMM d, yyyy, h:mm:ss a') : ''
        const rowCheckOutTime = calendar.assist.checkOut?.assistPunchTimeUtc && !calendar.assist.isFutureDay ? DateTime.fromISO(calendar.assist.checkOut?.assistPunchTimeUtc.toString(), { setZone: true }).setZone('UTC-6').toFormat('ff') : ''

        rows.push({
          code: employee.employeeCode.toString(),
          name: `${employee.employeeFirstName} ${employee.employeeLastName}`,
          department: department,
          position: position,
          date: calendarDay,
          shiftAssigned: shiftName,
          shiftStartDate: shiftStartDate,
          shiftEndsDate: shiftEndsDate,
          checkInTime: rowCheckInTime,
          firstCheck: firstCheck,
          lunchTime: rowLunchTime,
          returnLunchTime: rowReturnLunchTime,
          checkOutTime: rowCheckOutTime,
          lastCheck: lastCheck,
          hoursWorked: hoursWorked,
          incidents: status,
          notes: '',
          sundayPremium: '',
          checkOutStatus: calendar.assist.checkOutStatus,
          exceptions: exceptions,
        })
      }

    }
    return rows
  }

  dateYear(day: string) {
    if (!day) {
      return 0
    }

    const year = Number.parseInt(`${day.split('-')[0]}`)
    return year
  }

  dateMonth(day: string) {
    if (!day) {
      return 0
    }

    const month = Number.parseInt(`${day.split('-')[1]}`)
    return month
  }

  dateDay(day: string) {
    if (!day) {
      return 0
    }

    const dayTemp = Number.parseInt(`${day.split('-')[2]}`)
    return dayTemp
  }

  calendarDay(dateYear: number, dateMonth: number, dateDay: number) {
    const date = DateTime.local(dateYear, dateMonth, dateDay, 0).setLocale('en')
    const day = date.toFormat('DDD')
    return day
  }

  calendarDayMonth(dateYear: number, dateMonth: number, dateDay: number) {
    const date = DateTime.local(dateYear, dateMonth, dateDay, 0)
    const day = date.toFormat('dd/MMMM')
    return day
  }

  chekInTime(checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.checkIn?.assistPunchTimeUtc) {
      return ''
    }
    const timeCheckIn = DateTime.fromISO(
      checkAssist.assist.checkIn.assistPunchTimeUtc.toString(),
      { setZone: true }
    ).setZone('UTC-6')
    return timeCheckIn.toFormat('MMM d, yyyy, h:mm:ss a')
  }

  chekOutTime(checkAssist: AssistDayInterface) {
    if (!checkAssist?.assist?.checkOut?.assistPunchTimeUtc) {
      return ''
    }

    const now = DateTime.now().toFormat('yyyy-LL-dd')
    const timeCheckOut = DateTime.fromISO(
      checkAssist.assist.checkOut.assistPunchTimeUtc.toString(),
      { setZone: true }
    ).setZone('UTC-6')
    if (timeCheckOut.toFormat('yyyy-LL-dd') === now) {
      checkAssist.assist.checkOutStatus = ''
      return ''
    }
    return timeCheckOut.toFormat('MMM d, yyyy, h:mm:ss a')
  }

  async addRowToWorkSheet(
    rows: AssistExcelRowInterface[],
    worksheet: ExcelJS.Worksheet,
    status: string = 'Active'
  ) {
    let rowCount = 5
    let faultsTotal = 0
    for await (const rowData of rows) {
      if (rowData.incidents.toString().toUpperCase() === 'FAULT') {
        faultsTotal += 1
      }
      let incidents =
        !rowData.name && rowData.code !== '0'
          ? faultsTotal.toString().padStart(2, '0') + ' TOTAL FAULTS'
          : rowData.incidents
      worksheet.addRow([
        rowData.code !== '0' ? rowData.code : '',
        rowData.name,
        rowData.department,
        rowData.position,
        rowData.date,
        '',
        rowData.shiftAssigned,
        rowData.shiftStartDate,
        rowData.shiftEndsDate,
        '',
        rowData.firstCheck,
        rowData.lunchTime,
        rowData.returnLunchTime,
        rowData.lastCheck,
        this.decimalToTimeString(rowData.hoursWorked),
        incidents,
        rowData.notes,
      ])
      if (rowData.name) {
        this.paintIncidents(worksheet, rowCount, rowData.incidents)
        this.paintCheckOutStatus(worksheet, rowCount, rowData.checkOutStatus)
        if (status === 'Terminated') {
          this.paintEmployeeTerminated(worksheet, 'B', rowCount)
        }
      }
      if (rowData.exceptions.length > 0) {
        await this.addExceptions(rowData, worksheet, rowCount)
      }
      if (!rowData.name && rowData.code !== '0') {
        const color = 'FDE9D9'
        for (let col = 1; col <= 17; col++) {
          const cell = worksheet.getCell(rowCount, col)
          const row = worksheet.getRow(rowCount)
          row.height = 21
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color },
          }
        }
        faultsTotal = 0
      }
      rowCount += 1
    }
  }

  decimalToTimeString(decimal: number): string {
    const hours = Math.floor(decimal)
    const minutes = Math.round((decimal - hours) * 60)
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  paintIncidents(worksheet: ExcelJS.Worksheet, row: number, value: string) {
    let color = 'FFFFFFF'
    let fgColor = 'FFFFFFF'
    if (value === 'FAULT') {
      color = 'FFD45633'
      fgColor = 'FFFFFFF'
    } else if (value === 'ONTIME') {
      color = 'FF33D4AD'
      fgColor = 'FFFFFFF'
    } else if (value === 'NEXT') {
      color = 'E4E4E4'
      fgColor = '000000'
    } else if (value === 'REST') {
      color = 'E4E4E4'
      fgColor = '000000'
    } else if (value === 'VACATIONS') {
      color = 'FFFFFFF'
      fgColor = '000000'
    } else if (value === 'HOLIDAY') {
      color = 'FFFFFFF'
      fgColor = '000000'
    } else if (value === 'DELAY') {
      color = 'FF993A'
    } else if (value === 'TOLERANCE') {
      color = '3CB4E5'
    } else if (value === 'EXCEPTION') {
      fgColor = '000000'
    }
    worksheet.getCell('P' + row).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }, // Color de fondo rojo
    }
    worksheet.getCell('P' + row).font = {
      color: { argb: fgColor }, // Color de fondo rojo
    }
  }

  paintCheckOutStatus(worksheet: ExcelJS.Worksheet, row: number, value: string) {
    if (value.toString().toUpperCase() === 'DELAY') {
      const fgColor = 'FF993A'
      worksheet.getCell('N' + row).font = {
        color: { argb: fgColor },
      }
    }
  }

  paintEmployeeTerminated(worksheet: ExcelJS.Worksheet, columnName: string, row: number) {
    const color = 'FFD45633'
    const fgColor = 'FFFFFFF'
    worksheet.getCell(columnName + row).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }, // Color de fondo rojo
    }
    worksheet.getCell(columnName + row).font = {
      color: { argb: fgColor }, // Color de fondo rojo
    }
  }

  async addExceptions(
    rowData: AssistExcelRowInterface,
    worksheet: ExcelJS.Worksheet,
    rowCount: number
  ) {
    const richText = []
    for await (const exception of rowData.exceptions) {
      const type = exception.exceptionType ? exception.exceptionType.exceptionTypeTypeName : ''
      const description = exception.shiftExceptionsDescription
        ? exception.shiftExceptionsDescription
        : ''
      richText.push(
        { text: type, font: { bold: true, size: 12, color: { argb: '000000' } } },
        { text: `\n${description}\n`, font: { italic: true, size: 10, color: { argb: '000000' } } }
      )
    }
    const cell = worksheet.getCell('Q' + rowCount)
    cell.value = {
      richText: richText,
    }
    cell.alignment = { wrapText: true }
  }

  cleanTotalByDepartment(totalRowIncident: AssistIncidentExcelRowInterface) {
    totalRowIncident.employeeId = ''
    totalRowIncident.employeeName = 'null'
    totalRowIncident.daysOnTime = 0
    totalRowIncident.tolerances = 0
    totalRowIncident.delays = 0
    totalRowIncident.earlyOuts = 0
    totalRowIncident.rests = 0
    totalRowIncident.sundayBonus = 0
    totalRowIncident.vacations = 0
    totalRowIncident.exeptions = 0
    totalRowIncident.holidaysWorked = 0
    totalRowIncident.restWorked = 0
    totalRowIncident.faults = 0
    totalRowIncident.delayFaults = 0
    totalRowIncident.earlyOutsFaults = 0
    totalRowIncident.totalFaults = 0
    totalRowIncident.hoursWorked = 0
  }

  async addRowIncidentCalendar(
    filters: AssistIncidentSummaryCalendarExcelFilterInterface
  ) {
    const rows = [] as AssistIncidentExcelRowInterface[]
    let department = filters.employee.department?.departmentAlias ? filters.employee.department.departmentAlias : ''
    department =
      department === '' && filters.employee.department?.departmentName
        ? filters.employee.department.departmentName
        : ''
    let daysWorked = 0
    let daysOnTime = 0
    let tolerances = 0
    let delays = 0
    let earlyOuts = 0
    let rests = 0
    let sundayBonus = 0
    let vacations = 0
    let holidaysWorked = 0
    let restWorked = 0
    let faults = 0
    let delayFaults = 0
    let earlyOutsFaults = 0
    let hoursWorked = 0
    const dateEndFormat = new Date(filters.dateEnd)
    const exceptions = [] as ShiftExceptionInterface[]
    for await (const calendar of filters.employeeCalendar) {
      const date = new Date(calendar.day);
      if (date <= dateEndFormat) {
        if (!calendar.assist.isFutureDay) {
          let faultProcessed = false
          let holidayWorked = false
          if (calendar.assist.isHoliday && calendar.assist.checkIn) {
            holidaysWorked += 1
            holidayWorked = true
          }
          if (calendar.assist.exceptions.length > 0) {
            for await (const exception of calendar.assist.exceptions) {
              if (exception.exceptionType) {
                const exceptionTypeSlug = exception.exceptionType.exceptionTypeSlug
                if (exceptionTypeSlug !== 'rest-day' && exceptionTypeSlug !== 'vacation') {
                  exceptions.push(exception)
                }
                if (exceptionTypeSlug === 'descanso-laborado' && !holidayWorked) {
                  if (
                    exception.shiftExceptionEnjoymentOfSalary &&
                    exception.shiftExceptionEnjoymentOfSalary === 1 &&
                    calendar.assist.checkIn
                  ) {
                    restWorked += 1
                  }
                }
                if (
                  exceptionTypeSlug === 'absence-from-work' &&
                  exception.shiftExceptionEnjoymentOfSalary !== 1
                ) {
                  faultProcessed = true
                  if (
                    calendar.assist.dateShift &&
                    calendar.assist.dateShift.shiftAccumulatedFault > 0
                  ) {
                    faults += calendar.assist.dateShift.shiftAccumulatedFault
                  } else {
                    faults += 1
                  }
                }
              }
            }
          }
          const firstCheck = this.chekInTime(calendar)
          if (calendar.assist.dateShift) {
            daysWorked += 1
            if (calendar.assist.checkInStatus !== 'fault') {
              if (calendar.assist.checkInStatus === 'ontime') {
                daysOnTime += 1
              } else if (calendar.assist.checkInStatus === 'tolerance') {
                tolerances += 1
              } else if (calendar.assist.checkInStatus === 'delay') {
                delays += 1
              }
            }
            if (calendar.assist.checkOutStatus !== 'fault') {
              if (calendar.assist.checkOutStatus === 'delay') {
                earlyOuts += 1
              }
            }
            if (
              calendar.assist.isSundayBonus &&
              (calendar.assist.checkIn ||
                calendar.assist.checkOut ||
                (calendar.assist.assitFlatList && calendar.assist.assitFlatList.length > 0))
            ) {
              sundayBonus += 1
            }
            if (calendar.assist.isRestDay && !firstCheck) {
              rests += 1
            }
            if (calendar.assist.isVacationDate) {
              vacations += 1
            }
            if (
              calendar.assist.checkInStatus === 'fault' &&
              !calendar.assist.isRestDay &&
              !faultProcessed
            ) {
              if (calendar.assist.dateShift && calendar.assist.dateShift.shiftAccumulatedFault > 0) {
                faults += calendar.assist.dateShift.shiftAccumulatedFault
              } else {
                faults += 1
              }
            }
          }
          const checkInTime = calendar.assist.checkIn?.assistPunchTimeUtc
          const checkOutTime = calendar.assist.checkOut?.assistPunchTimeUtc

          const firstCheckTime = checkInTime ? DateTime.fromISO(checkInTime.toString(), { zone: 'UTC-6' }) : null
          const lastCheckTime = checkOutTime ? DateTime.fromISO(checkOutTime.toString(), { zone: 'UTC-6' }) : null

          if (firstCheckTime && lastCheckTime && firstCheckTime.isValid && lastCheckTime.isValid) {
            const duration = lastCheckTime.diff(firstCheckTime, 'minutes')
            const hours = Math.floor(duration.as('minutes') / 60)
            const minutes = duration.as('minutes') % 60
            hoursWorked += hours + minutes / 60
          }
        }
      }

    }

    const delayTolerances = this.getFaultsFromDelays(tolerances, filters.toleranceCountPerAbsences)
    delays += delayTolerances

    delayFaults = this.getFaultsFromDelays(delays, filters.tardies)
    earlyOutsFaults = this.getFaultsFromDelays(earlyOuts, filters.tardies)
    rows.push({
      employeeId: filters.employee.employeeCode.toString(),
      employeeName: `${filters.employee.employeeFirstName} ${filters.employee.employeeLastName}`,
      department: department,
      daysWorked: daysWorked,
      daysOnTime: daysOnTime,
      tolerances: tolerances,
      delays: delays,
      earlyOuts: earlyOuts,
      rests: rests,
      sundayBonus: sundayBonus,
      vacations: vacations,
      exeptions: exceptions.length,
      holidaysWorked: holidaysWorked,
      restWorked: restWorked,
      faults: faults,
      delayFaults: delayFaults,
      earlyOutsFaults: earlyOutsFaults,
      totalFaults: faults + delayFaults + earlyOutsFaults,
      hoursWorked: hoursWorked,
    })
    return rows
  }

  private addRowIncidentExcelEmpty(rows: AssistIncidentExcelRowInterface[]) {
    rows.push({
      employeeId: '',
      employeeName: '',
      department: '',
      daysWorked: 0,
      daysOnTime: 0,
      tolerances: 0,
      delays: 0,
      earlyOuts: 0,
      rests: 0,
      sundayBonus: 0,
      vacations: 0,
      exeptions: 0,
      holidaysWorked: 0,
      restWorked: 0,
      faults: 0,
      delayFaults: 0,
      earlyOutsFaults: 0,
      totalFaults: 0,
      hoursWorked: 0,
    })
  }

  private addRowIncidentExcelEmptyWithCode(rows: AssistIncidentExcelRowInterface[]) {
    rows.push({
      employeeId: '0',
      employeeName: '',
      department: '',
      daysWorked: 0,
      daysOnTime: 0,
      tolerances: 0,
      delays: 0,
      earlyOuts: 0,
      rests: 0,
      sundayBonus: 0,
      vacations: 0,
      exeptions: 0,
      holidaysWorked: 0,
      restWorked: 0,
      faults: 0,
      delayFaults: 0,
      earlyOutsFaults: 0,
      totalFaults: 0,
      hoursWorked: 0,
    })
  }

  async addRowIncidentToWorkSheet(
    rows: AssistIncidentExcelRowInterface[],
    worksheet: ExcelJS.Worksheet
  ) {
    let rowCount = 5
    let currentDepartment = ''
    let currentDepartmentRow = 5
    for await (const rowData of rows) {
      if (rowData.employeeName !== 'null') {
        if (currentDepartment !== rowData.department && rowData.department) {
          if (currentDepartment !== '') {
            worksheet.mergeCells(`A${currentDepartmentRow}:A${rowCount - 3}`)
            for (let rowCurrent = currentDepartmentRow; rowCurrent < rowCount - 2; rowCurrent++) {
              const cell = worksheet.getCell(rowCurrent, 1)
              const color = '93CDDC'
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: color },
              }
              cell.font = { color: { argb: 'FFFFFF' } }
            }
          }
          currentDepartment = rowData.department

          currentDepartmentRow = rowCount - 1
        }
        worksheet.addRow([
          rowData.department,
          rowData.employeeId,
          rowData.employeeName,
          rowData.daysWorked,
          rowData.daysOnTime,
          rowData.tolerances,
          rowData.delays,
          rowData.earlyOuts,
          rowData.rests,
          rowData.sundayBonus,
          rowData.vacations,
          rowData.exeptions,
          rowData.holidaysWorked,
          rowData.restWorked,
          rowData.faults,
          rowData.delayFaults,
          rowData.earlyOutsFaults,
          rowData.totalFaults,
          this.decimalToTimeString(rowData.hoursWorked),
        ])
        if (!rowData.employeeName && rowData.employeeId === '') {
          const color = '93CDDC'
          for (let col = 1; col <= 19; col++) {
            const cell = worksheet.getCell(rowCount - 1, col)
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: color },
            }
            cell.font = { color: { argb: 'FFFFFF' } }
          }
        }
        if (rowData.department === 'TOTALS') {
          const color = '30869C'
          for (let col = 1; col <= 19; col++) {
            const cell = worksheet.getCell(rowCount - 1, col)
            const row = worksheet.getRow(rowCount - 1)
            row.height = 30
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: color },
            }
            cell.font = { color: { argb: 'FFFFFF' } }
          }
        }
        rowCount += 1
      }
    }
  }

  async addTitleIncidentToWorkSheet(
    workbook: ExcelJS.Workbook,
    worksheet: ExcelJS.Worksheet,
    title: string
  ) {
    /*  const assistExcelImageInterface = {
       workbook: workbook,
       worksheet: worksheet,
       col: 0.28,
       row: 0.7,
     } as AssistExcelImageInterface */
    await this.addImageLogo(workbook, worksheet, 'incident-summary')
    worksheet.getRow(1).height = 60
    const fgColor = '000000'
    worksheet.getCell('B1').value = title
    worksheet.getCell('B1').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.mergeCells('B1:R1')
    worksheet.views = [
      { state: 'frozen', ySplit: 1 }, // Fija la primera fila
      { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
      { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
    ]
    worksheet.addRow([])
  }

  getFaultsFromDelays(delays: number, tardies: number) {
    const faults = Math.floor(delays / tardies) // Cada 3 retardos es 1 falta
    return faults
  }

  addTotalByDepartment(
    totalRowIncident: AssistIncidentExcelRowInterface,
    row: AssistIncidentExcelRowInterface
  ) {
    totalRowIncident.employeeId = ''
    totalRowIncident.employeeName = ''
    totalRowIncident.daysOnTime += row.daysOnTime
    totalRowIncident.tolerances += row.tolerances
    totalRowIncident.delays += row.delays
    totalRowIncident.earlyOuts += row.earlyOuts
    totalRowIncident.rests += row.rests
    totalRowIncident.sundayBonus += row.sundayBonus
    totalRowIncident.vacations += row.vacations
    totalRowIncident.exeptions += row.exeptions
    totalRowIncident.holidaysWorked += row.holidaysWorked
    totalRowIncident.restWorked += row.restWorked
    totalRowIncident.faults += row.faults
    totalRowIncident.delayFaults += row.delayFaults
    totalRowIncident.earlyOutsFaults += row.earlyOutsFaults
    totalRowIncident.totalFaults += row.totalFaults
    totalRowIncident.hoursWorked += row.hoursWorked
  }

  addTotalRow(
    totalRowIncident: AssistIncidentExcelRowInterface,
    rowByDepartment: AssistIncidentExcelRowInterface
  ) {
    totalRowIncident.employeeId = ''
    totalRowIncident.employeeName = ''
    totalRowIncident.department = 'TOTALS'
    totalRowIncident.daysOnTime += rowByDepartment.daysOnTime
    totalRowIncident.tolerances += rowByDepartment.tolerances
    totalRowIncident.delays += rowByDepartment.delays
    totalRowIncident.earlyOuts += rowByDepartment.earlyOuts
    totalRowIncident.rests += rowByDepartment.rests
    totalRowIncident.sundayBonus += rowByDepartment.sundayBonus
    totalRowIncident.vacations += rowByDepartment.vacations
    totalRowIncident.exeptions += rowByDepartment.exeptions
    totalRowIncident.holidaysWorked += rowByDepartment.holidaysWorked
    totalRowIncident.restWorked += rowByDepartment.restWorked
    totalRowIncident.faults += rowByDepartment.faults
    totalRowIncident.delayFaults += rowByDepartment.delayFaults
    totalRowIncident.earlyOutsFaults += rowByDepartment.earlyOutsFaults
    totalRowIncident.totalFaults += rowByDepartment.totalFaults
    totalRowIncident.hoursWorked += rowByDepartment.hoursWorked
  }

  async getTardiesTolerance() {
    let tardies = 0
    const toleranceService = new ToleranceService()
    const toleranceResponse = await toleranceService.getTardinessTolerance()
    if (toleranceResponse.status === 200) {
      const tolerance = toleranceResponse._data.data.tardinessTolerance
      if (tolerance) {
        tardies = tolerance.toleranceMinutes
      }
      if (tardies === 0) {
        tardies = 3
      }
    }

    if (tardies === 0) {
      tardies = 3
    }
    return tardies
  }

  addHeadRowIncident(worksheet: ExcelJS.Worksheet) {
    const headerRow = worksheet.addRow([
      'Department',
      'Employee ID',
      'Employee Name',
      'Days Worked',
      'On Time',
      'Tolerances',
      'Delays',
      'Early Outs',
      'Rests',
      'Sunday Bonus',
      'Vacations',
      'Exceptions',
      'Holidays Worked',
      'Rest Worked',
      'Faults',
      'Delays Faults',
      'Early Outs Faults',
      'Total Faults',
      'Total Hours Worked',
    ])
    let fgColor = 'FFFFFFF'
    let color = '30869C'
    for (let col = 1; col <= 19; col++) {
      const cell = worksheet.getCell(3, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    headerRow.height = 30
    headerRow.font = { bold: true, color: { argb: fgColor } }
    const columnA = worksheet.getColumn(1)
    columnA.width = 23
    columnA.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnB = worksheet.getColumn(2)
    columnB.width = 16
    columnB.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnC = worksheet.getColumn(3)
    columnC.width = 32
    columnC.alignment = { vertical: 'middle', horizontal: 'left' }
    const columnD = worksheet.getColumn(4)
    columnD.width = 16
    columnD.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnE = worksheet.getColumn(5)
    columnE.width = 16
    columnE.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnF = worksheet.getColumn(6)
    columnF.width = 16
    columnF.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnG = worksheet.getColumn(7)
    columnG.width = 16
    columnG.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnH = worksheet.getColumn(8)
    columnH.width = 16
    columnH.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnI = worksheet.getColumn(9)
    columnI.width = 16
    columnI.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnJ = worksheet.getColumn(10)
    columnJ.width = 16
    columnJ.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnK = worksheet.getColumn(11)
    columnK.width = 16
    columnK.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnL = worksheet.getColumn(12)
    columnL.width = 16
    columnL.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnM = worksheet.getColumn(13)
    columnM.width = 16
    columnM.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnN = worksheet.getColumn(14)
    columnN.width = 16
    columnN.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnO = worksheet.getColumn(15)
    columnO.width = 16
    columnO.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnP = worksheet.getColumn(16)
    columnP.width = 16
    columnP.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnQ = worksheet.getColumn(17)
    columnQ.width = 16
    columnQ.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnR = worksheet.getColumn(18)
    columnR.width = 16
    columnR.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnS = worksheet.getColumn(19)
    columnS.width = 16
    columnS.alignment = { vertical: 'middle', horizontal: 'center' }
  }

  async addTitleIncidentPayrollToWorkSheet(
    workbook: ExcelJS.Workbook,
    worksheet: ExcelJS.Worksheet,
    title: string
  ) {
    worksheet.addRow([title])
    worksheet.addRow(['', '', '', title])
    await this.addImageLogo(workbook, worksheet, 'payroll')
    worksheet.getRow(2).height = 45
    const fgColor = 'FFFFFF'

    worksheet.getCell('D2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('F2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('G2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('H2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('I2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('J2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('K2').font = { bold: true, size: 18, color: { argb: fgColor } }
    worksheet.getCell('L2').font = { bold: true, size: 18, color: { argb: fgColor } }
    let cell = worksheet.getCell(2, 4)
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '203864' },
    }
    worksheet.getCell('D2').alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.mergeCells('D2:L2')
    worksheet.mergeCells('A2:C4')
    worksheet.mergeCells('M2:O4')
    worksheet.mergeCells('A1:O1')
    worksheet.mergeCells('D3:L4')
    cell = worksheet.getCell(3, 4)
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF' },
    }
    worksheet.views = [
      { state: 'frozen', ySplit: 1 }, // Fija la primera fila
      { state: 'frozen', ySplit: 2 }, // Fija la segunda fila
      { state: 'frozen', ySplit: 3 }, // Fija la tercer fila
      { state: 'frozen', ySplit: 5 }, // Fija la tercer fila
    ]
  }

  addHeadRowIncidentPayroll(worksheet: ExcelJS.Worksheet) {
    const headerRow = worksheet.addRow([
      'NOMBRE COMPLETO',
      'ID',
      'DEPARTAMENTO',
      'EMPRESA',
      'FALTA',
      'RETARDO',
      'INC',
      'HRS EX. DOB.',
      'HRS EX. TRI.',
      'P. DOM.',
      'DESC. LAB.',
      'P. VAC.',
      'NIVELACION',
      'BONO',
      'OTROS',
    ])
    let fgColor = '000000'
    let color = 'C9C9C9'
    for (let col = 1; col <= 4; col++) {
      const cell = worksheet.getCell(5, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    color = '305496'
    for (let col = 5; col <= 7; col++) {
      const cell = worksheet.getCell(5, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    color = 'A9D08E'
    for (let col = 8; col <= 14; col++) {
      const cell = worksheet.getCell(5, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    color = '305496'
    for (let col = 15; col <= 15; col++) {
      const cell = worksheet.getCell(5, col)
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      }
    }
    headerRow.height = 40
    fgColor = '000000'
    headerRow.font = { bold: true, color: { argb: fgColor } }
    fgColor = 'FFFFFF'
    const columnA = worksheet.getColumn(1)
    columnA.width = 42
    const columnB = worksheet.getColumn(2)
    columnB.width = 10
    const columnC = worksheet.getColumn(3)
    columnC.width = 28.57
    const columnD = worksheet.getColumn(4)
    columnD.width = 11.43
    for (let index = 1; index <= 4; index++) {
      const cell = worksheet.getCell(5, index)
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
    }
    const columnE = worksheet.getColumn(5)
    columnE.width = 10
    for (let col = 5; col <= 7; col++) {
      const cell = worksheet.getCell(5, col)
      cell.font = { color: { argb: fgColor } }
    }
    columnE.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnF = worksheet.getColumn(6)
    columnF.width = 10
    columnF.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnG = worksheet.getColumn(7)
    columnG.width = 10
    columnG.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnH = worksheet.getColumn(8)
    columnH.width = 10
    columnH.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnI = worksheet.getColumn(9)
    columnI.width = 10
    columnI.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnJ = worksheet.getColumn(10)
    columnJ.width = 10
    columnJ.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnK = worksheet.getColumn(11)
    columnK.width = 10
    columnK.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnL = worksheet.getColumn(12)
    columnL.width = 10
    columnL.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnM = worksheet.getColumn(13)
    columnM.width = 10
    columnM.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnN = worksheet.getColumn(14)
    columnN.width = 10
    columnN.alignment = { vertical: 'middle', horizontal: 'center' }
    const columnO = worksheet.getColumn(15)
    columnO.width = 40
    columnO.font = { color: { argb: fgColor } }
    columnO.alignment = { vertical: 'middle', horizontal: 'center' }
  }

  async addRowIncidentPayrollCalendar(
    filters: AssistIncidentPayrollCalendarExcelFilterInterface
  ) {
    const rows = [] as AssistIncidentPayrollExcelRowInterface[]
    let department = filters.employee.department?.departmentAlias ? filters.employee.department.departmentAlias : ''
    department =
      department === '' && filters.employee.department?.departmentName
        ? filters.employee.department.departmentName
        : department
    let daysWorked = 0
    let daysOnTime = 0
    let tolerances = 0
    let delays = 0
    let earlyOuts = 0
    let rests = 0
    let sundayBonus = 0
    let laborRest = 0
    let overtimeDouble = 0
    let vacations = 0
    let holidaysWorked = 0
    let faults = 0
    let delayFaults = 0
    let earlyOutsFaults = 0
    let vacationBonus = 0
    let daysWorkDisability = 0
    const exceptions = [] as ShiftExceptionInterface[]
    for await (const calendar of filters.employeeCalendar) {
      if (!calendar.assist.isFutureDay) {
        let faultProcessed = false
        let laborRestCounted = false
        if (calendar.assist.exceptions.length > 0) {
          for await (const exception of calendar.assist.exceptions) {
            if (exception.exceptionType) {
              const exceptionTypeSlug = exception.exceptionType.exceptionTypeSlug
              if (exceptionTypeSlug !== 'rest-day' && exceptionTypeSlug !== 'vacation') {
                exceptions.push(exception)
              }
              if (exceptionTypeSlug === 'descanso-laborado') {
                if (
                  exception.shiftExceptionEnjoymentOfSalary &&
                  exception.shiftExceptionEnjoymentOfSalary === 1 &&
                  calendar.assist.checkIn
                ) {
                  laborRest += 1
                  laborRestCounted = true
                }
              } else if (
                exceptionTypeSlug === 'working-during-non-working-hours' &&
                exception.shiftExceptionEnjoymentOfSalary === 1
              ) {
                if (exception.shiftExceptionCheckInTime && exception.shiftExceptionCheckOutTime) {
                  const checkIn = DateTime.fromFormat(
                    exception.shiftExceptionCheckInTime,
                    'HH:mm:ss'
                  )
                  const checkOut = DateTime.fromFormat(
                    exception.shiftExceptionCheckOutTime,
                    'HH:mm:ss'
                  )
                  const duration = checkOut.diff(checkIn, 'hours')
                  overtimeDouble += Math.floor(duration.hours)
                }
              }
              if (
                exceptionTypeSlug === 'absence-from-work' &&
                exception.shiftExceptionEnjoymentOfSalary !== 1
              ) {
                faultProcessed = true
                if (
                  calendar.assist.dateShift &&
                  calendar.assist.dateShift.shiftAccumulatedFault > 0
                ) {
                  faults += calendar.assist.dateShift.shiftAccumulatedFault
                } else {
                  faults += 1
                }
              }
            }
          }
        }
        const firstCheck = this.chekInTime(calendar)
        if (calendar.assist.dateShift) {
          daysWorked += 1
          if (calendar.assist.checkInStatus !== 'fault') {
            if (calendar.assist.checkInStatus === 'ontime') {
              daysOnTime += 1
            } else if (calendar.assist.checkInStatus === 'tolerance') {
              tolerances += 1
            } else if (calendar.assist.checkInStatus === 'delay') {
              delays += 1
            }
          }
          if (calendar.assist.checkOutStatus !== 'fault') {
            if (calendar.assist.checkOutStatus === 'delay') {
              earlyOuts += 1
            }
          }
          if (
            calendar.assist.isSundayBonus &&
            (calendar.assist.checkIn ||
              calendar.assist.checkOut ||
              (calendar.assist.assitFlatList && calendar.assist.assitFlatList.length > 0))
          ) {
            sundayBonus += 1
          }
          if (calendar.assist.isRestDay && !firstCheck) {
            rests += 1
          }
          if (calendar.assist.isVacationDate) {
            vacations += 1
          }
          if (
            calendar.assist.checkInStatus === 'fault' &&
            !calendar.assist.isRestDay && !calendar.assist.isFutureDay &&
            !faultProcessed
          ) {
            if (calendar.assist.dateShift && calendar.assist.dateShift.shiftAccumulatedFault > 0) {
              faults += calendar.assist.dateShift.shiftAccumulatedFault
            } else {
              faults += 1
            }
          }
        }
        if (calendar.assist.isHoliday && calendar.assist.checkIn) {
          holidaysWorked += 1
          if (!laborRestCounted) {
            laborRest += 1
          }
        }
      }
    }

    const delayTolerances = this.getFaultsFromDelays(tolerances, filters.toleranceCountPerAbsences)
    delays += delayTolerances

    delayFaults = this.getFaultsFromDelays(delays, filters.tardies)
    earlyOutsFaults = this.getFaultsFromDelays(earlyOuts, filters.tardies)
    vacationBonus = this.getVacationBonus(filters.employee, filters.datePay)
    if (filters.employee.employeeId) {
      const existEmployee = filters.employeeWorkDisabilities.find(a => a.employeeId === filters.employee.employeeId)
      if (existEmployee && existEmployee.shift_exceptions) {
        daysWorkDisability = existEmployee.shift_exceptions?.length
      } else {
        daysWorkDisability = 0
      }
    } else {
      daysWorkDisability = 0
    }

    let company = ''
    if (filters.employee.payrollBusinessUnitId) {
      const payrollBusinessUnit = this.businessUnits.find(a => a.businessUnitId === filters.employee.payrollBusinessUnitId)
      if (payrollBusinessUnit) {
        company = payrollBusinessUnit.businessUnitName
      }
    }
    rows.push({
      employeeName: `${filters.employee.employeeFirstName} ${filters.employee.employeeLastName}`,
      employeeId: filters.employee.employeeCode.toString(),
      department: department,
      company: company,
      faults: faults,
      delays: delayFaults + earlyOutsFaults,
      inc: daysWorkDisability,
      overtimeDouble: overtimeDouble,
      overtimeTriple: '',
      sundayBonus: sundayBonus,
      laborRest: laborRest,
      vacationBonus: vacationBonus,
      leveling: '',
      bonus: '',
      others: '',
    })
    return rows
  }

  async addRowIncidentPayrollToWorkSheet(
    rows: AssistIncidentPayrollExcelRowInterface[],
    worksheet: ExcelJS.Worksheet
  ) {
    let rowCount = 5
    for await (const rowData of rows) {
      if (rowData.employeeName !== 'null') {
        const fgColor = '000000'
        worksheet.addRow([
          rowData.employeeName,
          rowData.employeeId,
          rowData.department,
          rowData.company,
          rowData.faults ? rowData.faults : '',
          rowData.delays ? rowData.delays : '',
          rowData.inc ? rowData.inc : '',
          rowData.overtimeDouble ? rowData.overtimeDouble : '',
          rowData.overtimeTriple,
          rowData.sundayBonus ? rowData.sundayBonus : '',
          rowData.laborRest ? rowData.laborRest : '',
          rowData.vacationBonus ? rowData.vacationBonus : '',
          rowData.leveling,
          rowData.bonus,
          rowData.others,
        ]).font = { color: { argb: fgColor } }
        let cell = worksheet.getCell(rowCount + 1, 4)
        cell.font = { bold: true }
        if (rowData.faults > 0) {
          cell = worksheet.getCell(rowCount + 1, 5)
          cell.font = { color: { argb: '9C0006' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC7CE' },
          }
        }
        if (rowData.delays > 0) {
          cell = worksheet.getCell(rowCount + 1, 6)
          cell.font = { color: { argb: '9C0006' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFC7CE' },
          }
        }
        if (rowData.inc > 0) {
          cell = worksheet.getCell(rowCount + 1, 7)
          cell.font = { color: { argb: '006100' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C6EFCE' },
          }
        }
        if (rowData.overtimeDouble > 0) {
          cell = worksheet.getCell(rowCount + 1, 8)
          cell.font = { color: { argb: '006100' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C6EFCE' },
          }
        }
        if (rowData.sundayBonus > 0) {
          cell = worksheet.getCell(rowCount + 1, 10)
          cell.font = { color: { argb: '006100' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C6EFCE' },
          }
        }
        if (rowData.vacationBonus > 0) {
          cell = worksheet.getCell(rowCount + 1, 12)
          cell.font = { color: { argb: '006100' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C6EFCE' },
          }
        }
        if (rowData.laborRest > 0) {
          cell = worksheet.getCell(rowCount + 1, 11)
          cell.font = { color: { argb: '006100' } }
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C6EFCE' },
          }
        }
        rowCount += 1
      }
    }
  }

  getVacationBonus(employee: EmployeeInterface, datePay: string) {
    if (!employee.employeeHireDate) {
      return 0
    }
    if (!datePay) {
      return 0
    }

    if (!this.isFirstPayMonth(datePay)) {
      return 0
    }
    if (this.isAnniversaryInPayMonth(employee.employeeHireDate.toString(), datePay)) {
      return 1
    }

    return 0
  }

  isFirstPayMonth(dateString: string) {
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    const dayOfMonth = date.getDate()
    return dayOfMonth >= 1 && dayOfMonth <= 15
  }

  isAnniversaryInPayMonth(hireDate: string, datePay: string) {
    const [hireYear, hireMonth, hireDay] = hireDate.split('-').map(Number)
    const [payYear, payMonth, payDay] = datePay.split('-').map(Number)

    const hire = new Date(hireYear, hireMonth - 1, hireDay)
    const pay = new Date(payYear, payMonth - 1, payDay)


    return hire.getMonth() === pay.getMonth()
  }

  async getTradeName() {
    let tradeName = 'BO'
    const systemSettingService = new SystemSettingService()
    const systemSettingActive = (await systemSettingService.getActive())
    if (systemSettingActive) {
      if (systemSettingActive.systemSettingTradeName) {
        tradeName = systemSettingActive.systemSettingTradeName
      }
    }
    return tradeName
  }

  async getBusinessUnits() {
    const body = await new BusinessUnitService().index()
    this.businessUnits = body.status === 200 ? body._data.data.data || [] : []
  }

  paintBorderAll(worksheet: ExcelJS.Worksheet, rowCount: number) {
    for (let rowIndex = 6; rowIndex <= rowCount + 5; rowIndex++) {
      const row = worksheet.getRow(rowIndex)
      for (let colNumber = 1; colNumber <= 15; colNumber++) {
        const cell = row.getCell(colNumber)
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } },
        }
      }
    }
  }

  async getToleranceCountPerAbsence() {
    let tolerancePerAbsence = 0
    const systemSettingService = new SystemSettingService()
    const systemSettingActive = (await systemSettingService.getActive()) as unknown as SystemSettingInterface
    if (systemSettingActive) {
      if (systemSettingActive.systemSettingToleranceCountPerAbsence) {
        tolerancePerAbsence = systemSettingActive.systemSettingToleranceCountPerAbsence
      }
    }
    if (tolerancePerAbsence === 0) {
      tolerancePerAbsence = 3
    }
    return tolerancePerAbsence
  }

}