import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { DepartmentInterface } from '~/resources/scripts/interfaces/DepartmentInterface'
import type { PositionInterface } from '~/resources/scripts/interfaces/PositionInterface'
import DepartmentService from '~/resources/scripts/services/DepartmentService'
import PositionService from '~/resources/scripts/services/PositionService'

export default defineComponent({
  name: 'PositionInfoForm',
  props: {
    position: { type: Object as PropType<PositionInterface>, required: true },
    department: { type: Object as PropType<DepartmentInterface>, required: true },
  },
  data: () => ({
    submitted: false,
    companyOptions: [],
    parentPositions: [],
    positions: [] as PositionInterface[],
    prefix: 'P1',
    positionNumber: 1,
    prefixList: [
      { prefix: 'P0', label: 'Dirección / Gerencia / Jefatura' },
      { prefix: 'P1', label: 'Puesto Administrativo' },
      { prefix: 'P2', label: 'Encargado' },
      { prefix: 'P3', label: 'Asistente / Auxiliar / General' },
      { prefix: 'P4', label: 'Operador / Becario' },
    ]
  }),
  computed: {
    isPositionActive: {
      get() {
        return this.position.positionActive === 1
      },
      set(newValue: boolean) {
        this.position.positionActive = newValue ? 1 : 0
      },
    },
  },
  mounted() {
    this.loadParentPositions()
    if (this.position.positionId) {
      this.setPrefix()
    }
  },
  methods: {
    loadParentPositions() {
      if (this.position.parentPosition) {
        this.positions = [this.position.parentPosition]
      }
    },
    setPrefix () {
      const prefix = this.position.positionName.split(' ')[0]
      const type = prefix.slice(0, 3).replace('(', '')
      const order = parseInt(prefix.slice(3).replace(')', ''))

      this.prefix = type
      this.positionNumber = order

      this.position.positionName = this.position.positionName.replace(prefix, '').trim()
    },
    async onSave() {
      this.submitted = true

      if (this.position && this.position.positionName) {
        try {
          this.position.positionName = `(${this.prefix}${`${this.positionNumber}`.padStart(2, '0')}) ${this.position.positionName}`
          const response = this.position.positionId ? await this.updatePosition() : await this.createPosition()

          if (response.status === 200 || response.status === 201) {
            const position = response._data.data.position.positionId
            const departmentId = parseInt(`${this.position.departmentId}`)
            const departmentService = new DepartmentService()
            await departmentService.assignDepartment(position, departmentId)
            this.$emit('saved', response._data.data.position as PositionInterface)
          } else {
            this.$toast.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'There was an error saving the position: ' +
                response._data.data.sqlMessage,
              life: 10000,
            })
            this.$emit('save-error')
          }
        } catch (error) {
          this.$toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There was an error saving the position: ' + error,
            life: 5000,
          })
          this.$emit('save-error')
        }
      }
    },
    async createPosition() {
      this.position.positionActive = 1
      this.position.positionCode = `${new Date().getTime()}`
      this.position.companyId = this.department.businessUnitId
      this.position.businessUnitId = this.department.businessUnitId

      const positionService = new PositionService()
      const res = await positionService.store(this.position)

      return res
    },
    async updatePosition() {
      const positionService = new PositionService()
      const res = await positionService.update(this.position)
      return res
    },
  },
})
