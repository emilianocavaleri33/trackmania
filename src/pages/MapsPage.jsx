const maps = [
  {
    name: 'Bug Slide Academy',
    code: 'KA7-N3B-SQ2',
    author: 'Wirtual',
    difficulty: 'Avanzato',
    focus: 'Bug Slide',
    desc: 'La mappa di training per Bug Slide più popolare della community. Include sezioni con jump progressivamente più difficili per affinare il timing di landing.',
    link: 'https://trackmania.io/',
  },
  {
    name: 'Speed Slide Workshop',
    code: 'XP2-QW8-TR5',
    author: 'Granady',
    difficulty: 'Intermedio',
    focus: 'Speed Slide',
    desc: 'Percorso dedicato allo Speed Slide con 15 curve progettate specificamente per praticare ogni variante della tecnica su diversi tipi di asfalto.',
    link: 'https://trackmania.io/',
  },
  {
    name: 'Ice Drift Fundamentals',
    code: 'IC3-DR1-FT9',
    author: 'Hefest',
    difficulty: 'Esperto',
    focus: 'Ice Drift',
    desc: 'Mappa ghiaccio pura con sezioni progrediveamente più veloci. Dal controllo base a 150 km/h fino a sezioni tecniche a 400+ km/h.',
    link: 'https://trackmania.io/',
  },
  {
    name: 'Double Drift Chicanes',
    code: 'DD2-CH7-FX1',
    author: 'Zooz',
    difficulty: 'Avanzato',
    focus: 'Double Drift',
    desc: '20 chicane uniche di difficoltà crescente. La mappa ufficiale per sviluppare il flick steering nei cambi di direzione rapidi.',
    link: 'https://trackmania.io/',
  },
  {
    name: 'Wallride Paradise',
    code: 'WR4-PA5-DZ3',
    author: 'MindFreak',
    difficulty: 'Intermedio',
    focus: 'Wallride',
    desc: 'Circuito studiato con pareti a diversi angoli e altezze. Include sezioni di wallride di 5+ secondi per costruire confidenza sulla superficie verticale.',
    link: 'https://trackmania.io/',
  },
  {
    name: 'Superdive Hills',
    code: 'SD6-HL2-MN8',
    author: 'Scrapie',
    difficulty: 'Avanzato',
    focus: 'Superdive',
    desc: 'Mappa collinare con 12 creste di diversa pendenza e velocità di approccio. Perfetta per padroneggiare il Superdive in condizioni variate.',
    link: 'https://trackmania.io/',
  },
  {
    name: 'Scoot Training Lab',
    code: 'SC9-TL4-BK6',
    author: 'Bren',
    difficulty: 'Esperto',
    focus: 'Scoot',
    desc: 'La superficie di training di riferimento con transizioni road/dirt/grass in sequenza. Contiene indicatori visivi per la zona di attivazione Scoot.',
    link: 'https://trackmania.io/',
  },
  {
    name: 'Air Brake Roll Jumps',
    code: 'AB3-RJ7-QP2',
    author: 'Rollin',
    difficulty: 'Avanzato',
    focus: 'Air Brake Roll',
    desc: 'Sequenza di 10 rampe a diversa angolazione e velocità di lancio. Ottimale per sviluppare il controllo del pitch in volo e le atterraggi perfetti.',
    link: 'https://trackmania.io/',
  },
  {
    name: 'Road Drift Basics',
    code: 'RD1-BX5-LM4',
    author: 'Papou',
    difficulty: 'Principiante',
    focus: 'Road Drift',
    desc: 'La mappa di ingresso ideale per chi inizia con il drifting. Curve ampie e ben segnalate con feedback visivo sui solchi di gomma.',
    link: 'https://trackmania.io/',
  },
  {
    name: 'Backwards Speedrun',
    code: 'BW8-SP3-RV1',
    author: 'TMForever',
    difficulty: 'Intermedio',
    focus: 'Backwards Driving',
    desc: 'Circuit classico riprogettato per la guida in retromarcia. Include sezioni in salita, discesa e gallerie per una pratica completa.',
    link: 'https://trackmania.io/',
  },
  {
    name: 'TM2020 Combo Challenge',
    code: 'CM5-TM2-PX9',
    author: 'Community',
    difficulty: 'Esperto',
    focus: 'Multi-tecnica',
    desc: 'La mappa definitiva che combina tutte le tecniche avanzate in un unico circuito. Gold medal richiede padronanza completa di almeno 7 tecniche.',
    link: 'https://trackmania.io/',
  },
  {
    name: 'Grass Scoot Paradise',
    code: 'GS7-SP4-KL2',
    author: 'Speedbreakerz',
    difficulty: 'Avanzato',
    focus: 'Scoot (Grass)',
    desc: 'Variante Scoot sulla transizione dirt-grass, più imprevedibile dell\'asfalto. Include zoom-in visivo delle zone di attivazione per apprendimento rapido.',
    link: 'https://trackmania.io/',
  },
];

const diffColor = {
  Principiante: '#00cc66',
  Intermedio: '#0099cc',
  Avanzato: '#FF6600',
  Esperto: '#cc0066',
};

export default function MapsPage() {
  return (
    <div className="page-wrapper">
      <div className="section-header">
        <h1>Mappe <span>Training</span></h1>
        <p>Mappe training della community con codici di accesso — cercale nel Track Exchange di TM2020</p>
        <div className="section-divider" />
      </div>

      <div className="maps-grid">
        {maps.map((map) => (
          <div key={map.code} className="map-card">
            <div className="map-card-header">
              <h3>{map.name}</h3>
              <div style={{ fontSize: '0.8rem', color: '#7fa0c0', marginTop: 4 }}>
                creata da {map.author}
              </div>
            </div>
            <div className="map-card-body">
              <div className="map-code-label">Codice Mappa</div>
              <div className="map-code">{map.code}</div>
              <div className="map-badges">
                <span
                  className="tc-badge badge-difficulty"
                  style={{ borderColor: diffColor[map.difficulty], color: diffColor[map.difficulty] }}
                >
                  {map.difficulty}
                </span>
                <span className="tc-badge badge-surface">{map.focus}</span>
              </div>
              <p className="map-desc">{map.desc}</p>
              <a
                href={map.link}
                target="_blank"
                rel="noopener noreferrer"
                className="map-link"
              >
                🔗 Apri su TrackMania.io
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
