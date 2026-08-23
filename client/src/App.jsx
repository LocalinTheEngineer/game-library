import { useState } from 'react'
import Topbar from './components/Topbar'
import GameFormModal from './components/GameFormModal'
import AuthScreen from './components/AuthScreen'
import LibrarySkeleton from './components/Skeleton'
import ShareModal from './components/ShareModal'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Library from './pages/Library'
import Stats from './pages/Stats'
import { useGames } from './hooks/useGames'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './hooks/useAuth'
import { useHashRoute } from './hooks/useHashRoute'

export default function App() {
  const { user, checking, signIn, register, signOut, setVisibility } = useAuth()
  const { games, loading, error, refresh, addGame, updateGame, deleteGame } = useGames(user)
  const { theme, toggleTheme } = useTheme()

  const { route, goHome } = useHashRoute()
  const [view, setView] = useState('dashboard')
  const [modal, setModal] = useState(null)
  const [sharing, setSharing] = useState(false)

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

  if (route.name === 'profile') {
    return (
      <Profile
        username={route.username}
        theme={theme}
        onToggleTheme={toggleTheme}
        onGoHome={goHome}
        isSignedIn={Boolean(user)}
      />
    )
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
        onShare={() => setSharing(true)}
      />

      {content()}

      <footer className="credit">
        Game data and cover art from{' '}
        <a href="https://rawg.io" target="_blank" rel="noreferrer">
          RAWG
        </a>
      </footer>

      {sharing && (
        <ShareModal
          user={user}
          onSetVisibility={setVisibility}
          onClose={() => setSharing(false)}
        />
      )}

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
