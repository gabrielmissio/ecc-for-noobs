/* eslint-disable no-undef */
import en from '../i18n/en.js'
import pt from '../i18n/pt.js'

const languages = { en, pt }

export function detectPreferredLanguage() {
  const urlParamLang = new URLSearchParams(window.location.search).get('lang')
  const browserLang = navigator.language.slice(0, 2)

  if (urlParamLang && languages[urlParamLang]) return urlParamLang
  if (languages[browserLang]) return browserLang

  return 'en' // fallback
}


export function setLanguage(lang) {
  const strings = languages[lang] || languages.en

  // Update text content for elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (strings[key]) el.textContent = strings[key]
  })

  // Update placeholder text for elements with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder')
    if (strings[key]) el.setAttribute('placeholder', strings[key])
  })

  // Update <select> UI
  const select = document.getElementById('languageSwitcher')
  if (select) select.value = lang
}
