import { defineComponent } from 'vue'

export default defineComponent({
  name: 'confirmDelete',
  props: {
    description: { type: String, required: false }
  },
  data: () => ({
    securityWord: 'confirm',
    verifyWord: '',
    isIncorrect: false
  }),
  computed: {},
  created () {},
  mounted() {
  },
  methods: {
    handlerConfirmDelete () {
      if (this.securityWord.toLocaleLowerCase() !== this.verifyWord.toLocaleLowerCase()) {
        this.isIncorrect = true
        return
      }

      this.$emit('confirmDelete')
    },
    handlerCancel () {
      this.$emit('cancelDelete')
    }
  }
});
