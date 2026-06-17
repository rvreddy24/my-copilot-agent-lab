import React, { useEffect, useState } from 'react'
import './App.css'

const buildBaseUrl = () => {
  const codespace = import.meta.env.VITE_CODESPACE_NAME
  if (codespace) {
    return `https://${codespace}-8000.preview.app.github.dev`
  }
  return 'http://localhost:8000'
}

export default function App() {
  const [view, setView] = useState('home')
  const [data, setData] = useState({
    users: [],
    teams: [],
    activities: [],
    leaderboard: [],
    workouts: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const base = buildBaseUrl()
    const endpoints = [
      '/api/users/',
      '/api/teams/',
      '/api/activities/',
      '/api/leaderboard/',
      '/api/workouts/',
    ]

    Promise.all(
      endpoints.map((ep) =>
        fetch(base + ep).then((res) => {
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
          return res.json()
        }),
      ),
    )
      .then(([users, teams, activities, leaderboard, workouts]) => {
        setData({ users, teams, activities, leaderboard, workouts })
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Octofit Tracker</h1>
        <nav>
          <button onClick={() => setView('home')}>Home</button>
          <button onClick={() => setView('users')}>Users</button>
          <button onClick={() => setView('teams')}>Teams</button>
          <button onClick={() => setView('activities')}>Activities</button>
          <button onClick={() => setView('leaderboard')}>Leaderboard</button>
          <button onClick={() => setView('workouts')}>Workouts</button>
        </nav>
      </header>

      <main>
        {loading && <p>Loading data from backend...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}

        {!loading && !error && (
          <section>
            {view === 'home' && (
              <div>
                <h2>Summary</h2>
                <ul>
                  <li>Users: {data.users?.length ?? 0}</li>
                  <li>Teams: {data.teams?.length ?? 0}</li>
                  <li>Activities: {data.activities?.length ?? 0}</li>
                  <li>Leaderboard entries: {data.leaderboard?.length ?? 0}</li>
                  <li>Workouts: {data.workouts?.length ?? 0}</li>
                </ul>
              </div>
            )}

            {view === 'users' && (
              <div>
                <h2>Users</h2>
                <pre>{JSON.stringify(data.users, null, 2)}</pre>
              </div>
            )}

            {view === 'teams' && (
              <div>
                <h2>Teams</h2>
                <pre>{JSON.stringify(data.teams, null, 2)}</pre>
              </div>
            )}

            {view === 'activities' && (
              <div>
                <h2>Activities</h2>
                <pre>{JSON.stringify(data.activities, null, 2)}</pre>
              </div>
            )}

            {view === 'leaderboard' && (
              <div>
                <h2>Leaderboard</h2>
                <pre>{JSON.stringify(data.leaderboard, null, 2)}</pre>
              </div>
            )}

            {view === 'workouts' && (
              <div>
                <h2>Workouts</h2>
                <pre>{JSON.stringify(data.workouts, null, 2)}</pre>
              </div>
            )}
          </section>
        )}
      </main>

      <footer>
        <small>Backend base: {buildBaseUrl()}</small>
      </footer>
    </div>
  )
}
