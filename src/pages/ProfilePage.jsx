import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { techniques } from '../data/techniques';
import { useProfile } from '../context/ProfileContext';

function getScoreColor(pct) {
  if (pct >= 80) return '#00cc66';
  if (pct >= 60) return '#FF6600';
  return '#cc0044';
}

export default function ProfilePage() {
  const { 
    profileData, 
    clearAllData, 
    updateProfileName,
    completedCount,
    totalTechniques,
    completionPercentage,
    isTechniqueStudied,
    getTechniqueResult
  } = useProfile();

  // Try to sync with backend on mount
  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('tm_quiz_results') || '{}');
    axios
      .get('http://localhost:8000/api/quiz/results', { timeout: 2000 })
      .then((res) => {
        // Merge with existing data if needed
        console.log('Backend data available:', res.data);
      })
      .catch(() => {});
  }, []);

  const { averageScore, perfectQuizzes, profileName, joinDate } = profileData;

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
          <h2>{profileName}</h2>
          <p>La tua scalata verso la maestria tecnica di TrackMania 2020.</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Membro dal: {new Date(joinDate).toLocaleDateString('it-IT')}
          </p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-value">{completedCount}/{totalTechniques}</div>
          <div className="stat-label">Tecniche Studiate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{averageScore}%</div>
          <div className="stat-label">Risultato Medio</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{perfectQuizzes}</div>
          <div className="stat-label">Quiz Perfetti ⭐</div>
        </div>
      </div>

      <div className="progress-section">
        <h2>📊 Progressi per Tecnica</h2>

        {techniques.map((t) => {
          const r = getTechniqueResult(t.slug);
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

        {completedCount > 0 && (
          <button className="clear-btn" onClick={clearAllData}>
            🗑️ Cancella tutti i progressi
          </button>
        )}

        {completedCount === 0 && (
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
