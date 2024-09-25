import { defineComponent } from 'vue'

export default defineComponent({
  name: 'loader',
  props: {
  },
  data: () => ({
  }),
  computed: {
    zIndexValue () {
      const from = document.getElementsByTagName('body')[0] as HTMLElement
      let max = 0
      const elementsCollection = from.querySelectorAll('*')
      elementsCollection.forEach((e: any) => {
        const z = Number(e.style.zIndex)
        if (z > max) {
          max = z
        }
      })

      max = max + 1
      max = max < 10 ? 10 : max
      
      return max
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
})