import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'
import PersonService from '~/resources/scripts/services/PersonService'

export default defineComponent({
  name: 'userInfoCard',
  props: {
    user: { type: Object as PropType<UserInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
  },
  data: () => ({
    photo: null as string | null
  }),
  computed: {
  },
  async mounted() {
    if (this.user.personId) {
      const personService = new PersonService()
      const personResponse = await personService.getEmployee(this.user.personId)
      if (personResponse) {
        if (personResponse._data.data.employee) {
          if (personResponse._data.data.employee.employeePhoto) {
            this.photo = personResponse._data.data.employee.employeePhoto
          }
        }
      }
    }
  },
  methods: {
    handlerClickOnEdit () {
      if (this.clickOnEdit) {
        this.clickOnEdit()
      }
    },
    handlerClickOnDelete () {
      if (this.clickOnDelete) {
        this.clickOnDelete()
      }
    },
  }
})