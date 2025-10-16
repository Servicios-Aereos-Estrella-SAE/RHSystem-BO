import { defineComponent } from 'vue'
import  SignaturePad  from 'vue3-signature-pad'

export default defineComponent({
  name: 'VacationSignaturePad',
  components: {
    SignaturePad
  },
  emits: ['signatureChanged'],
  data: () => ({
    hasSignature: false,
    isDrawing: false,
    signatureOptions: {
      backgroundColor: '#ffffff',
      penColor: '#000000',
      minWidth: 1,
      maxWidth: 3,
      throttle: 16,
      minDistance: 5,
      velocityFilterWeight: 0.7
    }
  }),
  mounted() {
    // Forzar una verificación inicial después de que el componente esté montado
    this.$nextTick(() => {
      setTimeout(() => {
        this.checkSignatureStatus()
      }, 500)
    })
  },
  methods: {
    onBegin() {
      console.log('🟢 Signature drawing STARTED')
      this.isDrawing = true
    },
    onEnd() {
      console.log('🔴 Signature drawing ENDED')
      this.isDrawing = false
      // Verificar el estado inmediatamente después de terminar
      setTimeout(() => {
        this.checkSignatureStatus()
      }, 100)
    },

    checkSignatureStatus() {
      const signaturePad = this.$refs.signaturePad as any
      console.log('🔍 Checking signature status...')
      console.log('SignaturePad ref:', signaturePad)

      if (signaturePad) {
        const isEmpty = signaturePad.isEmpty()
        console.log('📝 Signature pad isEmpty():', isEmpty)

        this.hasSignature = !isEmpty
        console.log('✅ hasSignature:', this.hasSignature)

        this.$emit('signatureChanged', this.hasSignature)

        // Debug: intentar obtener dataURL
        if (!isEmpty) {
          try {
            const dataURL = signaturePad.toDataURL()
            console.log('🖼️ DataURL obtained, length:', dataURL.length)
          } catch (error) {
            console.error('❌ Error getting DataURL:', error)
          }
        }
      } else {
        console.log('❌ SignaturePad ref not found')
      }
    },

    clearSignature() {
      const signaturePad = this.$refs.signaturePad as any
      if (signaturePad) {
        signaturePad.clearSignature()
        this.hasSignature = false
        this.$emit('signatureChanged', false)
        console.log('🧹 Signature cleared')
      }
    },

    undoSignature() {
      const signaturePad = this.$refs.signaturePad as any
      if (signaturePad) {
        signaturePad.undoSignature()
        // Verificar estado después de deshacer
        setTimeout(() => {
          this.checkSignatureStatus()
        }, 100)
      }
    },

    // ... resto de métodos igual
    getSignatureDataURL(): string | null {
      const signaturePad = this.$refs.signaturePad as any
      if (signaturePad && !signaturePad.isEmpty()) {
        return signaturePad.toDataURL()
      }
      return null
    },

    getSignatureBlob(): Promise<Blob | null> {
      return new Promise((resolve) => {
        const signaturePad = this.$refs.signaturePad as any
        if (signaturePad && !signaturePad.isEmpty()) {
          const dataURL = signaturePad.toDataURL()
          fetch(dataURL)
            .then(res => res.blob())
            .then(blob => resolve(blob))
            .catch(() => resolve(null))
        } else {
          resolve(null)
        }
      })
    },

    async getSignatureFile(): Promise<File | null> {
      const blob = await this.getSignatureBlob()
      return blob ? new File([blob], 'signature.png', { type: 'image/png' }) : null
    },

    isEmpty(): boolean {
      const signaturePad = this.$refs.signaturePad as any
      return signaturePad ? signaturePad.isEmpty() : true
    }
  }
})
