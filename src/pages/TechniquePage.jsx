import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getTechniqueBySlug } from '../data/techniques';
import { useProfile } from '../context/ProfileContext';

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

function TrajectoryCanvas({ technique }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#001a33';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(0,102,204,0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Track border
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Adjust path per technique type
    const paths = {
      'bug-slide': [[60,120],[180,120],[280,80],[380,80],[460,130],[500,200],[460,260],[380,280],[280,280]],
      'double-drift': [[40,160],[160,160],[220,100],[300,100],[360,160],[420,220],[500,220],[560,160]],
      'ice-drift': [[40,200],[140,200],[260,140],[360,200],[430,260],[530,200],[600,140]],
      'wallride': [[40,80],[100,80],[200,200],[200,300],[300,300]],
    };
    const defaultPath = [[40,160],[150,160],[250,100],[380,100],[450,160],[480,240],[400,280],[280,280],[180,240]];
    const pts = paths[technique?.slug] || defaultPath;

    // Draw outer track area (wide stroke)
    ctx.strokeStyle = 'rgba(30,60,100,0.6)';
    ctx.lineWidth = 40;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();

    // Ideal racing line
    ctx.strokeStyle = '#0099ff';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();

    // Technique slide line
    ctx.strokeStyle = '#FF6600';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    const offset = 20;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1] + offset);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1] + offset * (i % 2 === 0 ? 1 : -1));
    ctx.stroke();
    ctx.setLineDash([]);

    // Arrow markers
    ctx.fillStyle = '#FF6600';
    for (let i = 1; i < pts.length - 1; i += 2) {
      const [x, y] = pts[i];
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Labels
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.fillStyle = '#0099ff';
    ctx.fillText('Traiettoria ideale', 10, H - 30);
    ctx.fillStyle = '#FF6600';
    ctx.fillText('Tecnica applicata', 10, H - 14);
  }, [technique]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={320}
      className="trajectory-canvas"
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
  const { saveQuizResult, markTechniqueStudied } = useProfile();

  // Mark technique as studied when page loads
  useEffect(() => {
    if (technique) {
      markTechniqueStudied(slug);
    }
  }, [technique, slug, markTechniqueStudied]);

  async function handleQuizComplete(score) {
    // Save to profile context (which handles localStorage)
    saveQuizResult(slug, score, technique.quiz.length);
    
    // Also try backend for compatibility
    const result = { technique: slug, score, total: technique.quiz.length };
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
        <TrajectoryCanvas technique={technique} />
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
