import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { seedGames } from './seed.js'

const dataDir = join(dirname(fileURLToPath(import.meta.url)), 'data')
const dataFile = join(dataDir, 'games.json')

let games = null
let writeQueue = Promise.resolve()

async function load() {
  if (games) return games

  try {
    games = JSON.parse(await readFile(dataFile, 'utf8'))
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
    games = seedGames()
    await mkdir(dataDir, { recursive: true })
    await writeFile(dataFile, JSON.stringify(games, null, 2))
  }

  return games
}

// Yazma işlemlerini sıraya alıyoruz, aksi halde eşzamanlı iki istek
// birbirinin dosyasının üstüne yazabilir.
function persist() {
  writeQueue = writeQueue.then(() =>
    writeFile(dataFile, JSON.stringify(games, null, 2))
  )
  return writeQueue
}

function makeId() {
  return 'g_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export async function listGames() {
  return load()
}

export async function findGame(id) {
  const all = await load()
  return all.find((g) => g.id === id)
}

export async function createGame(fields) {
  const all = await load()
  const game = { id: makeId(), addedAt: Date.now(), ...fields }
  all.unshift(game)
  await persist()
  return game
}

export async function updateGame(id, fields) {
  const all = await load()
  const index = all.findIndex((g) => g.id === id)
  if (index === -1) return null

  all[index] = { ...all[index], ...fields, id, addedAt: all[index].addedAt }
  await persist()
  return all[index]
}

export async function removeGame(id) {
  const all = await load()
  const index = all.findIndex((g) => g.id === id)
  if (index === -1) return false

  all.splice(index, 1)
  await persist()
  return true
}
