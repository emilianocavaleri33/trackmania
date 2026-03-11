import { useState } from 'react';

const platforms = ['PC', 'Xbox', 'PlayStation'];

const keybindings = {
  PC: [
    { action: 'Accelerare', key: 'W / ↑' },
    { action: 'Frenare / Retromarcia', key: 'S / ↓' },
    { action: 'Sterzo sinistra', key: 'A / ←' },
    { action: 'Sterzo destra', key: 'D / →' },
    { action: 'Freno a mano', key: 'Spazio' },
    { action: 'Rispawn', key: 'Backspace' },
    { action: 'Rispawn al CP', key: 'Enter' },
    { action: 'Camera posteriore', key: 'C' },
    { action: 'Screenshot', key: 'F12' },
    { action: 'Free camera', key: 'F5' },
    { action: 'Chat', key: 'T' },
    { action: 'Pausa', key: 'Esc' },
  ],
  Xbox: [
    { action: 'Accelerare', key: 'RT' },
    { action: 'Frenare', key: 'LT' },
    { action: 'Sterzo', key: 'Left Stick' },
    { action: 'Freno a mano', key: 'A' },
    { action: 'Rispawn', key: 'Y' },
    { action: 'Rispawn al CP', key: 'B' },
    { action: 'Camera', key: 'RB' },
    { action: 'Horn', key: 'LB' },
    { action: 'Speed meter', key: 'Right Stick' },
    { action: 'Pausa / Menu', key: 'Start' },
    { action: 'Mappa', key: 'Back' },
    { action: 'Zoom camera', key: 'RS Click' },
  ],
  PlayStation: [
    { action: 'Accelerare', key: 'R2' },
    { action: 'Frenare', key: 'L2' },
    { action: 'Sterzo', key: 'Left Stick' },
    { action: 'Freno a mano', key: '✕' },
    { action: 'Rispawn', key: '△' },
    { action: 'Rispawn al CP', key: '○' },
    { action: 'Camera', key: 'R1' },
    { action: 'Horn', key: 'L1' },
    { action: 'Speed meter', key: 'Right Stick' },
    { action: 'Pausa / Menu', key: 'Options' },
    { action: 'Mappa', key: 'Touchpad' },
    { action: 'Zoom camera', key: 'R3' },
  ],
};

const tipsByPlatform = {
  PC: 'Su PC, molti pro-player rimappano il freno su un tasto laterale (es. Shift) per un timing più preciso su tecniche come Bug Slide e Scoot.',
  Xbox: 'Con Xbox, i trigger analogici RT/LT permettono un controllo granulare ideale per Speed Slide e Air Brake Roll. Considera hair-trigger locks per Bug Slide.',
  PlayStation: 'Il DualSense ha trigger adattivi che possono fornire feedback tattile durante le derapate. L\'analog L2 è particolarmente preciso per tecniche avanzate.',
};

export default function ControllerPage() {
  const [active, setActive] = useState('PC');

  return (
    <div className="page-wrapper">
      <div className="section-header">
        <h1>Controller <span>Setup</span></h1>
        <p>Configurazioni ottimali per padroneggiare le tecniche avanzate</p>
        <div className="section-divider" />
      </div>

      <div className="controller-tabs">
        {platforms.map((p) => (
          <button
            key={p}
            className={`controller-tab ${active === p ? 'active' : ''}`}
            onClick={() => setActive(p)}
          >
            {p === 'PC' ? '💻' : p === 'Xbox' ? '🎮' : '🎮'} {p}
          </button>
        ))}
      </div>

      <div
        style={{
          background: 'rgba(255,102,0,0.08)',
          border: '1px solid rgba(255,102,0,0.3)',
          borderRadius: 10,
          padding: '1rem 1.2rem',
          marginBottom: '1.5rem',
          color: '#ffcc99',
          fontSize: '0.9rem',
          lineHeight: 1.6,
        }}
      >
        💡 <strong>Pro Tip ({active}):</strong> {tipsByPlatform[active]}
      </div>

      <div className="controller-layout">
        {keybindings[active].map((item) => (
          <div key={item.action} className="controller-key-item">
            <div className="key-action">{item.action}</div>
            <span className="key-binding">{item.key}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
