import { cpus } from 'os'
import { Worker } from 'worker_threads'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const CONFIG_FILE = path.join(rootDir, 'config.json')
const WORKER_PATH = path.join(__dirname, 'worker.mjs')

const loadConfig = async () => {
  try {
    const raw = await fs.readFile(CONFIG_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('❌ Failed to load config.json:', err)
    process.exit(1)
  }
}

const main = async () => {
  const config = await loadConfig()
  const maxCpu = Math.min(config.maxCpuNumber, cpus().length)

  console.log(`🧠 Launching ${maxCpu} worker(s)...\n`)

  for (let workerId = 0; workerId < maxCpu; workerId++) {
    const worker = new Worker(WORKER_PATH, {
      workerData: {
        workerId,
        totalWorkers: maxCpu,
      },
    })

    worker.on('message', msg => {
      if (msg.type === 'match') {
        console.log(`🎯 [Worker ${msg.workerId}] Match at key ${msg.privateKey}`)
      } else if (msg.type === 'status') {
        console.log(`📊 [Worker ${msg.workerId}] Tried ${msg.count} keys Last Tried Key ${msg.lastTriedKey}`)
      }
    })

    worker.on('error', err => {
      console.error(`❌ Worker ${workerId} error:`, err)
    })

    worker.on('exit', code => {
      console.log(`🛑 Worker ${workerId} exited with code ${code}`)
    })
  }
}

main()
