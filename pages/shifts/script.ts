import type { RoleSystemPermissionInterface } from "~/resources/scripts/interfaces/RoleSystemPermissionInterface"
import type { ShiftInterface } from "~/resources/scripts/interfaces/ShiftInterface"
import ShiftService from "~/resources/scripts/services/ShiftService"
import { useMyGeneralStore } from "~/store/general"

export default defineComponent({
  name: 'Shifts',
  props: {},
  data: () => ({
    search: '' as string,
    filteredShifts: [] as ShiftInterface[],
    shift: null as ShiftInterface | null,
    currentPage: 1,
    totalRecords: 0,
    first: 0,
    last: 0,
    rowsPerPage: 9999,
    drawerShiftForm: false,
    drawerShiftDelete: false,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    flags: [
      { label: 'Estándar', value: 'estandar' },
      { label: 'Descanso (NA)', value: 'NA' },
      { label: '12x36', value: '12x36' },
      { label: '24x24', value: '24x24' },
      { label: '24x48', value: '24x48' },
      { label: 'Doble 12x48', value: 'doble-12x48' },
    ],
  }),
  computed: {
    groupShifts() {
      const group: any[] = []

      this.flags.forEach(flag => {
        const shifts = this.filteredShifts.filter(shift => shift.shiftCalculateFlag?.includes(flag.value))
        group.push({ flag, category: flag.label, shifts })
      })

      this.filteredShifts.forEach(shift => {
        if (!shift.shiftCalculateFlag && shift.shiftRestDays && shift.shiftRestDays !== '0') {
          const index = group.findIndex(g => g.flag.value === 'estandar')
          group[index].shifts.push(shift)
        }
      })

      this.filteredShifts.forEach(shift => {
        if (!shift.shiftCalculateFlag && shift.shiftRestDays && shift.shiftRestDays === '0') {
          const index = group.findIndex(g => g.flag.value === 'NA')
          group[index].shifts.push(shift)
        }
      })

      return group
    }
  },
  created() { },
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

    await this.handlerSearchShift()
    myGeneralStore.setFullLoader(false)
  },
  methods: {
    async handlerSearchShift() {
      const response = await new ShiftService().getFilteredList(this.search, this.currentPage, this.rowsPerPage)
      const list = response.status === 200 ? response._data.data.data : []
      this.totalRecords = response.status === 200 ? response._data.data.meta.total : 0
      this.first = response.status === 200 ? response._data.data.meta.first_page : 0
      this.filteredShifts = list
    },
    async onPageChange(event: any) {
      this.currentPage = event.page + 1
      this.rowsPerPage = event.rows

      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      await this.handlerSearchShift()
      myGeneralStore.setFullLoader(false)
    },
    addNew() {
      const newShift: ShiftInterface = {
        employees: [],
        shiftId: null,
        shiftName: "",
        shiftDayStart: 0,
        shiftTimeStart: "",
        shiftActiveHours: 0,
        shiftRestDays: "",
        shiftAccumulatedFault: 1,
        shiftCreatedAt: null,
        shiftUpdatedAt: null,
        shiftDeletedAt: null,
        employee_count: undefined
      }
      this.shift = newShift
      this.drawerShiftForm = true
    },
    onEdit(shift: ShiftInterface) {
      this.shift = { ...shift }
      this.drawerShiftForm = true
    },
    onDelete(shift: ShiftInterface) {
      this.shift = { ...shift }
      this.drawerShiftDelete = true
    },
    async confirmDelete() {
      if (this.shift) {
        this.drawerShiftDelete = false
        const shiftService = new ShiftService()
        const shiftResponse = await shiftService.delete(this.shift)
        if (shiftResponse.status === 200) {
          const index = this.filteredShifts.findIndex((shift: ShiftInterface) => shift.shiftId === this.shift?.shiftId)
          if (index !== -1) {
            this.filteredShifts.splice(index, 1)
            this.$forceUpdate()
          }
          this.$toast.add({
            severity: 'success',
            summary: 'Delete shift',
            detail: shiftResponse._data.message,
            life: 5000,
          })
        } else {
          this.$toast.add({
            severity: 'error',
            summary: 'Delete shift',
            detail: shiftResponse._data.message,
            life: 5000,
          })
        }
      }
    },
    onSave(shift: ShiftInterface) {
      const myGeneralStore = useMyGeneralStore()
      myGeneralStore.setFullLoader(true)
      this.shift = { ...shift }
      const index = this.filteredShifts.findIndex((s: ShiftInterface) => s.shiftId === this.shift?.shiftId)
      if (index !== -1) {
        this.filteredShifts[index] = shift
        this.$forceUpdate()
        myGeneralStore.setFullLoader(false)
      } else {
        this.filteredShifts.unshift(shift)
        this.$forceUpdate()
        myGeneralStore.setFullLoader(false)
      }
      myGeneralStore.setFullLoader(false)
      this.drawerShiftForm = false
    }
  }
})
