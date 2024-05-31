import { defineComponent } from 'vue'

export default defineComponent({
  name: 'asideMenu',
  props: {
    asideVisibilityStatus: { type: Boolean },
  },
  data: () => ({
  }),
  computed: {
  },
  mounted() {
  },
  methods: {
    handlerLogout () {
      this.$router.push({ path: "/" })
    }
  }
})