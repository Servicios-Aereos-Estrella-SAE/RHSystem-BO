import { DateTime } from 'luxon';
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'confirmAssist',
  props: {
    assistPunchTime: { type: Date, require: true }
  },
  data: () => ({
    securityWord: 'confirm',
    verifyWord: '',
    isIncorrect: false,
    localeToUse: 'en',
  }),
  computed: {
    formatAssistTime(): string {
      if (!this.assistPunchTime) return ''; // o 'Fecha no disponible'
      return DateTime.fromJSDate(this.assistPunchTime)
        .setLocale(this.localeToUse)
        .toFormat('DDDD HH:mm:ss a')
    }
  },
  created() {
    this.localeToUse = this.locale === 'en' ? 'en' : 'es'
  },
  mounted() {
  },
  methods: {
    handlerConfirmSave() {
      if (this.securityWord.toLocaleLowerCase() !== this.verifyWord.toLocaleLowerCase()) {
        this.isIncorrect = true
        return
      }

      this.$emit('confirmAssist')
    },
    handlerCancel() {
      this.$emit('cancelAssist')
    }
  }
});
