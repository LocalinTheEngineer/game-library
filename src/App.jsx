import { useState } from 'react'
import Topbar from './components/Topbar'
import GameFormModal from './components/GameFormModal'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import Stats from './pages/Stats'
import { useGames } from './hooks/useGames'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { games, addGame, updateGame, deleteGame } = useGames()
  const { theme, toggleTheme } = useTheme()

  const [view, setView] = useState('dashboard')
  const [modal, setModal] = useState(null) // null | { game: Game | null }

  const openAddModal = () => setModal({ game: null })
  const openEditModal = (game) => setModal({ game })
  const closeModal = () => setModal(null)

  const handleSave = (data) => {
    if (modal.game) {
      updateGame(modal.game.id, data)
    } else {
      addGame(data)
    }
    closeModal()
  }

  const handleDelete = (id) => {
    deleteGame(id)
    closeModal()
  }

  return (
    <div className="app">
      <Topbar
        view={view}
        onViewChange={setView}
        theme={theme}
        onToggleTheme={toggleTheme}
        onAddGame={openAddModal}
      />

      {view === 'dashboard' && (
        <Dashboard
          games={games}
          onSelectGame={openEditModal}
          onAddGame={openAddModal}
          onGoToLibrary={() => setView('library')}
        />
      )}

      {view === 'library' && (
        <Library games={games} onSelectGame={openEditModal} onAddGame={openAddModal} />
      )}

      {view === 'stats' && <Stats games={games} onAddGame={openAddModal} />}

      <footer className="credit">
        Data is stored locally in this browser · No account needed until v5
      </footer>

      {modal && (
        <GameFormModal
          game={modal.game}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
