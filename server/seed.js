const DAY = 86400000

// İlk çalıştırmada boş bir ekran yerine örnek kütüphane görünsün diye.
export function seedGames() {
  const now = Date.now()

  const rows = [
    ['Cyberpunk 2077', 'RPG', 'PC', 'playing', 82, 5, 'Night City is worth the wait.', 1],
    ['Elden Ring', 'RPG', 'PC', 'completed', 71, 5, 'Best boss design in years.', 3],
    ['Grand Theft Auto V', 'Action', 'PC', 'completed', 156, 5, '', 6],
    ['Minecraft', 'Sandbox', 'PC', 'playing', 320, 4, 'Still building the castle.', 8],
    ['The Witcher 3', 'RPG', 'PC', 'backlog', 0, 0, '', 10],
    ['Hollow Knight', 'Adventure', 'Nintendo', 'backlog', 2, 0, '', 12],
    ['Fallout 76', 'Shooter', 'PC', 'dropped', 6, 2, 'Not for me.', 20],
  ]

  return rows.map(([name, genre, platform, status, hours, rating, notes, daysAgo], i) => ({
    id: `g_seed_${i}`,
    name,
    genre,
    platform,
    status,
    hours,
    rating,
    notes,
    addedAt: now - daysAgo * DAY,
  }))
}
