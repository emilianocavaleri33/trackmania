import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { getTechniqueBySlug } from '../data/techniques';
import axios from 'axios';

// Per-technique screenshot palette (3 unique gradient screenshots using canvas-generated placeholders)
function ScreenshotPlaceholder({ label, colors }) {
  return (
    <div
      className="screenshot-item"
      style={{
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0.6rem',
      }}
    >
      <span
        style={{
          color: '#fff',
          fontSize: '0.7rem',
          fontWeight: 700,
          background: 'rgba(0,0,0,0.5)',
          padding: '2px 6px',
          borderRadius: 4,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function TrajectorySVG({ technique }) {
  const slug = technique?.slug || '';
  const surface = technique?.surface || 'Qualsiasi';
  
  // Define simple geometric track layouts for each technique
  const getTrackSVG = () => {
    if (slug === 'speed-slide') {
      // Speed Slide: L-shape curve (two rectangles)
      return `
        <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <filter id="glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ff8800"/>
            </filter>
          </defs>
          
          <rect width="380" height="200" fill="#0d0d0d" rx="8"/>
          
          <!-- L-shape track -->
          <rect x="30" y="40" width="200" height="40" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20"/>
          <rect x="190" y="40" width="40" height="120" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20"/>
          
          <!-- Trajectory -->
          <path d="M 50 60 L 200 60 L 200 140" 
                fill="none" stroke="#ff8800" stroke-width="3" 
                stroke-dasharray="200" stroke-dashoffset="200"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="200" to="0" dur="2s" fill="freeze"/>
          </path>
          
          <!-- Badge -->
          <rect x="15" y="170" width="70" height="20" fill="#111" rx="3"/>
          <text x="20" y="184" font-family="Arial" font-size="11" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    if (slug === 'bug-slide') {
      // Bug Slide: Sharp L-turn (two rectangles)
      return `
        <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <filter id="glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ffff00"/>
            </filter>
          </defs>
          
          <rect width="380" height="200" fill="#0d0d0d" rx="8"/>
          
          <!-- L-shape track -->
          <rect x="30" y="80" width="150" height="40" fill="#3a2010" stroke="#7a5020" stroke-width="1" rx="20"/>
          <rect x="140" y="80" width="40" height="80" fill="#3a2010" stroke="#7a5020" stroke-width="1" rx="20"/>
          
          <!-- Trajectory -->
          <path d="M 50 100 L 160 100 L 160 140" 
                fill="none" stroke="#ffff00" stroke-width="3" 
                stroke-dasharray="150" stroke-dashoffset="150"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="150" to="0" dur="2s" fill="freeze"/>
          </path>
          
          <!-- Badge -->
          <rect x="15" y="170" width="60" height="20" fill="#111" rx="3"/>
          <text x="20" y="184" font-family="Arial" font-size="11" fill="#ffffff">🏖️ Dirt</text>
        </svg>
      `;
    }
    
    if (slug === 'double-drift') {
      // Double Drift: S-curve (three rectangles zigzag)
      return `
        <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <filter id="glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ff00ff"/>
            </filter>
          </defs>
          
          <rect width="380" height="200" fill="#0d0d0d" rx="8"/>
          
          <!-- S-curve track (three rectangles) -->
          <rect x="30" y="40" width="100" height="40" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20"/>
          <rect x="80" y="80" width="100" height="40" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20"/>
          <rect x="130" y="120" width="220" height="40" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20"/>
          
          <!-- Trajectory -->
          <path d="M 50 60 L 110 60 L 110 100 L 170 100 L 170 140 L 330 140" 
                fill="none" stroke="#ff00ff" stroke-width="3" 
                stroke-dasharray="300" stroke-dashoffset="300"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="300" to="0" dur="2s" fill="freeze"/>
          </path>
          
          <!-- Badge -->
          <rect x="15" y="170" width="70" height="20" fill="#111" rx="3"/>
          <text x="20" y="184" font-family="Arial" font-size="11" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    if (slug === 'backwards-driving') {
      // Backwards Driving: Straight track (one rectangle)
      return `
        <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <filter id="glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ff8800"/>
            </filter>
          </defs>
          
          <rect width="380" height="200" fill="#0d0d0d" rx="8"/>
          
          <!-- Straight track -->
          <rect x="30" y="80" width="320" height="40" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20"/>
          
          <!-- Trajectory (right to left) -->
          <path d="M 330 100 L 50 100" 
                fill="none" stroke="#ff8800" stroke-width="3" 
                stroke-dasharray="280" stroke-dashoffset="280"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="280" to="0" dur="2s" fill="freeze"/>
          </path>
          
          <!-- Badge -->
          <rect x="15" y="170" width="70" height="20" fill="#111" rx="3"/>
          <text x="20" y="184" font-family="Arial" font-size="11" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    if (slug === 'air-brake-roll') {
      // Air Brake Roll: Jump ramp (rectangle + triangle)
      return `
        <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <filter id="glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#00ccff"/>
            </filter>
          </defs>
          
          <rect width="380" height="200" fill="#0d0d0d" rx="8"/>
          
          <!-- Landing track -->
          <rect x="30" y="100" width="120" height="40" fill="#0a2030" stroke="#4a90b0" stroke-width="1" rx="20"/>
          <!-- Jump ramp (triangle) -->
          <polygon points="150,100 230,100 190,60" fill="#0a2030" stroke="#4a90b0" stroke-width="1"/>
          <!-- Landing track -->
          <rect x="230" y="100" width="120" height="40" fill="#0a2030" stroke="#4a90b0" stroke-width="1" rx="20"/>
          
          <!-- Trajectory -->
          <path d="M 50 120 Q 190 40 330 120" 
                fill="none" stroke="#00ccff" stroke-width="3" 
                stroke-dasharray="300" stroke-dashoffset="300"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="300" to="0" dur="2s" fill="freeze"/>
          </path>
          
          <!-- Badge -->
          <rect x="15" y="170" width="60" height="20" fill="#111" rx="3"/>
          <text x="20" y="184" font-family="Arial" font-size="11" fill="#ffffff">✈️ Aria</text>
        </svg>
      `;
    }
    
    if (slug === 'wallride') {
      // Wallride: L-shape with vertical wall
      return `
        <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <filter id="glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ff8800"/>
            </filter>
          </defs>
          
          <rect width="380" height="200" fill="#0d0d0d" rx="8"/>
          
          <!-- Ground tracks -->
          <rect x="30" y="150" width="80" height="30" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20"/>
          <rect x="270" y="150" width="80" height="30" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20"/>
          <!-- Wall (vertical rectangle) -->
          <rect x="110" y="30" width="40" height="120" fill="#4a4a4a" stroke="#666" stroke-width="1" rx="20"/>
          
          <!-- Trajectory -->
          <path d="M 50 165 L 110 165 L 110 60 L 150 60 L 150 165 L 310 165" 
                fill="none" stroke="#ff8800" stroke-width="3" 
                stroke-dasharray="250" stroke-dashoffset="250"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="250" to="0" dur="2s" fill="freeze"/>
          </path>
          
          <!-- Badge -->
          <rect x="15" y="170" width="70" height="20" fill="#111" rx="3"/>
          <text x="20" y="184" font-family="Arial" font-size="11" fill="#ffffff">🧗 Pareti</text>
        </svg>
      `;
    }
    
    if (slug === 'scoot') {
      // Scoot: Transition (two rectangles)
      return `
        <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <filter id="glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#00ff00"/>
            </filter>
          </defs>
          
          <rect width="380" height="200" fill="#0d0d0d" rx="8"/>
          
          <!-- Dirt section -->
          <rect x="30" y="80" width="160" height="40" fill="#3a2010" stroke="#7a5020" stroke-width="1" rx="20"/>
          <!-- Grass section -->
          <rect x="190" y="80" width="160" height="40" fill="#1a3a1a" stroke="#3a6a3a" stroke-width="1" rx="20"/>
          
          <!-- Trajectory -->
          <path d="M 50 100 L 350 100" 
                fill="none" stroke="#00ff00" stroke-width="3" 
                stroke-dasharray="300" stroke-dashoffset="300"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="300" to="0" dur="2s" fill="freeze"/>
          </path>
          
          <!-- Badge -->
          <rect x="15" y="170" width="80" height="20" fill="#111" rx="3"/>
          <text x="20" y="184" font-family="Arial" font-size="11" fill="#ffffff">🌱 Transizioni</text>
        </svg>
      `;
    }
    
    if (slug === 'superdive') {
      // Superdive: Diagonal descent (rectangle)
      return `
        <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <filter id="glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ffff00"/>
            </filter>
          </defs>
          
          <rect width="380" height="200" fill="#0d0d0d" rx="8"/>
          
          <!-- Diagonal track -->
          <rect x="30" y="40" width="320" height="40" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20" 
                transform="rotate(-15 190 60)"/>
          
          <!-- Trajectory -->
          <path d="M 50 60 L 330 120" 
                fill="none" stroke="#ffff00" stroke-width="3" 
                stroke-dasharray="300" stroke-dashoffset="300"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="300" to="0" dur="2s" fill="freeze"/>
          </path>
          
          <!-- Badge -->
          <rect x="15" y="170" width="70" height="20" fill="#111" rx="3"/>
          <text x="20" y="184" font-family="Arial" font-size="11" fill="#ffffff">📉 Discese</text>
        </svg>
      `;
    }
    
    if (slug === 'ice-drift') {
      // Ice Drift: Wide curve (L-shape)
      return `
        <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <filter id="glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#00ccff"/>
            </filter>
          </defs>
          
          <rect width="380" height="200" fill="#0d0d0d" rx="8"/>
          
          <!-- L-shape ice track -->
          <rect x="30" y="40" width="200" height="50" fill="#0a2030" stroke="#4a90b0" stroke-width="1" rx="20"/>
          <rect x="180" y="40" width="50" height="120" fill="#0a2030" stroke="#4a90b0" stroke-width="1" rx="20"/>
          
          <!-- Trajectory -->
          <path d="M 50 65 L 200 65 L 200 140" 
                fill="none" stroke="#00ccff" stroke-width="3" 
                stroke-dasharray="200" stroke-dashoffset="200"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="200" to="0" dur="2s" fill="freeze"/>
          </path>
          
          <!-- Badge -->
          <rect x="15" y="170" width="70" height="20" fill="#111" rx="3"/>
          <text x="20" y="184" font-family="Arial" font-size="11" fill="#ffffff">🧊 Ghiaccio</text>
        </svg>
      `;
    }
    
    if (slug === 'road-drift') {
      // Road Drift: Simple curve (L-shape)
      return `
        <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <filter id="glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#00ff00"/>
            </filter>
          </defs>
          
          <rect width="380" height="200" fill="#0d0d0d" rx="8"/>
          
          <!-- Simple L-shape curve -->
          <rect x="30" y="60" width="150" height="40" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20"/>
          <rect x="140" y="60" width="40" height="80" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20"/>
          
          <!-- Trajectory -->
          <path d="M 50 80 L 160 80 L 160 120" 
                fill="none" stroke="#00ff00" stroke-width="3" 
                stroke-dasharray="150" stroke-dashoffset="150"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="150" to="0" dur="2s" fill="freeze"/>
          </path>
          
          <!-- Badge -->
          <rect x="15" y="170" width="70" height="20" fill="#111" rx="3"/>
          <text x="20" y="184" font-family="Arial" font-size="11" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    if (slug === 'gear-management') {
      // Gear Management: Straight track (one rectangle)
      return `
        <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <filter id="glow">
              <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ff8800"/>
            </filter>
          </defs>
          
          <rect width="380" height="200" fill="#0d0d0d" rx="8"/>
          
          <!-- Straight track -->
          <rect x="30" y="80" width="320" height="40" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20"/>
          
          <!-- Trajectory -->
          <path d="M 50 100 L 330 100" 
                fill="none" stroke="#ff8800" stroke-width="3" 
                stroke-dasharray="280" stroke-dashoffset="280"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="280" to="0" dur="2s" fill="freeze"/>
          </path>
          
          <!-- Badge -->
          <rect x="15" y="170" width="70" height="20" fill="#111" rx="3"/>
          <text x="20" y="184" font-family="Arial" font-size="11" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    // Default SVG
    return `
      <svg viewBox="0 0 380 200" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
        <defs>
          <filter id="glow">
            <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#ff8800"/>
          </filter>
        </defs>
        
        <rect width="380" height="200" fill="#0d0d0d" rx="8"/>
        <rect x="30" y="80" width="320" height="40" fill="#2a2a2a" stroke="#555" stroke-width="1" rx="20"/>
        
        <path d="M 50 100 L 330 100" 
              fill="none" stroke="#ff8800" stroke-width="3" 
              stroke-dasharray="280" stroke-dashoffset="280"
              filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" from="280" to="0" dur="2s" fill="freeze"/>
        </path>
        
        <rect x="15" y="170" width="60" height="20" fill="#111" rx="3"/>
        <text x="20" y="184" font-family="Arial" font-size="11" fill="#ffffff">🏁 Pista</text>
      </svg>
    `;
  };

  return (
    <div 
      className="trajectory-svg-wrapper" 
      style={{ 
        background: '#000000', 
        borderRadius: '12px', 
        padding: '20px', 
        border: '1px solid #333',
        overflow: 'hidden'
      }}
      dangerouslySetInnerHTML={{ __html: getTrackSVG() }}
    />
  );
}

function Quiz({ technique, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = technique.quiz[current];

  function handleSelect(idx) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.answer) setScore((s) => s + 1);
  }

  function handleNext() {
    if (current + 1 < technique.quiz.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setDone(true);
      onComplete(score + (selected === q.answer ? 1 : 0));
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setAnswered(false);
  }

  if (done) {
    const finalScore = score + (selected === q.answer ? 1 : 0);
    const pct = Math.round((finalScore / technique.quiz.length) * 100);
    return (
      <div className="quiz-wrapper">
        <div className="quiz-result">
          <div className="score">{finalScore}/{technique.quiz.length}</div>
          <div className="score-label">Risposte corrette</div>
          <p>
            {pct >= 80
              ? '🏆 Eccellente! Sei un pro di questa tecnica!'
              : pct >= 60
              ? '👍 Buon lavoro! Continua a praticare.'
              : '📚 Studia ancora la tecnica e riprova!'}
          </p>
          <button className="quiz-restart-btn" onClick={handleRestart}>
            🔄 Riprova Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-wrapper">
      <div className="quiz-progress">
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${((current) / technique.quiz.length) * 100}%` }}
          />
        </div>
        <span className="quiz-progress-text">
          {current + 1} / {technique.quiz.length}
        </span>
      </div>

      <div className="quiz-question">{q.q}</div>

      <div className="quiz-options">
        {q.options.map((opt, idx) => {
          let cls = 'quiz-option';
          if (answered) {
            if (idx === q.answer) cls += ' correct';
            else if (idx === selected && idx !== q.answer) cls += ' wrong';
          }
          return (
            <button
              key={idx}
              className={cls}
              onClick={() => handleSelect(idx)}
              disabled={answered}
            >
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`quiz-feedback ${selected === q.answer ? 'correct' : 'wrong'}`}>
          {selected === q.answer ? '✅ Corretto!' : `❌ Sbagliato. Risposta: ${q.options[q.answer]}`}
        </div>
      )}

      {answered && (
        <button className="quiz-next-btn" onClick={handleNext}>
          {current + 1 < technique.quiz.length ? 'Prossima domanda →' : 'Vedi risultato 🏁'}
        </button>
      )}
    </div>
  );
}

const SCREENSHOT_COLORS = [
  ['#001a33', '#0055aa', '#003366'],
  ['#001a00', '#004400', '#002200'],
  ['#1a0000', '#440000', '#220000'],
  ['#1a1a00', '#444400', '#222200'],
  ['#00001a', '#000044', '#000022'],
  ['#0a001a', '#220044', '#110022'],
  ['#001a1a', '#004444', '#002222'],
  ['#1a001a', '#440044', '#220022'],
  ['#001133', '#003388', '#002255'],
  ['#001a0d', '#004422', '#002211'],
];

const SCREENSHOT_LABELS = [
  'Approccio', 'Esecuzione', 'Uscita',
];

export default function TechniquePage() {
  const { slug } = useParams();
  const technique = getTechniqueBySlug(slug);

  async function handleQuizComplete(score) {
    const result = { technique: slug, score, total: technique.quiz.length };
    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('tm_quiz_results') || '{}');
    saved[slug] = {
      score,
      total: technique.quiz.length,
      percentage: Math.round((score / technique.quiz.length) * 100),
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('tm_quiz_results', JSON.stringify(saved));
    // Try backend
    try {
      await axios.post('http://localhost:8000/api/quiz/save', result, { timeout: 2000 });
    } catch { /* backend optional */ }
  }

  if (!technique) {
    return (
      <div className="page-wrapper">
        <p>Tecnica non trovata. <Link to="/tecniche">Torna alla lista</Link></p>
      </div>
    );
  }

  const colorSet = SCREENSHOT_COLORS[
    Math.abs(slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % SCREENSHOT_COLORS.length
  ];

  return (
    <div className="technique-page">
      <div className="tech-breadcrumb">
        <Link to="/">Home</Link> › <Link to="/tecniche">Tecniche</Link> › {technique.name}
      </div>

      <div className="tech-title-bar">
        <span className="emoji">{technique.emoji}</span>
        <div>
          <h1>{technique.name}</h1>
          <div className="meta">
            <span className="tc-badge badge-surface">{technique.surface}</span>
            <span className="tc-badge badge-difficulty">{technique.difficulty}</span>
            <span className="tc-badge badge-speed">{technique.minSpeed}</span>
          </div>
        </div>
      </div>

      {/* VIDEO */}
      <div className="section-block">
        <h2>🎬 Tutorial Video</h2>
        <div className="video-container">
          <iframe
            src={`https://www.youtube.com/embed/${technique.youtubeId}?rel=0&modestbranding=1&start=${technique.startTime || 0}`}
            title={`Tutorial: ${technique.name}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="section-block">
        <h2>📖 Spiegazione Dettagliata</h2>
        <div className="description-text">{technique.description}</div>
      </div>

      {/* RECENT GAMEPLAY SCREENSHOT */}
      <div className="section-block">
        <h2>🎮 Gameplay</h2>
        <div className="real-screenshot-container">
          <img 
            src={technique.imageUrl} 
            alt={`${technique.name} Screenshot`} 
            className="tech-main-screenshot"
            style={{ width: '100%', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
      </div>

      {/* CONTROLS TABLE */}
      <div className="section-block">
        <h2>🎮 Controlli</h2>
        <table className="controls-table">
          <thead>
            <tr>
              <th>Piattaforma</th>
              <th>Input</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>💻 PC (Tastiera)</td>
              <td>{technique.controls.pc}</td>
            </tr>
            <tr>
              <td>🎮 Xbox</td>
              <td>{technique.controls.xbox}</td>
            </tr>
            <tr>
              <td>🎮 PlayStation</td>
              <td>{technique.controls.ps}</td>
            </tr>
          </tbody>
        </table>
      </div>


      {/* CANVAS TRAJECTORY */}
      <div className="section-block">
        <h2>🗺️ Traiettoria Ideale</h2>
        <TrajectorySVG technique={technique} />
        <div className="surface-indicator" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Superficie:</span>
          <span className="tc-badge badge-surface" style={{ 
            fontSize: '1rem', 
            padding: '0.4rem 1rem',
            background: technique.surface.includes('Asfalto') ? '#2a4858' :
                        technique.surface.includes('Ghiaccio') ? '#1a3a52' :
                        technique.surface.includes('Erba') ? '#1a4a2a' :
                        technique.surface.includes('Sabbia') || technique.surface.includes('Dirt') ? '#4a3a1a' :
                        technique.surface.includes('Aria') ? '#3a1a4a' : '#2a2a3a'
          }}>
            {technique.surface.includes('Asfalto') ? '🏁 ' : 
             technique.surface.includes('Ghiaccio') ? '🧊 ' : 
             technique.surface.includes('Erba') ? '🌱 ' : 
             technique.surface.includes('Sabbia') || technique.surface.includes('Dirt') ? '🏖️ ' : 
             technique.surface.includes('Aria') ? '✈️ ' :
             technique.surface.includes('Pareti') ? '🧗 ' : '🛸 '}
            {technique.surface}
          </span>
        </div>
      </div>

      {/* QUIZ */}
      <div className="section-block">
        <h2>❓ Quiz — {technique.name}</h2>
        <Quiz technique={technique} onComplete={handleQuizComplete} />
      </div>
    </div>
  );
}
