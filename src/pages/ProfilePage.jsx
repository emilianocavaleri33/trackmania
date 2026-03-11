import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { techniques } from '../data/techniques';

function getScoreColor(pct) {
  if (pct >= 80) return '#00cc66';
  if (pct >= 60) return '#FF6600';
  return '#cc0044';
}

export default function ProfilePage() {
  const [results, setResults] = useState({});

  useEffect(() => {
    // Load from localStorage
    const local = JSON.parse(localStorage.getItem('tm_quiz_results') || '{}');
    setResults(local);
    // Try merge from backend
    axios
      .get('http://localhost:8000/api/quiz/results', { timeout: 2000 })
      .then((res) => {
        const merged = { ...local, ...res.data };
        setResults(merged);
      })
      .catch(() => {});
  }, []);

  const completed = Object.keys(results).length;
  const totalTechniques = techniques.length;
  const avgScore =
    completed === 0
      ? 0
      : Math.round(
          Object.values(results).reduce((a, r) => a + (r.percentage || 0), 0) / completed
        );
  const perfect = Object.values(results).filter((r) => r.percentage === 100).length;

  function handleClear() {
    localStorage.removeItem('tm_quiz_results');
    setResults({});
    axios
      .delete('http://localhost:8000/api/quiz/results', { timeout: 2000 })
      .catch(() => {});
  }

  return (
    <div className="page-wrapper">
      <div className="section-header">
        <h1>Il tuo <span>Profilo</span></h1>
        <p>Progressi nei quiz e statistiche personali</p>
        <div className="section-divider" />
      </div>

      <div className="profile-header">
        <div className="profile-avatar">🏎️</div>
        <div className="profile-info">
          <h2>Campione TrackMania</h2>
          <p>La tua scalata verso la maestria tecnica di TrackMania 2020.</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-value">{completed}/{totalTechniques}</div>
          <div className="stat-label">Tecniche Studiate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{avgScore}%</div>
          <div className="stat-label">Risultato Medio</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{perfect}</div>
          <div className="stat-label">Quiz Perfetti ⭐</div>
        </div>
      </div>

      <div className="progress-section">
        <h2>📊 Progressi per Tecnica</h2>

        {techniques.map((t) => {
          const r = results[t.slug];
          const pct = r ? r.percentage : 0;
          const color = getScoreColor(pct);

          return (
            <div key={t.slug} className="progress-item">
              <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{t.emoji}</span>
              <span className="progress-name">{t.name}</span>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: r ? `${pct}%` : '0%',
                    background: r
                      ? `linear-gradient(90deg, ${color}, ${color}88)`
                      : 'var(--border-subtle)',
                  }}
                />
              </div>
              <span className="progress-score-text">
                {r ? `${r.score}/${r.total} (${pct}%)` : '—'}
              </span>
            </div>
          );
        })}

        {completed > 0 && (
          <button className="clear-btn" onClick={handleClear}>
            🗑️ Cancella tutti i progressi
          </button>
        )}

        {completed === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-muted)',
              fontSize: '0.95rem',
            }}
          >
            Nessun quiz completato ancora.{' '}
            <Link to="/tecniche" style={{ color: 'var(--accent-orange)' }}>
              Inizia dalle tecniche →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
