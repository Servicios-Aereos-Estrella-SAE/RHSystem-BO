import { defineStore } from 'pinia'

export const useMyGeneralStore = defineStore({
  id: 'myGeneralStore',
  state: () => ({
    displayAside: true as boolean,
    fullLoader: false as boolean
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
  }
})
