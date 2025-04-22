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

window.addEventListener('DOMContentLoaded', () => {
  setupCopyToClipboard()
})

function setupCopyToClipboard() {
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.style.cursor = 'pointer'
    el.title = 'Click to copy'

    el.addEventListener('click', () => {
      const text = el.textContent.trim()
      if (!text || text === '-' || text === '...') return

      navigator.clipboard.writeText(text).then(() => {
        const original = el.textContent
        el.textContent = '✅ Copied!'
        setTimeout(() => {
          el.textContent = original
        }, 1000)
      }).catch(err => {
        console.error('Failed to copy:', err)
      })
    })
  })
}
