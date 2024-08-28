import { defineStore } from 'pinia'
import SystemSettingService from '~/resources/scripts/services/SystemSettingService'

export const useMyGeneralStore = defineStore({
  id: 'myGeneralStore',
  state: () => ({
    displayAside: true as boolean,
    fullLoader: false as boolean,
    backgroundColor: '#093057',
    backgroundColorDark: '#092c50',
    backgroundImage: 'https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg'
  }),
  actions: {
    setDisplayAside (status: boolean) {
      this.displayAside = status
    },

    toggleDisplayAside () {
      const currentStatus = this.displayAside
      this.displayAside = !currentStatus
    },

    setFullLoader (status: boolean) {
      this.fullLoader = status
    },

    async getSystemSettings() {
      // this.fullLoader = true
      this.backgroundColor = '#093057'
      this.backgroundColorDark = '#092c50'
      this.backgroundImage = 'https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg'
      const systemSettingService = new SystemSettingService()
      const systemSettingResponse = await systemSettingService.getActive()
      if (systemSettingResponse) {
        if (systemSettingResponse.systemSettingSidebarColor) {
          this.backgroundColor = `#${systemSettingResponse.systemSettingSidebarColor}`
          const shades = this.generateColorShades(this.backgroundColor)
          this.backgroundColorDark = shades.darker
        }
        if (systemSettingResponse.systemSettingLogo) {
          this.backgroundImage = `${systemSettingResponse.systemSettingLogo}`
        }
      }
      // this.fullLoader = false
    },

    adjustColorBrightness(color: string, amount: number) {
      let usePound = false;

      if (color[0] === "#") {
        color = color.slice(1);
        usePound = true;
      }

      let num = parseInt(color, 16);

      let r = (num >> 16) + amount;
      r = r > 255 ? 255 : r < 0 ? 0 : r;

      let g = ((num >> 8) & 0x00FF) + amount;
      g = g > 255 ? 255 : g < 0 ? 0 : g;

      let b = (num & 0x0000FF) + amount;
      b = b > 255 ? 255 : b < 0 ? 0 : b;

      return (usePound ? "#" : "") + (r.toString(16).padStart(2, '0')) + (g.toString(16).padStart(2, '0')) + (b.toString(16).padStart(2, '0'));
    },

    generateColorShades(hexColor: string) {
      const darkerShade = this.adjustColorBrightness(hexColor, -30); // Ajusta este valor para obtener el tono oscuro deseado

      return {
        darker: darkerShade
      };
    },
  }
})
