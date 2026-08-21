export function makeId() {
  return 'g_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

const DAY = 86400000

export function seedGames() {
  const now = Date.now()
  return [
    {
      id: makeId(),
      name: 'Cyberpunk 2077',
      genre: 'RPG',
      platform: 'PC',
      status: 'playing',
      hours: 82,
      rating: 5,
      notes: 'Night City is beautiful once you look past the bugs.',
      addedAt: now - 1 * DAY,
    },
    {
      id: makeId(),
      name: 'Elden Ring',
      genre: 'RPG',
      platform: 'PC',
      status: 'completed',
      hours: 71,
      rating: 5,
      notes: 'Best boss design in years.',
      addedAt: now - 3 * DAY,
    },
    {
      id: makeId(),
      name: 'Grand Theft Auto V',
      genre: 'Action',
      platform: 'PC',
      status: 'completed',
      hours: 156,
      rating: 5,
      notes: '',
      addedAt: now - 6 * DAY,
    },
    {
      id: makeId(),
      name: 'Minecraft',
      genre: 'Sandbox',
      platform: 'PC',
      status: 'playing',
      hours: 320,
      rating: 4,
      notes: 'Still building the castle.',
      addedAt: now - 8 * DAY,
    },
    {
      id: makeId(),
      name: 'The Witcher 3',
      genre: 'RPG',
      platform: 'PC',
      status: 'backlog',
      hours: 0,
      rating: 0,
      notes: '',
      addedAt: now - 10 * DAY,
    },
    {
      id: makeId(),
      name: 'Hollow Knight',
      genre: 'Adventure',
      platform: 'Nintendo',
      status: 'backlog',
      hours: 2,
      rating: 0,
      notes: '',
      addedAt: now - 12 * DAY,
    },
    {
      id: makeId(),
      name: 'Fallout 76',
      genre: 'Shooter',
      platform: 'PC',
      status: 'dropped',
      hours: 6,
      rating: 2,
      notes: 'Not for me.',
      addedAt: now - 20 * DAY,
    },
  ]
}
