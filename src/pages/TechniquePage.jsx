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
  
  // Define unique SVG paths for each movement type
  const getPathData = () => {
    if (slug.includes('drift')) {
      // Drift: Curva lunga con scivolata laterale fluida
      return "M 20 180 Q 100 180 180 120 T 380 80 Q 480 60 580 80";
    }
    if (slug === 'speed-slide') {
      // Speedslide: Curva stretta con traiettoria compressa e rapida
      return "M 20 100 C 80 100 120 200 200 200 S 320 100 400 100 S 520 100 580 100";
    }
    if (slug === 'bug-slide' || slug.includes('neoslide')) {
      // Neoslide/Bug-slide: Doppio cambio direzione angolare
      return "M 20 150 L 120 150 L 120 60 L 250 60 L 250 240 L 380 240 L 380 150 L 580 150";
    }
    if (slug === 'superdive' || slug.includes('jump')) {
      // Salto/Jump: Arco verticale pronunciato in aria
      return "M 20 280 Q 150 50 300 20 Q 450 50 580 280";
    }
    if (slug.includes('brake')) {
      // Airbrake: Discesa ripida con frenata improvvisa
      return "M 20 30 L 200 200 Q 300 250 580 250";
    }
    if (slug === 'gear-management' || slug.includes('speed') || slug === 'wallride') {
      // Speed/Wallride: Rettilineo veloce con piccole ondulazioni
      return "M 20 150 L 150 145 L 300 155 L 450 145 L 580 150";
    }
    if (slug === 'scoot') {
      // Hopper: Rimbalzi ripetuti e progressivi
      return "M 20 250 Q 50 180 80 250 Q 110 180 140 250 Q 170 180 200 250 Q 230 180 260 250 Q 290 180 320 250 Q 350 180 380 250 Q 410 180 440 250 Q 470 180 500 250 Q 530 180 560 250 Q 580 200";
    }
    // Default path
    return "M 20 200 Q 300 50 580 200";
  };

  const path = getPathData();

  return (
    <div className="trajectory-svg-wrapper" style={{ background: '#001a33', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
      <svg viewBox="0 0 600 300" style={{ width: '100%', height: 'auto' }}>
        <defs>
          <linearGradient id="grad-path" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0099ff" />
            <stop offset="100%" stopColor="#FF6600" />
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,102,204,0.15)" strokeWidth="1"/>
          </pattern>
        </defs>
        
        {/* Grid Background */}
        <rect width="600" height="300" fill="url(#grid)" />
        
        {/* Ideal Path (Shadow/Reference) */}
        <path 
          d={path} 
          fill="none" 
          stroke="rgba(255,255,255,0.05)" 
          strokeWidth="40" 
          strokeLinecap="round" 
        />
        
        {/* Technique Line */}
        <path 
          d={path} 
          fill="none" 
          stroke="url(#grad-path)" 
          strokeWidth="4" 
          strokeLinecap="round"
          strokeDasharray={slug.includes('drift') || slug === 'bug-slide' ? "10,5" : "0"}
        />

        {/* Direction Arrows along the path (simplified) */}
        <circle cx="50" cy="150" r="4" fill="#0099ff" visibility={slug === 'speed-slide' ? 'hidden' : 'visible'} />
        <circle cx="550" cy="150" r="4" fill="#FF6600" />
        
        <text x="10" y="290" fill="#0099ff" style={{ fontSize: '10px', fontWeight: 'bold' }}>TRAIETTORIA IDEALE</text>
        <text x="150" y="290" fill="#FF6600" style={{ fontSize: '10px', fontWeight: 'bold' }}>TECNICA APPLICATA</text>
      </svg>
    </div>
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
        <h2>📸 Screenshot Gameplay Reale</h2>
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
