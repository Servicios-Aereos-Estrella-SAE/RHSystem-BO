import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { ProceedingFileTypeInterface } from '~/resources/scripts/interfaces/ProceedingFileTypeInterface';


export default defineComponent({
  components: {
  },
  name: 'proceedingFileTypeFolder',
  props: {
    folder: { type: Object as PropType<ProceedingFileTypeInterface>, required: true }
  },
  data: () => ({
    clicks: 0 as number,
    timer: null as any,
    delay: 250 as number
  }),
  computed: {
  },
  mounted() {
  },
  methods: {
    async handlerDoubleClick() {
      this.clicks++
      if (this.clicks === 1) {
        this.timer = setTimeout(() => {
          this.clicks = 0
        }, this.delay)
      } else {
        clearTimeout(this.timer)
        this.clicks = 0
        if (this.folder.proceedingFileTypeSlug === 'employee-contracts') {
          this.$emit('dblclickContracts', this.folder)
        } else {
          this.$emit('dblclick', this.folder)
        }

      }
    },
    capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  }
})
