export const STATUS_META = {
  playing: { label: 'Playing', color: 'var(--status-playing)' },
  completed: { label: 'Completed', color: 'var(--status-completed)' },
  backlog: { label: 'Backlog', color: 'var(--status-backlog)' },
  dropped: { label: 'Dropped', color: 'var(--status-dropped)' },
}

export const STATUS_ORDER = ['playing', 'completed', 'backlog', 'dropped']

export const GENRES = [
  'Action',
  'RPG',
  'Adventure',
  'Strategy',
  'Horror',
  'Simulation',
  'Sandbox',
  'Sports',
  'Racing',
  'Puzzle',
  'Shooter',
  'Other',
]

export const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile', 'Other']

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently Added' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'hours', label: 'Most Played' },
]
