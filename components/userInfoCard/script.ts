import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { UserInterface } from '~/resources/scripts/interfaces/UserInterface'

export default defineComponent({
  name: 'userInfoCard',
  props: {
    user: { type: Object as PropType<UserInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
  },
  data: () => ({
  }),
  computed: {
  },
  mounted() {
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