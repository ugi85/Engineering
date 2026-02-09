// src/stores/settings.js
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    api: {
      daftarAlat:'https://script.google.com/macros/s/AKfycbw0-LDvMGAerOwMPt7Bp1297AetmBNQPcVk7g2qsqe3qnhNJIZr1hFupWLxeGStK9w/exec',
      logAktivitas:'https://script.google.com/macros/s/AKfycbzGKIeA9r9MQIDNWYP4QlSI_FnossL-hacN_FdtL3eeuni3PpxqdbFojnwa9PWK_usv/exec',
      jadwalKalibrasi:'https://script.google.com/macros/s/AKfycbyZF-nEyTtyPB0PIc4yrRKJAs0qol4wwPImj27ds1tubFTDbzb49YngyPhbBi2J12S6/exec'
    }
  })
})