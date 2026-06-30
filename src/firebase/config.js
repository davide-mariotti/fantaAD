import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Default 10 mythic cards to seed the application
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
  }
];

// Read environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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
