import { Link } from 'react-router-dom';

const cards = [
  {
    title: 'Tecniche Avanzate',
    subtitle: '10 tecniche professionali spiegate in dettaglio',
    img: '/assets/hero-techniques.png',
    to: '/tecniche',
  },
  {
    title: 'Controller Setup',
    subtitle: 'Configurazioni ottimali per PC, Xbox e PlayStation',
    img: '/assets/hero-controller.png',
    to: '/controller',
  },
  {
    title: 'Training Maps',
    subtitle: 'Mappe comunità con codici di accesso diretto',
    img: '/assets/hero-maps.png',
    to: '/maps',
  },
  {
    title: 'Profilo',
    subtitle: 'Statistiche personali e progressi nei quiz',
    img: null,
    to: '/profile',
  },
];

export default function HomePage() {
  return (
    <div className="page-wrapper">
      <div className="home-hero">
        <h1>Pro Techniques Guide</h1>
        <p>Padroneggia le tecniche avanzate dei campioni mondiali di TrackMania 2020</p>
      </div>

      <div className="home-grid">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="home-card">
            {card.img ? (
              <img src={card.img} alt={card.title} className="home-card-img" />
            ) : (
              <div className="home-card-profile-bg">
                <span className="profile-card-icon">🏆</span>
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
  );
}
