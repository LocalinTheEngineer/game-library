import { useState } from 'react'
import Topbar from './components/Topbar'
import GameFormModal from './components/GameFormModal'
import AuthScreen from './components/AuthScreen'
import LibrarySkeleton from './components/Skeleton'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import Stats from './pages/Stats'
import { useGames } from './hooks/useGames'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user, checking, signIn, register, signOut } = useAuth()
  const { games, loading, error, refresh, addGame, updateGame, deleteGame } = useGames(user)
  const { theme, toggleTheme } = useTheme()

  const [view, setView] = useState('dashboard')
  const [modal, setModal] = useState(null)

  const openAddModal = () => setModal({ game: null })
  const openEditModal = (game) => setModal({ game })
  const closeModal = () => setModal(null)

  const handleSave = async (data) => {
    if (modal.game) {
      await updateGame(modal.game.id, data)
    } else {
      await addGame(data)
    }
    closeModal()
  }

  const handleDelete = async (id) => {
    await deleteGame(id)
    closeModal()
  }

  if (checking) {
    return (
      <div className="boot-screen">
        <span className="boot-mark">🎮</span>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen onSignIn={signIn} onRegister={register} />
  }

  function content() {
    if (loading) {
      return <LibrarySkeleton />
    }

    if (error) {
      return (
        <div className="notice notice-error">
          <p>Couldn&apos;t reach the server: {error}</p>
          <p>Make sure the API is running on port 4000, then try again.</p>
          <button className="btn-secondary" onClick={refresh}>
            Retry
          </button>
        </div>
      )
    }

    if (view === 'library') {
      return <Library games={games} onSelectGame={openEditModal} onAddGame={openAddModal} />
    }

    if (view === 'stats') {
      return <Stats games={games} onSelectGame={openEditModal} onAddGame={openAddModal} />
    }

    return (
      <Dashboard
        games={games}
        username={user.username}
        onSelectGame={openEditModal}
        onAddGame={openAddModal}
        onGoToLibrary={() => setView('library')}
      />
    )
  }

  return (
    <div className="app">
      <Topbar
        view={view}
        onViewChange={setView}
        theme={theme}
        onToggleTheme={toggleTheme}
        onAddGame={openAddModal}
        username={user.username}
        onSignOut={signOut}
      />

      {content()}

      <footer className="credit">
        Game data and cover art from{' '}
        <a href="https://rawg.io" target="_blank" rel="noreferrer">
          RAWG
        </a>
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
