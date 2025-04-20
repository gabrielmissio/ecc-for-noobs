/* eslint-disable no-undef */
import './modules/ecc-wallet.js'
import './modules/pow-demo.js'
import './modules/sign-verify.js'
import './modules/vanity-search.js'
import { setLanguage, detectPreferredLanguage } from './i18n.js'

const lang = detectPreferredLanguage()
setLanguage(lang)

document.getElementById('languageSwitcher').addEventListener('change', (e) => {
  setLanguage(e.target.value)
  const newURL = new URL(window.location.href)
  newURL.searchParams.set('lang', e.target.value)
  window.history.replaceState(null, '', newURL)
})
