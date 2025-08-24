import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { RoleInterface } from '~/resources/scripts/interfaces/RoleInterface'
import RoleService from '~/resources/scripts/services/RoleService'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

export default defineComponent({
  components: {
    Toast,
    ToastService,
  },
  name: 'roleInfoForm',
  props: {
    role: { type: Object as PropType<RoleInterface>, required: true },
    clickOnSave: { type: Function, default: null },
  },
  data: () => ({
    activeSwicht: true,
    submitted: false,
    isNewRole: false,
    isReady: false,
  }),
  computed: {
  },
  async mounted() {
    this.isReady = false
    let isActive: number = 1
    isActive = this.role.roleActive
    this.activeSwicht = isActive === 1 ? true : false
    this.isNewRole = !this.role.roleId ? true : false
    this.isReady = true
  },
  methods: {
    async onSave() {
      this.submitted = true
      const roleService = new RoleService()
      if (!roleService.validateInfo(this.role)) {
        this.$toast.add({
          severity: 'warn',
          summary: 'Validation data',
          detail: 'Missing data',
          life: 5000,
        })
        return
      }

      this.role.roleActive = this.activeSwicht ? 1 : 0
      let roleResponse = null
      if (!this.role.roleId) {
        roleResponse = await roleService.store(this.role)
      } else {
        roleResponse = await roleService.update(this.role)
      }
      if (roleResponse.status === 201 || roleResponse.status === 200) {
        this.$toast.add({
          severity: 'success',
          summary: `Role ${this.role.roleId ? 'updated' : 'created'}`,
          detail: roleResponse._data.message,
          life: 5000,
        })

        roleResponse = await roleService.show(roleResponse._data.data.role.roleId)
        if (roleResponse && roleResponse.status === 200) {
          const role = roleResponse._data.data.role
          this.$emit('onRoleSave', role as RoleInterface)
        }
      } else {
        const msgError = roleResponse._data.error ? roleResponse._data.error : roleResponse._data.message
        this.$toast.add({
          severity: 'error',
          summary: `Role ${this.role.roleId ? 'updated' : 'created'}`,
          detail: msgError,
          life: 5000,
        })
      }
    },
  }
})
