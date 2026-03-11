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
  
  // Define realistic track layouts for each technique
  const getTrackSVG = () => {
    if (slug === 'speed-slide') {
      // Speed Slide: Long gentle curve on asphalt with drift trajectory
      return `
        <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="asphalt" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#2a2a2a"/>
              <stop offset="100%" style="stop-color:#1a1a1a"/>
            </linearGradient>
            <linearGradient id="trajectory" x1="0%" y1="0%" x2="100%" y2="0%">
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
          
          <!-- Background -->
          <rect width="400" height="280" fill="#1a1a1a"/>
          
          <!-- Track (long gentle curve) -->
          <path d="M 20 100 Q 200 100 380 60 L 380 100 Q 200 140 20 140 Z" 
                fill="url(#asphalt)" stroke="#ffffff" stroke-width="2"/>
          
          <!-- Track edges -->
          <path d="M 20 100 Q 200 100 380 60" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.5"/>
          <path d="M 20 140 Q 200 140 380 100" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.5"/>
          
          <!-- Speed Slide trajectory (wide drift line) -->
          <path d="M 30 110 Q 180 110 370 75" 
                fill="none" stroke="url(#trajectory)" stroke-width="4" 
                stroke-dasharray="400" stroke-dashoffset="400"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="400" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Direction arrows -->
          <polygon points="350,75 360,70 360,80" fill="#00ff88" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" 
                              values="0,0; 20,0; 0,0" dur="2s" repeatCount="indefinite"/>
          </polygon>
          
          <!-- Car animation -->
          <rect width="12" height="8" fill="#ff4444" rx="2">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#carPath"/>
            </animateMotion>
          </rect>
          <path id="carPath" d="M 30 110 Q 180 110 370 75" fill="none"/>
          
          <!-- Surface badge -->
          <rect x="10" y="250" width="80" height="25" fill="#2a4858" rx="3"/>
          <text x="15" y="267" font-family="Arial" font-size="12" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    if (slug === 'bug-slide') {
      // Bug Slide: Sharp angle change after landing
      return `
        <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="dirt" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#4a3a1a"/>
              <stop offset="100%" style="stop-color:#2a1a0a"/>
            </linearGradient>
            <linearGradient id="trajectory" x1="0%" y1="0%" x2="100%" y2="0%">
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
          
          <rect width="400" height="280" fill="#2a1a0a"/>
          
          <!-- Landing track -->
          <rect x="20" y="80" width="150" height="40" fill="url(#dirt)" stroke="#8b6914" stroke-width="2" rx="5"/>
          <!-- Turn track -->
          <rect x="150" y="120" width="230" height="40" fill="url(#dirt)" stroke="#8b6914" stroke-width="2" rx="5"/>
          
          <!-- Bug Slide trajectory (sharp 90° turn) -->
          <path d="M 30 100 L 170 100 L 170 140 L 370 140" 
                fill="none" stroke="url(#trajectory)" stroke-width="4" 
                stroke-dasharray="450" stroke-dashoffset="450"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="450" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Direction arrows -->
          <polygon points="350,140 360,135 360,145" fill="#ff6600" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" 
                              values="0,0; 20,0; 0,0" dur="2s" repeatCount="indefinite"/>
          </polygon>
          
          <!-- Car -->
          <rect width="12" height="8" fill="#ff4444" rx="2">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#carPath"/>
            </animateMotion>
          </rect>
          <path id="carPath" d="M 30 100 L 170 100 L 170 140 L 370 140" fill="none"/>
          
          <!-- Surface badge -->
          <rect x="10" y="250" width="80" height="25" fill="#4a3a1a" rx="3"/>
          <text x="15" y="267" font-family="Arial" font-size="12" fill="#ffffff">🏖️ Dirt</text>
        </svg>
      `;
    }
    
    if (slug === 'double-drift') {
      // Double Drift: S-curve with two drift points
      return `
        <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="asphalt2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#2a2a2a"/>
              <stop offset="100%" style="stop-color:#1a1a1a"/>
            </linearGradient>
            <linearGradient id="trajectory" x1="0%" y1="0%" x2="100%" y2="0%">
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
          
          <rect width="400" height="280" fill="#1a1a1a"/>
          
          <!-- S-curve track -->
          <path d="M 20 140 Q 100 140 100 80 T 180 80 Q 260 80 260 140 T 380 140
                   L 380 180 Q 260 180 260 120 T 180 120 Q 100 120 100 180 T 20 180 Z" 
                fill="url(#asphalt2)" stroke="#ffffff" stroke-width="2"/>
          
          <!-- Double drift trajectory -->
          <path d="M 30 160 Q 90 160 90 100 Q 170 100 170 160 Q 250 160 250 100 Q 370 100 370 160" 
                fill="none" stroke="url(#trajectory)" stroke-width="4" 
                stroke-dasharray="500" stroke-dashoffset="500"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="500" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Direction arrows -->
          <polygon points="350,160 360,155 360,165" fill="#00ffcc" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" 
                              values="0,0; 20,0; 0,0" dur="2s" repeatCount="indefinite"/>
          </polygon>
          
          <!-- Car -->
          <rect width="12" height="8" fill="#ff4444" rx="2">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#carPath"/>
            </animateMotion>
          </rect>
          <path id="carPath" d="M 30 160 Q 90 160 90 100 Q 170 100 170 160 Q 250 160 250 100 Q 370 100 370 160" fill="none"/>
          
          <!-- Surface badge -->
          <rect x="10" y="250" width="80" height="25" fill="#2a4858" rx="3"/>
          <text x="15" y="267" font-family="Arial" font-size="12" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    if (slug === 'backwards-driving') {
      // Backwards Driving: Straight track with reverse arrows
      return `
        <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="asphalt3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#2a2a2a"/>
              <stop offset="100%" style="stop-color:#1a1a1a"/>
            </linearGradient>
            <linearGradient id="trajectory" x1="0%" y1="0%" x2="100%" y2="0%">
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
          
          <rect width="400" height="280" fill="#1a1a1a"/>
          
          <!-- Straight track -->
          <rect x="20" y="120" width="360" height="40" fill="url(#asphalt3)" stroke="#ffffff" stroke-width="2" rx="5"/>
          
          <!-- Backwards trajectory (right to left) -->
          <path d="M 370 140 L 30 140" 
                fill="none" stroke="url(#trajectory)" stroke-width="4" 
                stroke-dasharray="340" stroke-dashoffset="340"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="340" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Reverse direction arrows -->
          <polygon points="50,140 40,135 40,145" fill="#ffff00" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" 
                              values="0,0; -20,0; 0,0" dur="2s" repeatCount="indefinite"/>
          </polygon>
          
          <!-- Car going backwards -->
          <rect width="12" height="8" fill="#ff4444" rx="2">
            <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
              <mpath href="#carPath"/>
            </animateMotion>
          </rect>
          <path id="carPath" d="M 370 140 L 30 140" fill="none"/>
          
          <!-- Surface badge -->
          <rect x="10" y="250" width="80" height="25" fill="#2a4858" rx="3"/>
          <text x="15" y="267" font-family="Arial" font-size="12" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    if (slug === 'air-brake-roll') {
      // Air Brake Roll: Jump with landing
      return `
        <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="air" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#3a1a4a"/>
              <stop offset="100%" style="stop-color:#1a0a2a"/>
            </linearGradient>
            <linearGradient id="trajectory" x1="0%" y1="0%" x2="100%" y2="0%">
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
          
          <rect width="400" height="280" fill="#0a0a2a"/>
          
          <!-- Takeoff ramp -->
          <polygon points="20,180 120,180 120,140 20,140" fill="url(#air)" stroke="#ffffff" stroke-width="2"/>
          <!-- Landing ramp -->
          <polygon points="280,180 380,180 380,140 280,140" fill="url(#air)" stroke="#ffffff" stroke-width="2"/>
          
          <!-- Jump trajectory -->
          <path d="M 30 160 Q 200 60 370 160" 
                fill="none" stroke="url(#trajectory)" stroke-width="4" 
                stroke-dasharray="400" stroke-dashoffset="400"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="400" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Air brake effect (dotted line during jump) -->
          <path d="M 120 140 Q 200 60 280 140" 
                fill="none" stroke="#ffffff" stroke-width="2" 
                stroke-dasharray="5,5" opacity="0.5"/>
          
          <!-- Direction arrows -->
          <polygon points="350,160 360,155 360,165" fill="#00ccff" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" 
                              values="0,0; 20,0; 0,0" dur="2s" repeatCount="indefinite"/>
          </polygon>
          
          <!-- Car -->
          <rect width="12" height="8" fill="#ff4444" rx="2">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#carPath"/>
            </animateMotion>
          </rect>
          <path id="carPath" d="M 30 160 Q 200 60 370 160" fill="none"/>
          
          <!-- Surface badge -->
          <rect x="10" y="250" width="80" height="25" fill="#3a1a4a" rx="3"/>
          <text x="15" y="267" font-family="Arial" font-size="12" fill="#ffffff">✈️ Aria</text>
        </svg>
      `;
    }
    
    if (slug === 'wallride') {
      // Wallride: Vertical wall section
      return `
        <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="wall" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#4a4a4a"/>
              <stop offset="50%" style="stop-color:#6a6a6a"/>
              <stop offset="100%" style="stop-color:#4a4a4a"/>
            </linearGradient>
            <linearGradient id="trajectory" x1="0%" y1="0%" x2="100%" y2="0%">
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
          
          <rect width="400" height="280" fill="#2a2a2a"/>
          
          <!-- Ground track -->
          <rect x="20" y="180" width="100" height="40" fill="url(#asphalt)" stroke="#ffffff" stroke-width="2" rx="5"/>
          <rect x="280" y="180" width="100" height="40" fill="url(#asphalt)" stroke="#ffffff" stroke-width="2" rx="5"/>
          
          <!-- Wall -->
          <rect x="120" y="40" width="160" height="180" fill="url(#wall)" stroke="#ffffff" stroke-width="2"/>
          
          <!-- Wallride trajectory -->
          <path d="M 30 200 L 120 200 L 120 60 L 280 60 L 280 200 L 370 200" 
                fill="none" stroke="url(#trajectory)" stroke-width="4" 
                stroke-dasharray="450" stroke-dashoffset="450"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="450" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Direction arrows -->
          <polygon points="350,200 360,195 360,205" fill="#ff00ff" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" 
                              values="0,0; 20,0; 0,0" dur="2s" repeatCount="indefinite"/>
          </polygon>
          
          <!-- Car -->
          <rect width="12" height="8" fill="#ff4444" rx="2">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#carPath"/>
            </animateMotion>
          </rect>
          <path id="carPath" d="M 30 200 L 120 200 L 120 60 L 280 60 L 280 200 L 370 200" fill="none"/>
          
          <!-- Surface badge -->
          <rect x="10" y="250" width="80" height="25" fill="#4a4a4a" rx="3"/>
          <text x="15" y="267" font-family="Arial" font-size="12" fill="#ffffff">🧗 Pareti</text>
        </svg>
      `;
    }
    
    if (slug === 'scoot') {
      // Scoot: Transition with wiggle pattern
      return `
        <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="dirt2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#4a3a1a"/>
              <stop offset="100%" style="stop-color:#2a1a0a"/>
            </linearGradient>
            <linearGradient id="grass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#2d5a2d"/>
              <stop offset="100%" style="stop-color:#1a3a1a"/>
            </linearGradient>
            <linearGradient id="trajectory" x1="0%" y1="0%" x2="100%" y2="0%">
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
          
          <rect width="400" height="280" fill="#1a2a1a"/>
          
          <!-- Dirt section -->
          <rect x="20" y="120" width="180" height="40" fill="url(#dirt2)" stroke="#8b6914" stroke-width="2" rx="5"/>
          <!-- Grass section -->
          <rect x="200" y="120" width="180" height="40" fill="url(#grass)" stroke="#2d5a2d" stroke-width="2" rx="5"/>
          
          <!-- Scoot trajectory (wiggle at transition) -->
          <path d="M 30 140 L 180 140 L 185 130 L 195 150 L 205 130 L 215 150 L 220 140 L 370 140" 
                fill="none" stroke="url(#trajectory)" stroke-width="4" 
                stroke-dasharray="400" stroke-dashoffset="400"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="400" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Direction arrows -->
          <polygon points="350,140 360,135 360,145" fill="#00ff00" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" 
                              values="0,0; 20,0; 0,0" dur="2s" repeatCount="indefinite"/>
          </polygon>
          
          <!-- Car -->
          <rect width="12" height="8" fill="#ff4444" rx="2">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#carPath"/>
            </animateMotion>
          </rect>
          <path id="carPath" d="M 30 140 L 180 140 L 185 130 L 195 150 L 205 130 L 215 150 L 220 140 L 370 140" fill="none"/>
          
          <!-- Surface badge -->
          <rect x="10" y="250" width="100" height="25" fill="#2a4a2a" rx="3"/>
          <text x="15" y="267" font-family="Arial" font-size="12" fill="#ffffff">🌱 Transizioni</text>
        </svg>
      `;
    }
    
    if (slug === 'superdive') {
      // Superdive: Steep descent
      return `
        <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="descent" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#4a4a2a"/>
              <stop offset="100%" style="stop-color:#2a2a1a"/>
            </linearGradient>
            <linearGradient id="trajectory" x1="0%" y1="0%" x2="100%" y2="0%">
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
          
          <rect width="400" height="280" fill="#2a2a1a"/>
          
          <!-- Descent track (diagonal) -->
          <path d="M 20 80 L 380 220 L 380 260 L 20 120 Z" 
                fill="url(#descent)" stroke="#ffffff" stroke-width="2"/>
          
          <!-- Superdive trajectory (steep diagonal) -->
          <path d="M 30 100 L 370 240" 
                fill="none" stroke="url(#trajectory)" stroke-width="4" 
                stroke-dasharray="400" stroke-dashoffset="400"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="400" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Speed boost effect -->
          <circle cx="200" cy="170" r="15" fill="none" stroke="#ff6600" stroke-width="2" opacity="0.5">
            <animate attributeName="r" values="15;25;15" dur="1s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1s" repeatCount="indefinite"/>
          </circle>
          
          <!-- Direction arrows -->
          <polygon points="350,240 360,235 360,245" fill="#ff6600" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" 
                              values="0,0; 20,0; 0,0" dur="2s" repeatCount="indefinite"/>
          </polygon>
          
          <!-- Car -->
          <rect width="12" height="8" fill="#ff4444" rx="2">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#carPath"/>
            </animateMotion>
          </rect>
          <path id="carPath" d="M 30 100 L 370 240" fill="none"/>
          
          <!-- Surface badge -->
          <rect x="10" y="250" width="80" height="25" fill="#4a4a2a" rx="3"/>
          <text x="15" y="267" font-family="Arial" font-size="12" fill="#ffffff">📉 Discese</text>
        </svg>
      `;
    }
    
    if (slug === 'ice-drift') {
      // Ice Drift: Ice track with wide drift
      return `
        <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="ice" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#a8d8ea"/>
              <stop offset="100%" style="stop-color:#0d1f2d"/>
            </linearGradient>
            <linearGradient id="trajectory" x1="0%" y1="0%" x2="100%" y2="0%">
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
          
          <rect width="400" height="280" fill="#0d1f2d"/>
          
          <!-- Ice track (very wide curve) -->
          <path d="M 20 140 Q 200 140 380 60 L 380 120 Q 200 200 20 200 Z" 
                fill="url(#ice)" stroke="#a8d8ea" stroke-width="2"/>
          
          <!-- Ice reflections -->
          <ellipse cx="100" cy="170" rx="30" ry="5" fill="#ffffff" opacity="0.2"/>
          <ellipse cx="300" cy="90" rx="25" ry="4" fill="#ffffff" opacity="0.2"/>
          
          <!-- Ice drift trajectory (very wide) -->
          <path d="M 30 180 Q 200 180 370 80" 
                fill="none" stroke="url(#trajectory)" stroke-width="4" 
                stroke-dasharray="400" stroke-dashoffset="400"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="400" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Direction arrows -->
          <polygon points="350,80 360,75 360,85" fill="#00ccff" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" 
                              values="0,0; 20,0; 0,0" dur="2s" repeatCount="indefinite"/>
          </polygon>
          
          <!-- Car -->
          <rect width="12" height="8" fill="#ff4444" rx="2">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#carPath"/>
            </animateMotion>
          </rect>
          <path id="carPath" d="M 30 180 Q 200 180 370 80" fill="none"/>
          
          <!-- Surface badge -->
          <rect x="10" y="250" width="80" height="25" fill="#1a3a52" rx="3"/>
          <text x="15" y="267" font-family="Arial" font-size="12" fill="#ffffff">🧊 Ghiaccio</text>
        </svg>
      `;
    }
    
    if (slug === 'road-drift') {
      // Road Drift: Basic curve on asphalt
      return `
        <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="asphalt4" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#2a2a2a"/>
              <stop offset="100%" style="stop-color:#1a1a1a"/>
            </linearGradient>
            <linearGradient id="trajectory" x1="0%" y1="0%" x2="100%" y2="0%">
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
          
          <rect width="400" height="280" fill="#1a1a1a"/>
          
          <!-- Basic curve track -->
          <path d="M 20 140 Q 200 140 200 80 T 380 80
                   L 380 120 Q 200 120 200 180 T 20 180 Z" 
                fill="url(#asphalt4)" stroke="#ffffff" stroke-width="2"/>
          
          <!-- Road drift trajectory -->
          <path d="M 30 160 Q 150 160 150 100 Q 250 100 370 100" 
                fill="none" stroke="url(#trajectory)" stroke-width="4" 
                stroke-dasharray="350" stroke-dashoffset="350"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="350" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Direction arrows -->
          <polygon points="350,100 360,95 360,105" fill="#00ff00" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" 
                              values="0,0; 20,0; 0,0" dur="2s" repeatCount="indefinite"/>
          </polygon>
          
          <!-- Car -->
          <rect width="12" height="8" fill="#ff4444" rx="2">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#carPath"/>
            </animateMotion>
          </rect>
          <path id="carPath" d="M 30 160 Q 150 160 150 100 Q 250 100 370 100" fill="none"/>
          
          <!-- Surface badge -->
          <rect x="10" y="250" width="80" height="25" fill="#2a4858" rx="3"/>
          <text x="15" y="267" font-family="Arial" font-size="12" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    if (slug === 'gear-management') {
      // Gear Management: Straight track with speed indicators
      return `
        <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
          <defs>
            <linearGradient id="asphalt5" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#2a2a2a"/>
              <stop offset="100%" style="stop-color:#1a1a1a"/>
            </linearGradient>
            <linearGradient id="trajectory" x1="0%" y1="0%" x2="100%" y2="0%">
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
          
          <rect width="400" height="280" fill="#1a1a1a"/>
          
          <!-- Straight track -->
          <rect x="20" y="120" width="360" height="40" fill="url(#asphalt5)" stroke="#ffffff" stroke-width="2" rx="5"/>
          
          <!-- Gear shift indicators -->
          <circle cx="100" cy="140" r="8" fill="none" stroke="#ff00ff" stroke-width="2" opacity="0.6"/>
          <circle cx="200" cy="140" r="8" fill="none" stroke="#ff00ff" stroke-width="2" opacity="0.6"/>
          <circle cx="300" cy="140" r="8" fill="none" stroke="#ff00ff" stroke-width="2" opacity="0.6"/>
          
          <!-- Gear management trajectory -->
          <path d="M 30 140 L 370 140" 
                fill="none" stroke="url(#trajectory)" stroke-width="4" 
                stroke-dasharray="340" stroke-dashoffset="340"
                filter="url(#glow)">
            <animate attributeName="stroke-dashoffset" from="340" to="0" dur="1.5s" fill="freeze"/>
          </path>
          
          <!-- Direction arrows -->
          <polygon points="350,140 360,135 360,145" fill="#ff00ff" opacity="0.8">
            <animateTransform attributeName="transform" type="translate" 
                              values="0,0; 20,0; 0,0" dur="2s" repeatCount="indefinite"/>
          </polygon>
          
          <!-- Car -->
          <rect width="12" height="8" fill="#ff4444" rx="2">
            <animateMotion dur="3s" repeatCount="indefinite">
              <mpath href="#carPath"/>
            </animateMotion>
          </rect>
          <path id="carPath" d="M 30 140 L 370 140" fill="none"/>
          
          <!-- Surface badge -->
          <rect x="10" y="250" width="80" height="25" fill="#2a4858" rx="3"/>
          <text x="15" y="267" font-family="Arial" font-size="12" fill="#ffffff">🏁 Asfalto</text>
        </svg>
      `;
    }
    
    // Default SVG
    return `
      <svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: auto;">
        <defs>
          <linearGradient id="default" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#2a2a2a"/>
            <stop offset="100%" style="stop-color:#1a1a1a"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="400" height="280" fill="#1a1a1a"/>
        <rect x="20" y="120" width="360" height="40" fill="url(#default)" stroke="#ffffff" stroke-width="2" rx="5"/>
        
        <path d="M 30 140 L 370 140" 
              fill="none" stroke="#00ff88" stroke-width="4" 
              stroke-dasharray="340" stroke-dashoffset="340"
              filter="url(#glow)">
          <animate attributeName="stroke-dashoffset" from="340" to="0" dur="1.5s" fill="freeze"/>
        </path>
        
        <polygon points="350,140 360,135 360,145" fill="#00ff88" opacity="0.8"/>
        
        <rect width="12" height="8" fill="#ff4444" rx="2">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#defaultCarPath"/>
          </animateMotion>
        </rect>
        <path id="defaultCarPath" d="M 30 140 L 370 140" fill="none"/>
        
        <rect x="10" y="250" width="80" height="25" fill="#2a2a2a" rx="3"/>
        <text x="15" y="267" font-family="Arial" font-size="12" fill="#ffffff">🏁 Pista</text>
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
        border: '2px solid rgba(255,255,255,0.1)',
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
