/* eslint-disable no-undef */
import { sha256 } from 'ethers'

const shouldTruncade = isSmallScreen()

let mining = false
let startTime = 0
let attempts = 0

const startBtn = document.getElementById('startPoW')
const stopBtn = document.getElementById('stopPoW')

const powMessageInput = document.getElementById('powMessage')
const powDifficultyInput = document.getElementById('powDifficulty')
const powNonceOutput = document.getElementById('powNonce')
const powHashOutput = document.getElementById('powHash')
const powAttemptsOutput = document.getElementById('powAttempts')
const powElapsedOutput = document.getElementById('powElapsed')
const powStatusOutput = document.getElementById('powStatus')

function mine(message, difficulty) {
  const targetPrefix = '0'.repeat(difficulty)
  powStatusOutput.textContent = 'running'

  let nonce = 0
  mining = true
  attempts = 0
  startTime = Date.now()

  function step() {
    if (!mining) return

    const combined = message + nonce
    // const hash = sha256(Buffer.from(combined))
    const hash = sha256(new TextEncoder().encode(combined))

    attempts++

    if (hash.slice(2).startsWith(targetPrefix)) {
      mining = false
      powStatusOutput.textContent = 'found'
      powElapsedOutput.textContent = ((Date.now() - startTime) / 1000).toFixed(2) + 's'

      powNonceOutput.textContent = nonce
      powAttemptsOutput.textContent = attempts.toLocaleString()
      powHashOutput.textContent = hash

      return
    }

    powNonceOutput.textContent = nonce
    powAttemptsOutput.textContent = attempts.toLocaleString()
    powHashOutput.textContent = shouldTruncade ? truncateValue(hash, 27, 27) : hash
    if (attempts % 10 === 0) {
      powElapsedOutput.textContent = ((Date.now() - startTime) / 1000).toFixed(2) + 's'
    }

    nonce++
    setTimeout(step, 0) // Avoid "too much recursion" error
  }

  step()
}

startBtn.addEventListener('click', () => {
  const message = powMessageInput.value.trim() || ''
  const difficulty = parseInt(powDifficultyInput.value)
  if (
    typeof message !== 'string' || isNaN(difficulty) || difficulty < 1 || difficulty > 10) {
    alert('Invalid message or difficulty.')
    return
  }

  mining = true
  mine(message, difficulty)
})

stopBtn.addEventListener('click', () => {
  if (mining) {
    mining = false
    powStatusOutput.textContent = 'stopped'
  }
})


function isSmallScreen() {
  return window.innerWidth < 768
}

function truncateValue(value, prefixLength = 14, suffixLength = 14) {
  const prefix = value.slice(0, prefixLength)
  const suffix = value.slice(-suffixLength)
  return `${prefix}...${suffix}`
}
