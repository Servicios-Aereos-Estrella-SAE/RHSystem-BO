import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type { AircraftInterface } from '~/resources/scripts/interfaces/AircraftInterface'

export default defineComponent({
  name: 'AircraftInfoCard',
  props: {
    aircraft: { type: Object as PropType<AircraftInterface>, required: true },
    clickOnEdit: { type: Function, default: null },
    clickOnGallery: { type: Function, default: null },
    clickOnDelete: { type: Function, default: null },
    canUpdate: { type: Boolean, default: false, required: true },
    canDelete: { type: Boolean, default: false, required: true }
  },
  data: () => ({}),
  mounted() {},
  methods: {
    handlerClickOnEdit() {
      if (this.clickOnEdit) {
        this.clickOnEdit(this.aircraft)
      }
    },
    handlerClickOnGallery(){
      if (this.clickOnGallery) {
        this.clickOnGallery(this.aircraft)
      } 
    },
    handlerClickOnDelete() {
      if (this.clickOnDelete) {
        this.clickOnDelete(this.aircraft)
      }
    },
    handlerOpenProceedingFiles () {
      this.$emit('openProceedingFiles', this.aircraft)
    }
  }
})
