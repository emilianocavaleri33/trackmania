import { Link } from 'react-router-dom';
import { techniques } from '../data/techniques';

export default function TechniquesPage() {
  return (
    <div className="page-wrapper">
      <div className="section-header">
        <h1>Tecniche <span>TrackMania 2020</span></h1>
        <p>Clicca su una tecnica per video, guida completa e quiz interattivo</p>
        <div className="section-divider" />
      </div>

      <div className="techniques-grid">
        {techniques.map((t) => (
          <Link key={t.slug} to={`/tecniche/${t.slug}`} className="technique-card">
            <span className="tc-emoji">{t.emoji}</span>
            <span className="tc-name">{t.name}</span>
            <div className="tc-meta">
              <span className="tc-badge badge-surface">{t.surface}</span>
              <span className="tc-badge badge-difficulty">{t.difficulty}</span>
              <span className="tc-badge badge-speed">{t.minSpeed}</span>
            </div>
            <span className="tc-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
