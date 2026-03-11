import { useState } from 'react';
import { Link } from 'react-router-dom';
import { techniques } from '../data/techniques';

export default function TechniquesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');

  const filteredTechniques = techniques.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'Tutti' || t.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const difficulties = ['Tutti', 'Principiante', 'Intermedio', 'Avanzato', 'Esperto'];

  return (
    <div className="page-wrapper">
      <div className="section-header">
        <h1>Tecniche <span>TrackMania 2020</span></h1>
        <p>Cerca una tecnica o filtra per difficoltà per iniziare l'allenamento</p>
        <div className="section-divider" />
      </div>

      <div className="search-filter-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Cerca tecnica..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          {difficulties.map(d => (
            <button 
              key={d}
              onClick={() => setFilterDifficulty(d)}
              className={`filter-btn ${filterDifficulty === d ? 'active' : ''}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="techniques-grid">
        {filteredTechniques.map((t) => (
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
        {filteredTechniques.length === 0 && (
          <div className="no-results">
            <p>Nessuna tecnica trovata per i criteri selezionati.</p>
          </div>
        )}
      </div>
    </div>
  );
}
