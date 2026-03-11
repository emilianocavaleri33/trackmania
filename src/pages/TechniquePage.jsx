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
  
  // Define minimal clean track layouts for each technique
  const getTrackSVG = () => {
    if (slug === 'speed-slide') {
      // Speed Slide: Long gentle curve
      return `
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="traj" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#00ff88"/>
              <stop offset="100%" style="stop-color:#0088ff"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="220" fill="#0d0d0d" rx="8"/>
          
          <!-- Track -->
          <path d="M 30 80 Q 200 80 370 50 L 370 90 Q 200 120 30 120 Z" 
                fill="#3a3a3a" stroke="#ffffff" stroke-width="1"/>
          
          <!-- Trajectory -->
          <path d="M 40 90 Q 200 90 360 60" 
                fill="none" stroke="url(#traj)" stroke-width="4" 
                stroke-dasharray="350" stroke-dashoffset="350"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="350" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Arrow -->
          <polygon points="350,60 360,55 360,65" fill="#00ff88"/>
          
          <!-- Badge -->
          <rect x="15" y="190" width="70" height="20" fill="#222" rx="3"/>
          <text x="20" y="204" font-family="Arial" font-size="11" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    if (slug === 'bug-slide') {
      // Bug Slide: Sharp 90° turn
      return `
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="traj" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#ff6600"/>
              <stop offset="100%" style="stop-color:#ff0066"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="220" fill="#0d0d0d" rx="8"/>
          
          <!-- Track -->
          <rect x="30" y="80" width="140" height="30" fill="#3a2010" stroke="#8b6914" stroke-width="1" rx="3"/>
          <rect x="150" y="110" width="220" height="30" fill="#3a2010" stroke="#8b6914" stroke-width="1" rx="3"/>
          
          <!-- Trajectory -->
          <path d="M 40 95 L 160 95 L 160 125 L 360 125" 
                fill="none" stroke="url(#traj)" stroke-width="4" 
                stroke-dasharray="350" stroke-dashoffset="350"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="350" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Arrow -->
          <polygon points="350,125 360,120 360,130" fill="#ff6600"/>
          
          <!-- Badge -->
          <rect x="15" y="190" width="60" height="20" fill="#222" rx="3"/>
          <text x="20" y="204" font-family="Arial" font-size="11" fill="#ffffff">🏖️ Dirt</text>
        </svg>
      `;
    }
    
    if (slug === 'double-drift') {
      // Double Drift: S-curve
      return `
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="traj" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#00ffcc"/>
              <stop offset="50%" style="stop-color:#ff00ff"/>
              <stop offset="100%" style="stop-color:#00ffcc"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="220" fill="#0d0d0d" rx="8"/>
          
          <!-- S-curve track -->
          <path d="M 30 110 Q 80 110 80 70 Q 80 30 130 30 Q 180 30 180 70 Q 180 110 230 110 Q 280 110 280 70 Q 280 30 330 30 Q 380 30 380 70
                   L 380 90 Q 330 90 280 130 Q 230 130 180 90 Q 180 50 130 50 Q 80 50 80 90 Q 80 130 30 130 Z" 
                fill="#3a3a3a" stroke="#ffffff" stroke-width="1"/>
          
          <!-- Trajectory -->
          <path d="M 40 120 Q 70 120 70 80 Q 70 40 120 40 Q 170 40 170 80 Q 170 120 220 120 Q 270 120 270 80 Q 270 40 320 40 Q 370 40 370 80" 
                fill="none" stroke="url(#traj)" stroke-width="4" 
                stroke-dasharray="400" stroke-dashoffset="400"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="400" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Arrow -->
          <polygon points="360,80 370,75 370,85" fill="#00ffcc"/>
          
          <!-- Badge -->
          <rect x="15" y="190" width="70" height="20" fill="#222" rx="3"/>
          <text x="20" y="204" font-family="Arial" font-size="11" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    if (slug === 'backwards-driving') {
      // Backwards Driving: Straight track (reverse)
      return `
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="traj" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#ffff00"/>
              <stop offset="100%" style="stop-color:#ff9900"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="220" fill="#0d0d0d" rx="8"/>
          
          <!-- Track -->
          <rect x="30" y="95" width="340" height="30" fill="#3a3a3a" stroke="#ffffff" stroke-width="1" rx="3"/>
          
          <!-- Trajectory (right to left) -->
          <path d="M 360 110 L 40 110" 
                fill="none" stroke="url(#traj)" stroke-width="4" 
                stroke-dasharray="320" stroke-dashoffset="320"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="320" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Reverse arrow -->
          <polygon points="50,110 40,105 40,115" fill="#ffff00"/>
          
          <!-- Badge -->
          <rect x="15" y="190" width="70" height="20" fill="#222" rx="3"/>
          <text x="20" y="204" font-family="Arial" font-size="11" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    if (slug === 'air-brake-roll') {
      // Air Brake Roll: Jump ramp
      return `
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="traj" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#00ccff"/>
              <stop offset="100%" style="stop-color:#0066ff"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="220" fill="#0d0d0d" rx="8"/>
          
          <!-- Ramps -->
          <polygon points="30,140 130,140 130,100 30,100" fill="#0a1428" stroke="#5ab4d4" stroke-width="1"/>
          <polygon points="270,140 370,140 370,100 270,100" fill="#0a1428" stroke="#5ab4d4" stroke-width="1"/>
          
          <!-- Trajectory -->
          <path d="M 40 120 Q 200 40 360 120" 
                fill="none" stroke="url(#traj)" stroke-width="4" 
                stroke-dasharray="350" stroke-dashoffset="350"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="350" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Arrow -->
          <polygon points="350,120 360,115 360,125" fill="#00ccff"/>
          
          <!-- Badge -->
          <rect x="15" y="190" width="60" height="20" fill="#222" rx="3"/>
          <text x="20" y="204" font-family="Arial" font-size="11" fill="#ffffff">✈️ Aria</text>
        </svg>
      `;
    }
    
    if (slug === 'wallride') {
      // Wallride: L-shape with vertical wall
      return `
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="traj" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#ff00ff"/>
              <stop offset="100%" style="stop-color:#ff8800"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="220" fill="#0d0d0d" rx="8"/>
          
          <!-- Ground tracks -->
          <rect x="30" y="150" width="90" height="25" fill="#3a3a3a" stroke="#ffffff" stroke-width="1" rx="3"/>
          <rect x="280" y="150" width="90" height="25" fill="#3a3a3a" stroke="#ffffff" stroke-width="1" rx="3"/>
          
          <!-- Wall -->
          <rect x="120" y="40" width="160" height="135" fill="#4a4a4a" stroke="#ffffff" stroke-width="1"/>
          
          <!-- Trajectory -->
          <path d="M 40 162 L 120 162 L 120 60 L 280 60 L 280 162 L 360 162" 
                fill="none" stroke="url(#traj)" stroke-width="4" 
                stroke-dasharray="380" stroke-dashoffset="380"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="380" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Arrow -->
          <polygon points="350,162 360,157 360,167" fill="#ff00ff"/>
          
          <!-- Badge -->
          <rect x="15" y="190" width="70" height="20" fill="#222" rx="3"/>
          <text x="20" y="204" font-family="Arial" font-size="11" fill="#ffffff">🧗 Pareti</text>
        </svg>
      `;
    }
    
    if (slug === 'scoot') {
      // Scoot: Transition with wiggle
      return `
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="traj" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#00ff00"/>
              <stop offset="50%" style="stop-color:#ffff00"/>
              <stop offset="100%" style="stop-color:#00ff00"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="220" fill="#0d0d0d" rx="8"/>
          
          <!-- Dirt section -->
          <rect x="30" y="95" width="170" height="30" fill="#3a2010" stroke="#8b6914" stroke-width="1" rx="3"/>
          <!-- Grass section -->
          <rect x="200" y="95" width="170" height="30" fill="#1e3a1e" stroke="#4a7a4a" stroke-width="1" rx="3"/>
          
          <!-- Trajectory -->
          <path d="M 40 110 L 190 110 L 195 100 L 205 120 L 215 100 L 225 120 L 230 110 L 360 110" 
                fill="none" stroke="url(#traj)" stroke-width="4" 
                stroke-dasharray="350" stroke-dashoffset="350"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="350" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Arrow -->
          <polygon points="350,110 360,105 360,115" fill="#00ff00"/>
          
          <!-- Badge -->
          <rect x="15" y="190" width="80" height="20" fill="#222" rx="3"/>
          <text x="20" y="204" font-family="Arial" font-size="11" fill="#ffffff">🌱 Transizioni</text>
        </svg>
      `;
    }
    
    if (slug === 'superdive') {
      // Superdive: Diagonal descent
      return `
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="traj" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#ff6600"/>
              <stop offset="100%" style="stop-color:#ffcc00"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="220" fill="#0d0d0d" rx="8"/>
          
          <!-- Diagonal track -->
          <path d="M 30 60 L 370 160 L 370 180 L 30 80 Z" 
                fill="#3a3a3a" stroke="#ffffff" stroke-width="1"/>
          
          <!-- Trajectory -->
          <path d="M 40 70 L 360 170" 
                fill="none" stroke="url(#traj)" stroke-width="4" 
                stroke-dasharray="350" stroke-dashoffset="350"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="350" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Arrow -->
          <polygon points="350,170 360,165 360,175" fill="#ff6600"/>
          
          <!-- Badge -->
          <rect x="15" y="190" width="70" height="20" fill="#222" rx="3"/>
          <text x="20" y="204" font-family="Arial" font-size="11" fill="#ffffff">📉 Discese</text>
        </svg>
      `;
    }
    
    if (slug === 'ice-drift') {
      // Ice Drift: Wide curve on ice
      return `
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="traj" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#00ccff"/>
              <stop offset="100%" style="stop-color:#ffffff"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="220" fill="#0d0d0d" rx="8"/>
          
          <!-- Ice track (wide curve) -->
          <path d="M 30 110 Q 200 110 370 50 L 370 90 Q 200 150 30 150 Z" 
                fill="#0d2030" stroke="#5ab4d4" stroke-width="1"/>
          
          <!-- Trajectory -->
          <path d="M 40 140 Q 200 140 360 60" 
                fill="none" stroke="url(#traj)" stroke-width="4" 
                stroke-dasharray="350" stroke-dashoffset="350"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="350" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Arrow -->
          <polygon points="350,60 360,55 360,65" fill="#00ccff"/>
          
          <!-- Badge -->
          <rect x="15" y="190" width="70" height="20" fill="#222" rx="3"/>
          <text x="20" y="204" font-family="Arial" font-size="11" fill="#ffffff">🧊 Ghiaccio</text>
        </svg>
      `;
    }
    
    if (slug === 'road-drift') {
      // Road Drift: Simple curve
      return `
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="traj" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#00ff00"/>
              <stop offset="100%" style="stop-color:#00cc66"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="220" fill="#0d0d0d" rx="8"/>
          
          <!-- Simple curve track -->
          <path d="M 30 110 Q 150 110 150 70 Q 150 30 250 30 Q 350 30 370 70
                   L 370 90 Q 350 50 250 50 Q 150 50 150 90 Q 150 130 30 130 Z" 
                fill="#3a3a3a" stroke="#ffffff" stroke-width="1"/>
          
          <!-- Trajectory -->
          <path d="M 40 120 Q 130 120 130 80 Q 130 40 230 40 Q 330 40 360 80" 
                fill="none" stroke="url(#traj)" stroke-width="4" 
                stroke-dasharray="350" stroke-dashoffset="350"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="350" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Arrow -->
          <polygon points="350,80 360,75 360,85" fill="#00ff00"/>
          
          <!-- Badge -->
          <rect x="15" y="190" width="70" height="20" fill="#222" rx="3"/>
          <text x="20" y="204" font-family="Arial" font-size="11" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    if (slug === 'gear-management') {
      // Gear Management: Straight track with indicators
      return `
        <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="traj" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#ff00ff"/>
              <stop offset="100%" style="stop-color:#ffaa00"/>
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="400" height="220" fill="#0d0d0d" rx="8"/>
          
          <!-- Straight track -->
          <rect x="30" y="95" width="340" height="30" fill="#3a3a3a" stroke="#ffffff" stroke-width="1" rx="3"/>
          
          <!-- Gear indicators -->
          <circle cx="100" cy="110" r="6" fill="none" stroke="#ff00ff" stroke-width="2" opacity="0.6"/>
          <circle cx="200" cy="110" r="6" fill="none" stroke="#ff00ff" stroke-width="2" opacity="0.6"/>
          <circle cx="300" cy="110" r="6" fill="none" stroke="#ff00ff" stroke-width="2" opacity="0.6"/>
          
          <!-- Trajectory -->
          <path d="M 40 110 L 360 110" 
                fill="none" stroke="url(#traj)" stroke-width="4" 
                stroke-dasharray="320" stroke-dashoffset="320"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="320" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Arrow -->
          <polygon points="350,110 360,105 360,115" fill="#ff00ff"/>
          
          <!-- Badge -->
          <rect x="15" y="190" width="70" height="20" fill="#222" rx="3"/>
          <text x="20" y="204" font-family="Arial" font-size="11" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    // Default SVG
    return `
      <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
        <defs>
          <linearGradient id="traj" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00ff88"/>
            <stop offset="100%" style="stop-color:#0088ff"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="400" height="220" fill="#0d0d0d" rx="8"/>
        <rect x="30" y="95" width="340" height="30" fill="#3a3a3a" stroke="#ffffff" stroke-width="1" rx="3"/>
        
        <path d="M 40 110 L 360 110" 
              fill="none" stroke="url(#traj)" stroke-width="4" 
              stroke-dasharray="320" stroke-dashoffset="320"
              filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" from="320" to="0" dur="1.5s" fill="freeze"/>
        </path>
        
        <polygon points="350,110 360,105 360,115" fill="#00ff88"/>
        
        <rect x="15" y="190" width="60" height="20" fill="#222" rx="3"/>
        <text x="20" y="204" font-family="Arial" font-size="11" fill="#ffffff">🏁 Pista</text>
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
