export const techniques = [
  {
    id: "speed-slide",
    name: "Speed Slide",
    slug: "speed-slide",
    emoji: "🏎️",
    minSpeed: "400+ km/h",
    surface: "Asfalto / Dirt",
    difficulty: "Intermedio",
    youtubeId: "w5eHQNp3hZc",
    startTime: 430,
    imageUrl: "https://sm.ign.com/t/ign_me/gallery/8/8-trackman/8-trackmania-gameplay-screenshots_qvfp.1400.jpg",
    description: `Lo Speed Slide è la tecnica fondamentale per mantenere velocità nelle curve ampie. Quando superi i 400 km/h, sterzare troppo forte causa una perdita di accelerazione.
    
Invece di sterzare normalmente, devi iniziare una leggera derapata (drift) ma mantenerla molto sottile. Se vedi i segni delle gomme sovrapporsi, stai effettuando correttamente lo Speed Slide e guadagnerai velocità rispetto a chi sterza normalmente. È essenziale per le mappe Full Speed.`,
    controls: {
      pc: "W + breve tocco S + A/D",
      xbox: "RT tieni + tocco LT + Stick Sinistro",
      ps: "R2 tieni + tocco L2 + Stick Sinistro",
    },
    quiz: [
      {
        q: "Qual è la velocità minima approssimativa per uno Speed Slide su asfalto?",
        options: ["200 km/h", "300 km/h", "400 km/h", "600 km/h"],
        answer: 2,
      },
      {
        q: "Cosa succede se sterzi troppo senza effettuare lo Speed Slide?",
        options: ["Guadagni velocità", "L'auto si ribalta", "Perdi accelerazione", "Si attiva il turbo"],
        answer: 2,
      }
    ]
  },
  {
    id: "bug-slide",
    name: "Bug Slide",
    slug: "bug-slide",
    emoji: "🐛",
    minSpeed: "Dopo l'atterraggio",
    surface: "Qualsiasi",
    difficulty: "Avanzato",
    youtubeId: "w5eHQNp3hZc",
    startTime: 627,
    imageUrl: "https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_fgmr.1400.jpg",
    description: `Il Bug Slide è una tecnica situazionale incredibile che ti permette di cambiare direzione quasi istantaneamente dopo un atterraggio o su superfici irregolari.
    
Per eseguirlo, devi atterrare con l'auto leggermente inclinata e frenare mentre sterzi. Il gioco "bugga" la trazione, permettendo all'auto di scivolare lateralmente mantenendo quasi tutto il momento lineare. È fondamentale per recuperare da errori o per traiettorie ultra-aggressive.`,
    controls: {
      pc: "W + S simultaneamente all'atterraggio + A/D",
      xbox: "R2 + L2 simultaneamente all'atterraggio + Stick",
      ps: "R2 + L2 simultaneamente all'atterraggio + Stick",
    },
    quiz: [
      {
        q: "Quando deve essere eseguito l'input per il Bug Slide?",
        options: ["Prima del salto", "Al picco del salto", "All'istante dell'impatto", "Dopo essersi fermati"],
        answer: 2,
      }
    ]
  },
  {
    id: "double-drift",
    name: "Double Drift",
    slug: "double-drift",
    emoji: "🔁",
    minSpeed: "200+ km/h",
    surface: "Asfalto",
    difficulty: "Intermedio",
    youtubeId: "1tkVQ2uL7Iw",
    startTime: 810,
    imageUrl: "https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_vnfg.1400.jpg",
    description: `Il Double Drift è una tecnica usata su asfalto per affrontare curve strette a S o per riposizionare l'auto durante una derapata prolungata.
    
Consiste nell'iniziare un drift, rilasciare brevemente lo sterzo e ricominciare a sterzare nella stessa direzione o in quella opposta senza mai staccare il gas. Questo permette di mantenere l'angolo di derapata ottimale senza che l'auto riprenda grip improvvisamente.`,
    controls: {
      pc: "Mantenere W + Sterzare + Frenare (S), poi rilasciare e riprendere Sterzo",
      xbox: "Mantenere RT + Sterzare + LT, poi rilasciare e riprendere Sterzo",
      ps: "Mantenere R2 + Sterzare + L2, poi rilasciare e riprendere Sterzo",
    },
    quiz: [
      {
        q: "Qual è il vantaggio principale del Double Drift?",
        options: ["Raffredda le gomme", "Mantiene l'angolo di derapata senza riprendere grip", "Aumenta la velocità massima", "Permette di saltare più in alto"],
        answer: 1,
      }
    ]
  },
  {
    id: "backwards-driving",
    name: "Guida in Retromarcia",
    slug: "backwards-driving",
    emoji: "🔙",
    minSpeed: "Qualsiasi",
    surface: "Qualsiasi",
    difficulty: "Intermedio",
    youtubeId: "w5eHQNp3hZc",
    startTime: 492,
    imageUrl: "https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_4nxa.1400.jpg",
    description: `In TrackMania 2020, alcune mappe sono progettate per essere percorse in retromarcia per mantenere il momento.
    
La fisica cambia: lo sterzo è invertito e l'accelerazione è più lenta, ma imparare a controllare l'auto a 300+ km/h all'indietro ti permette di non hittare il respawn in situazioni critiche.`,
    controls: {
      pc: "Tieni S per accelerare all'indietro, W per frenare",
      xbox: "Tieni LT per accelerare all'indietro, RT per frenare",
      ps: "Tieni L2 per accelerare all'indietro, R2 per frenare",
    },
    quiz: [
      {
        q: "Cosa succede allo sterzo durante la guida in retromarcia?",
        options: ["Resta uguale", "Viene invertito", "Si blocca", "Diventa più sensibile"],
        answer: 1,
      }
    ]
  },
  {
    id: "air-brake-roll",
    name: "Air Brake Roll",
    slug: "air-brake-roll",
    emoji: "✈️",
    minSpeed: "N/A",
    surface: "Aria",
    difficulty: "Avanzato",
    youtubeId: "w5eHQNp3hZc",
    startTime: 69,
    imageUrl: "https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_fgmr.1400.jpg",
    description: `L'Air Brake Roll serve a controllare l'orientamento dell'auto durante i salti lunghi. Premendo il freno in aria, blocchi la rotazione dell'auto sull'asse del beccheggio.
    
Questo è vitale per atterrare perfettamente piatti su tutte e quattro le ruote. Se atterri inclinato, l'auto rimbalzerà o perderà accelerazione.`,
    controls: {
      pc: "Premi brevemente S (Freno) mentre sei in volo",
      xbox: "Premi brevemente LT (Freno) mentre sei in volo",
      ps: "Premi brevemente L2 (Freno) mentre sei in volo",
    },
    quiz: [
      {
        q: "Perché è importante l'Air Brake?",
        options: ["Per andare più veloci in aria", "Per atterrare piatti e non perdere velocità", "Per fare punti acrobazia", "Per curvare meglio"],
        answer: 1,
      }
    ]
  },
  {
    id: "wallride",
    name: "Wallride",
    slug: "wallride",
    emoji: "🧗",
    minSpeed: "250+ km/h",
    surface: "Pareti",
    difficulty: "Intermedio",
    youtubeId: "w5eHQNp3hZc",
    startTime: 223,
    imageUrl: "https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_v9a5.1400.jpg",
    description: `Il Wallride ti permette di guidare su pareti verticali o molto inclinate. La chiave è la forza centrifuga: devi avere abbastanza velocità per 'incollarti' alla parete.
    
Entra nella parete con un angolo dolce, non colpirla frontalmente. Una volta su, cerca di mantenere una traiettoria dritta.`,
    controls: {
      pc: "Mantieni velocità elevata + Sterza leggermente verso la parete",
      xbox: "Mantieni velocità elevata + Sterza (L) verso la parete",
      ps: "Mantieni velocità elevata + Sterza (L) verso la parete",
    },
    quiz: [
      {
        q: "Cosa ti tiene incollato alla parete durante un Wallride?",
        options: ["La colla sulle gomme", "La forza centrifuga", "I magneti della pista", "Il vento"],
        answer: 1,
      }
    ]
  },
  {
    id: "scoot",
    name: "Scoot",
    slug: "scoot",
    emoji: "🛴",
    minSpeed: "150+ km/h",
    surface: "Transizioni",
    difficulty: "Esperto",
    youtubeId: "w5eHQNp3hZc",
    startTime: 541,
    imageUrl: "https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_v9a5.1400.jpg",
    description: `Lo Scoot (o Wiggle) è una tecnica avanzata per guadagnare accelerazione extra durante le transizioni di superficie.
    
Sterzando rapidamente a destra e sinistra proprio nel momento della transizione, forzi il motore fisico a darti una piccola spinta aggiuntiva. Richiede un timing al millesimo di secondo.`,
    controls: {
      pc: "Sterzata rapida Sinistra-Destra (flick) sulla transizione",
      xbox: "Flick rapido dello stick analogico sulla transizione",
      ps: "Flick rapido dello stick analogico sulla transizione",
    },
    quiz: [
      {
        q: "In quale momento va eseguito lo Scoot?",
        options: ["In pieno rettilineo", "Esattamente sulla transizione di superficie", "Durante un salto", "Prima di frenare"],
        answer: 1,
      }
    ]
  },
  {
    id: "superdive",
    name: "Superdive",
    slug: "superdive",
    emoji: "🌊",
    minSpeed: "300+ km/h",
    surface: "Discese",
    difficulty: "Avanzato",
    youtubeId: "w5eHQNp3hZc",
    startTime: 593,
    imageUrl: "https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_m8cb.1400.jpg",
    description: `Il Superdive è l'arte di massimizzare la velocità mentre si scende da una pendenza ripida. Inclinando l'auto verso il basso proprio mentre inizi la discesa, riduci il tempo in aria.
    
Ottieni una spinta gravitazionale immediata puntando il muso dell'auto verso il basso prima che le ruote perdano contatto con il terreno.`,
    controls: {
      pc: "Accelera (W) + Direziona il muso verso il basso sulla cresta",
      xbox: "RT + Direziona il muso con stick analogico",
      ps: "R2 + Direziona il muso con stick analogico",
    },
    quiz: [
      {
        q: "Qual è lo scopo del Superdive?",
        options: ["Andare sott'acqua", "Riferma l'auto", "Massimizzare la velocità gravitazionale in discesa", "Evitare le marce"],
        answer: 2,
      }
    ]
  },
  {
    id: "ice-drift",
    name: "Ice Drift",
    slug: "ice-drift",
    emoji: "🧊",
    minSpeed: "200+ km/h",
    surface: "Ghiaccio",
    difficulty: "Esperto",
    youtubeId: "w5eHQNp3hZc",
    startTime: 294,
    imageUrl: "https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_m8cb.1400.jpg",
    description: `L'Ice Drift richiede di sterzare nella direzione opposta a quella voluta per iniziare la scivolata, e poi controsterzare per mantenerla.
    
A differenza dell'asfalto, il controllo avviene quasi interamente tramite l'angolo di sterzata e piccoli rilasci dell'acceleratore.`,
    controls: {
      pc: "Sterza opposto (A/D) poi ruota verso la curva + colpetti di W",
      xbox: "Stick analogico (L) con rotazioni fluide + controllo RT",
      ps: "Stick analogico (L) con rotazioni fluide + controllo R2",
    },
    quiz: [
      {
        q: "Come si inizia un Ice Drift?",
        options: ["Frenando forte", "Sterzando nella direzione opposta alla curva", "Andando piano", "Usando il freno a mano"],
        answer: 1,
      }
    ]
  },
  {
    id: "road-drift",
    name: "Road Drift",
    slug: "road-drift",
    emoji: "🛣️",
    minSpeed: "180-350 km/h",
    surface: "Asfalto",
    difficulty: "Principiante",
    youtubeId: "w5eHQNp3hZc",
    startTime: 129,
    imageUrl: "https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_5kmg.1400.jpg",
    description: `Il Road Drift è la prima tecnica che ogni pilota impara. È essenziale per affrontare curve medie e strette su asfalto senza perdere troppa velocità.
    
Per iniziarlo, devi sterzare per circa mezzo secondo e poi premere il freno mantenendo l'acceleratore premuto.`,
    controls: {
      pc: "Tieni W + Sterza + Premi S (Freno) dopo 0.5s",
      xbox: "Tieni RT + Sterza + Premi LT (Freno) dopo 0.5s",
      ps: "Tieni R2 + Sterza + Premi L2 (Freno) dopo 0.5s",
    },
    quiz: [
      {
        q: "Quando va premuto il freno per iniziare un Road Drift?",
        options: ["Prima di sterzare", "Circa 0.5 secondi dopo aver iniziato a sterzare", "Sempre", "Mai"],
        answer: 1,
      }
    ]
  },
  {
    id: "gear-management",
    name: "Gestione Marce",
    slug: "gear-management",
    emoji: "⚙️",
    minSpeed: "Qualsiasi",
    surface: "Qualsiasi",
    difficulty: "Avanzato",
    youtubeId: "1tkVQ2uL7Iw",
    startTime: 1090,
    imageUrl: "https://sm.ign.com/t/ign_me/screenshot/s/screenshot/screenshot-of-trackmania-2020_da5k.1400.jpg",
    description: `In TrackMania 2020 le marce sono automatiche, ma puoi influenzarle evitando slittamenti durante il cambio.
    
Imparare a tenere l'auto dritta o rilasciare leggermente sterzo/gas durante il cambio marcia assicura che il 100% della potenza sia trasferito al suolo.`,
    controls: {
      pc: "Rilascia brevemente lo sterzo durante il suono del cambio marcia",
      xbox: "Rilascia brevemente lo sterzo durante il suono del cambio marcia",
      ps: "Rilascia brevemente lo sterzo durante il suono del cambio marcia",
    },
    quiz: [
      {
        q: "Cosa può causare un 'gear loss'?",
        options: ["Sterzare troppo bruscamente durante il cambio", "Andare troppo veloci", "Usare la skin sbagliata", "Saltare troppo"],
        answer: 0,
      }
    ]
  },
];

export const getTechniqueBySlug = (slug) => techniques.find((t) => t.slug === slug);
