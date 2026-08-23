const OWNED = ['playing', 'completed', 'backlog', 'dropped']

// Her başarım kütüphaneden bir sayı çıkarır ve bir hedefle karşılaştırır.
// Böylece ilerleme çubuğu da tek yerden hesaplanıyor.
const DEFINITIONS = [
  {
    id: 'first',
    name: 'On the shelf',
    description: 'Add your first game',
    target: 1,
    measure: (owned) => owned.length,
  },
  {
    id: 'ten',
    name: 'Collector',
    description: 'Own ten games',
    target: 10,
    measure: (owned) => owned.length,
  },
  {
    id: 'fifty',
    name: 'Hoarder',
    description: 'Own fifty games',
    target: 50,
    measure: (owned) => owned.length,
  },
  {
    id: 'hundredHours',
    name: 'Committed',
    description: 'Play a hundred hours',
    target: 100,
    unit: 'h',
    measure: (owned) => owned.reduce((sum, g) => sum + g.hours, 0),
  },
  {
    id: 'thousandHours',
    name: 'No life',
    description: 'Play a thousand hours',
    target: 1000,
    unit: 'h',
    measure: (owned) => owned.reduce((sum, g) => sum + g.hours, 0),
  },
  {
    id: 'marathon',
    name: 'Marathon',
    description: 'Put a hundred hours into a single game',
    target: 100,
    unit: 'h',
    measure: (owned) => Math.max(0, ...owned.map((g) => g.hours)),
  },
  {
    id: 'finishFive',
    name: 'Closer',
    description: 'Finish five games',
    target: 5,
    measure: (owned) => owned.filter((g) => g.status === 'completed').length,
  },
  {
    id: 'finishTwentyFive',
    name: 'Completionist',
    description: 'Finish twenty-five games',
    target: 25,
    measure: (owned) => owned.filter((g) => g.status === 'completed').length,
  },
  {
    id: 'critic',
    name: 'Critic',
    description: 'Rate twenty games',
    target: 20,
    measure: (owned) => owned.filter((g) => g.rating > 0).length,
  },
  {
    id: 'genres',
    name: 'Omnivore',
    description: 'Own games from six genres',
    target: 6,
    measure: (owned) => new Set(owned.map((g) => g.genre)).size,
  },
  {
    id: 'platforms',
    name: 'Platform agnostic',
    description: 'Own games on three platforms',
    target: 3,
    measure: (owned) => new Set(owned.map((g) => g.platform)).size,
  },
  {
    id: 'wishlist',
    name: 'Window shopper',
    description: 'Put five games on your wishlist',
    target: 5,
    measure: (owned, all) => all.filter((g) => g.status === 'wishlist').length,
  },
]

export function computeAchievements(games) {
  const owned = games.filter((g) => OWNED.includes(g.status))

  return DEFINITIONS.map((definition) => {
    const value = definition.measure(owned, games)
    return {
      ...definition,
      value,
      unlocked: value >= definition.target,
      progress: Math.min(value / definition.target, 1),
    }
  })
}
