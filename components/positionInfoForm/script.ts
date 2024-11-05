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
  async mounted() {
    await this.loadParentPositions()
  },
  methods: {
    async loadParentPositions() {
      try {
        const positionService = new PositionService()
        const departmentId = this.department.departmentId || 0
        const response = await positionService.getPositionsDepartment(departmentId)

        if (response) {
          this.positions = response.map((position: PositionInterface) => ({
            positionId: position.positionId,
            positionSyncId: position.positionSyncId,
            positionCode: position.positionCode,
            positionName: position.positionName,
            positionAlias: position.positionAlias,
            positionIsDefault: position.positionIsDefault,
            positionActive: position.positionActive,
            parentPositionId: position.parentPositionId,
            parentPositionSyncId: position.parentPositionSyncId,
            companyId: position.companyId,
            departmentId: position.departmentId,
            businessUnitId: position.businessUnitId,
            positionLastSynchronizationAt:
            position.positionLastSynchronizationAt,
            positionCreatedAt: position.positionCreatedAt,
            positionUpdatedAt: position.positionUpdatedAt,
            positionDeletedAt: position.positionDeletedAt,
          }))
        }
      } catch (error) {
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading parent positions options.',
          life: 5000,
        })
      }
    },
    async onSave() {
      this.submitted = true

      if (this.position && this.position.positionName) {
        try {
          const response = this.position.positionId ? await this.updatePosition() : await this.createPosition()

          if (response.status === 200 || response.status === 201) {
            const position = response._data.data.position.positionId
            const departmentId = this.position.departmentId
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
