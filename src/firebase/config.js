import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Default 20 mythic cards to seed the application
export const INITIAL_CARDS = [
  {
    id: 'dev_crisi',
    name: '💻 Il Dev in Crisi',
    rarity: 'comune',
    points: 10,
    description: 'Un programmatore disperato davanti a uno schermo rosso d\'errore, che riflette sull\'opportunità di cambiare mestiere e darsi alla pastorizia.',
    challenge: '📸 Fotografa un developer con le mani nei capelli o la faccia sul tavolo davanti a un monitor acceso.',
    imageUrl: 'images/dev_crisi.png'
  },
  {
    id: 'pm_ottimista',
    name: '📅 Il PM Ottimista',
    rarity: 'comune',
    points: 15,
    description: 'Famoso per la celebre frase: "Sì, tranquilli, è una modifica da 5 minuti!". Vaga per i corridoi spostando ticket senza cognizione di causa.',
    challenge: '📸 Fotografa una timeline irrealistica scritta su una lavagna o in una chat aziendale.',
    imageUrl: 'images/pm_ottimista.png'
  },
  {
    id: 'macchina_caffe',
    name: '☕ La Coda al Caffè',
    rarity: 'comune',
    points: 10,
    description: 'Il vero centro di controllo decisionale dell\'azienda. Qui si decidono promozioni, si criticano architetture software e si formano alleanze geopolitiche.',
    challenge: '📸 Fotografa un assembramento di almeno 4 persone in fila all\'erogatore di caffè.',
    imageUrl: 'images/macchina_caffe.png'
  },
  {
    id: 'designer_pixel',
    name: '🎨 Il Designer Pixel-Perfect',
    rarity: 'noncomune',
    points: 25,
    description: 'Dotato di vista microscopica. Riesce a scovare un disallineamento di 0.5px da tre stanze di distanza e odia l\'uso improprio del Comic Sans.',
    challenge: '📸 Fotografa uno schermo di Figma zoomato oltre il 1000% per allineare un bordo o un\'icona.',
    imageUrl: 'images/designer_pixel.png'
  },
  {
    id: 'account_gesti',
    name: '📢 L\'Account Gesticolante',
    rarity: 'noncomune',
    points: 30,
    description: 'In grado di vendere portali e-commerce interamente basati su AI quantistica con consegna "entro ieri". Parla gesticolando selvaggiamente.',
    challenge: '📸 Fotografa un Account al telefono mentre gesticola vistosamente con l\'altra mano libera.',
    imageUrl: 'images/account_gesti.png'
  },
  {
    id: 'riunione_mail',
    name: '🥱 La Riunione Inutile',
    rarity: 'noncomune',
    points: 20,
    description: 'Un rituale mistico in cui 12 persone ascoltano una sola persona parlare di argomenti che potevano essere riassunti in una mail di tre righe.',
    challenge: '📸 Fotografa una sala riunioni piena in cui almeno 3 colleghi hanno lo sguardo spento o fissano il laptop annoiati.',
    imageUrl: 'images/riunione_mail.png'
  },
  {
    id: 'devops_silent',
    name: '🎛️ Il DevOps Silenzioso',
    rarity: 'rara',
    points: 50,
    description: 'Vive nell\'ombra. Se lo vedi correre, scappa anche tu perché i server stanno bruciando. Comunica solo con risposte HTTP tipo 418 I\'m a teapot.',
    challenge: '📸 Fotografa una postazione di lavoro con almeno 3 schermi neri pieni di terminali aperti.',
    imageUrl: 'images/devops_silent.png'
  },
  {
    id: 'cto_evangelist',
    name: '🧠 Il CTO Evangelist',
    rarity: 'rara',
    points: 60,
    description: 'Parla costantemente di Kubernetes, Web3, Cloud-Native e AI Generativa. Nessuno capisce del tutto il suo disegno alla lavagna, ma tutti annuiscono spaventati.',
    challenge: '📸 Fotografa il CTO mentre disegna schemi architetturali complessi su una lavagna fisica o digitale.',
    imageUrl: 'images/cto_evangelist.png'
  },
  {
    id: 'qa_distruttore',
    name: '🔨 Il QA Tester Distruttore',
    rarity: 'rara',
    points: 55,
    description: 'Il suo unico scopo è rompere le cose. Digita "-1", caratteri cinesi, emoticons e click simultanei per crashare l\'interfaccia.',
    challenge: '📸 Fotografa uno schermo di test sommerso da notifiche di errore, crash log o input estremi.',
    imageUrl: 'images/qa_distruttore.png'
  },
  {
    id: 'ceo_boss',
    name: '👑 Il Boss Supremo',
    rarity: 'ultrarara',
    points: 100,
    description: 'La leggenda narra che sia in grado di approvare aumenti di stipendio con un solo battito di ciglia. Trovarlo di buon umore sblocca bonus passivi a tutti.',
    challenge: '📸 Fotografa il CEO sorridente in corridoio o durante un momento informale di brindisi aziendale.',
    imageUrl: 'images/ceo_boss.png'
  },
  {
    id: 'marketing_bullshit',
    name: '📢 Il Bullshitter del Marketing',
    rarity: 'noncomune',
    points: 25,
    description: 'Capace di vendere fumo liquido. Parla solo tramite termini come "funnel", "brand awareness", "KPI value" e "engagement disruption" senza conoscerne il significato.',
    challenge: '📸 Fotografa una slide o mail aziendale contenente almeno 5 inglesismi di marketing consecutivi.',
    imageUrl: 'images/marketing_bullshit.png'
  },
  {
    id: 'snack_devourer',
    name: '🍪 Il Divoratore di Snack',
    rarity: 'comune',
    points: 10,
    description: 'Sopravvive esclusivamente grazie a merendine industriali e bibite zuccherate. Le briciole depositate sotto la sua tastiera potrebbero sfamare una piccola nazione.',
    challenge: '📸 Fotografa la scrivania di un collega sommersa da almeno 3 involucri vuoti di snack o lattine.',
    imageUrl: 'images/snack_devourer.png'
  },
  {
    id: 'smart_working_illusion',
    name: '🦥 L\'Illusionista dello Smart Working',
    rarity: 'rara',
    points: 50,
    description: 'Ufficialmente operativo da casa, in realtà la leggenda narra che imposti movimenti automatici sul mouse per rimanere sempre verde "Attivo" su Teams mentre dorme.',
    challenge: '📸 Fotografa lo stato Teams/Slack di un collega verde "Disponibile" che non risponde a 3 messaggi diretti da oltre un\'ora.',
    imageUrl: 'images/smart_working_illusion.png'
  },
  {
    id: 'intern_exploited',
    name: '🎒 Lo Stagista Eroe',
    rarity: 'comune',
    points: 10,
    description: 'Carico di speranze, sogni e qualifiche accademiche. Ignora ancora che il suo compito principale per i prossimi 6 mesi sarà formattare infinite tabelle Excel.',
    challenge: '📸 Fotografa un tirocinante/stagista che trasporta un carico sproporzionato di caffè o faldoni cartacei.',
    imageUrl: 'images/intern_exploited.png'
  },
  {
    id: 'screenshot_thief',
    name: '📱 L\'Uomo PrintScreen',
    rarity: 'noncomune',
    points: 20,
    description: 'Invece di inviare stringhe di testo o log condivisibili, preferisce mandare screenshot sfocati scattando una foto al monitor col suo cellulare.',
    challenge: '📸 Cattura uno screenshot in chat in cui un collega ti ha risposto inviando la foto del proprio monitor fatta con lo smartphone.',
    imageUrl: 'images/screenshot_thief.png'
  },
  {
    id: 'excel_guru',
    name: '📊 Il Mago delle Pivot',
    rarity: 'noncomune',
    points: 30,
    description: 'Gestisce database da milioni di righe interamente su fogli Excel che crasciano a ogni click. Considera i database SQL moderni un lusso tecnologico inutile.',
    challenge: '📸 Fotografa uno schermo con un foglio Excel contenente formule gigantesche o formattazioni condizionali pastello inguardabili.',
    imageUrl: 'images/excel_guru.png'
  },
  {
    id: 'office_phantom',
    name: '👻 Il Fantasma dell\'Ufficio',
    rarity: 'rara',
    points: 45,
    description: 'Timbra il cartellino, lascia la giacca sulla sedia per fingere presenza attiva, ma scompare misteriosamente nei corridoi per ore intere.',
    challenge: '📸 Fotografa una scrivania vuota con giacca appesa, PC acceso e tazza calda, ma nessun dipendente visibile per più di 30 minuti.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'vacation_mode',
    name: '🏖️ Modalità Ferie Attiva',
    rarity: 'comune',
    points: 15,
    description: 'Mancano ancora settimane alle sue vacanze, ma la sua mente è già su una spiaggia tropicale. Risponde a qualsiasi mail con "Ok, ne parliamo al mio rientro".',
    challenge: '📸 Fotografa lo schermo di un collega fermo su siti di ricerca voli low-cost o offerte vacanze durante l\'orario lavorativo.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'ancient_hardware',
    name: '⚙️ Il Portatile Aeronautico',
    rarity: 'noncomune',
    points: 25,
    description: 'Un laptop aziendale obsoleto che emette un rumore simile a un caccia militare non appena si avviano tre schede di Chrome. Riscalda gli uffici in inverno.',
    challenge: '📸 Fotografa un computer aziendale con prese polverose e ventole rumorose bloccato in caricamento infinito.',
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'hr_deity',
    name: '🧘‍♀️ La Divinità degli HR',
    rarity: 'ultrarara',
    points: 95,
    description: 'Una creatura mistica che si manifesta solo per promuovere sondaggi sulla felicità aziendale, corsi di mindfulness obbligatori e borracce termiche logate.',
    challenge: '📸 Fotografa un gadget aziendale brandizzato Fanta Adiacent (tazza, agenda, borraccia) posizionato in un luogo surreale o insolito.',
    imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80'
  }
];

// Hardcoded production Firebase configuration keys (safe for public client bundling)
const firebaseConfig = {
  apiKey: "AIzaSyCmdCxGv7WAPlMc5WfGPbm2WELwyflajr4",
  authDomain: "fantaad-6f95f.firebaseapp.com",
  projectId: "fantaad-6f95f",
  storageBucket: "fantaad-6f95f.firebasestorage.app",
  messagingSenderId: "384139918794",
  appId: "1:384139918794:web:44a264a01d4fe6ad6be333"
};

// Check if variables are valid and set
const hasConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
  firebaseConfig.projectId;

let firebaseApp = null;
let auth = null;
let db = null;
let storage = null;
let isDemoMode = true;

if (hasConfig) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);
    isDemoMode = false;
    console.log('🚀 Firebase configurato con successo!');
  } catch (error) {
    console.error('⚠️ Errore inizializzazione Firebase, attivo la Demo Mode:', error);
    isDemoMode = true;
  }
} else {
  console.log('💡 Credenziali Firebase assenti o incomplete. Attiva la modalità DEMO locale.');
  isDemoMode = true;
}

export { auth, db, storage, isDemoMode };
