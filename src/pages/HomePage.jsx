import { Link } from 'react-router-dom';

const cards = [
  {
    title: 'Tecniche Avanzate',
    subtitle: '11 tecniche professionali, inclusa la gestione delle marce',
    img: 'https://sm.ign.com/t/ign_me/gallery/8/8-trackman/8-trackmania-gameplay-screenshots_qvfp.1400.jpg',
    to: '/tecniche',
  },
  {
    title: 'Controller Setup',
    subtitle: 'Ottimizza i tuoi input per PC e Console',
    img: 'https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_da5k.1400.jpg',
    to: '/controller',
  },
  {
    title: 'Mappe Training',
    subtitle: 'Mappe per allenare Speed Slide e Bug Slide',
    img: 'https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_vnfg.1400.jpg',
    to: '/maps',
  },
  {
    title: 'Profilo Pilota',
    subtitle: 'Monitora i tuoi progressi e punteggi quiz',
    img: 'https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_5kmg.1400.jpg',
    to: '/profile',
  },
];

export default function HomePage() {
  return (
    <div className="home-container-wrapper">
      <div className="hero-banner-new">
        <div className="hero-banner-overlay" />
        <div className="hero-banner-content">
          <div className="hero-badge">TRACKMANIA 2020 PRO</div>
          <h1>TrackMania <span>2020</span></h1>
          <p>
            La guida definitiva al gioco più veloce al mondo.
            Padroneggia le tecniche che separano i principianti dai campioni mondiali.
          </p>
          <div className="hero-divider" />
        </div>
      </div>

      <div className="page-wrapper">
        <div className="home-grid">
          {cards.map((card) => (
            <Link key={card.to} to={card.to} className="home-card">
              {card.img ? (
                <img src={card.img} alt={card.title} className="home-card-img" />
              ) : (
                <div className="home-card-profile-bg">
                  <span className="profile-card-icon">🏁</span>
                </div>
              )}
              <div className="home-card-fg">
                <h2>{card.title}</h2>
                <p>{card.subtitle}</p>
              </div>
              <div className="home-card-arrow">→</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
