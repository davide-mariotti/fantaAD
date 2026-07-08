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
    imageUrl: 'images/office_phantom.png'
  },
  {
    id: 'vacation_mode',
    name: '🏖️ Modalità Ferie Attiva',
    rarity: 'comune',
    points: 15,
    description: 'Mancano ancora settimane alle sue vacanze, ma la sua mente è già su una spiaggia tropicale. Risponde a qualsiasi mail con "Ok, ne parliamo al mio rientro".',
    challenge: '📸 Fotografa lo schermo di un collega fermo su siti di ricerca voli low-cost o offerte vacanze durante l\'orario lavorativo.',
    imageUrl: 'images/vacation_mode.png'
  },
  {
    id: 'ancient_hardware',
    name: '⚙️ Il Portatile Aeronautico',
    rarity: 'noncomune',
    points: 25,
    description: 'Un laptop aziendale obsoleto che emette un rumore simile a un caccia militare non appena si avviano tre schede di Chrome. Riscalda gli uffici in inverno.',
    challenge: '📸 Fotografa un computer aziendale con prese polverose e ventole rumorose bloccato in caricamento infinito.',
    imageUrl: 'images/ancient_hardware.png'
  },
  {
    id: 'hr_deity',
    name: '🧘‍♀️ La Divinità degli HR',
    rarity: 'ultrarara',
    points: 95,
    description: 'Una creatura mistica che si manifesta solo per promuovere sondaggi sulla felicità aziendale, corsi di mindfulness obbligatori e borracce termiche logate.',
    challenge: '📸 Fotografa un gadget aziendale brandizzato Fanta Adiacent (tazza, agenda, borraccia) posizionato in un luogo surreale o insolito.',
    imageUrl: 'images/hr_deity.png'
  },
  {
    id: 'micro_manager',
    name: '🔍 Il Micro-Manager',
    rarity: 'rara',
    points: 50,
    description: 'Controlla l\'orario di login con precisione millisecondale. Respira letteralmente sul collo dei dipendenti.',
    challenge: '📸 Fotografa un manager mentre osserva lo schermo di un collega da dietro le sue spalle.',
    imageUrl: 'images/micro_manager.png'
  },
  {
    id: 'ping_pong_champion',
    name: '🏓 Il Campione di Ping Pong',
    rarity: 'comune',
    points: 15,
    description: 'Re indiscusso della sala break. Indossa il badge come una medaglia olimpica e schiaccia senza pietà contro gli stagisti.',
    challenge: '📸 Fotografa un dipendente in posa trionfale con una racchetta da ping pong o calcio balilla.',
    imageUrl: 'images/ping_pong_champion.png'
  },
  {
    id: 'chat_spammer',
    name: '💬 Lo Spammone Aziendale',
    rarity: 'comune',
    points: 10,
    description: 'Invia messaggi su Teams scrivendo. Una. Parola. Alla. Volta. Il suo superpotere è far vibrare il telefono 20 volte per un "Ciao".',
    challenge: '📸 Fai uno screenshot a una chat dove un collega ha mandato almeno 5 messaggi consecutivi di una sola parola.',
    imageUrl: 'images/chat_spammer.png'
  },
  {
    id: 'apple_evangelist',
    name: '🍎 L\'Adepto della Mela',
    rarity: 'noncomune',
    points: 25,
    description: 'Rifiuta di toccare qualsiasi dispositivo che non abbia una mela morsicata. Parla dell\'ecosistema Apple come di una religione.',
    challenge: '📸 Fotografa una scrivania con laptop, tablet, telefono e orologio tutti rigorosamente dello stesso brand.',
    imageUrl: 'images/apple_evangelist.png'
  },
  {
    id: 'badge_forgetter',
    name: '💳 Il Dimenticatore di Badge',
    rarity: 'comune',
    points: 10,
    description: 'Ogni mattina è un\'avventura per entrare in ufficio. Passa i primi 10 minuti ad aspettare che qualcuno gli apra la porta del tornello.',
    challenge: '📸 Fotografa un collega fermo davanti al tornello o alla porta d\'ingresso in attesa di essere salvato.',
    imageUrl: 'images/badge_forgetter.png'
  },
  {
    id: 'mute_microphone',
    name: '🔇 Il Microfonista Muto',
    rarity: 'comune',
    points: 10,
    description: 'Parla appassionatamente e gesticola in videochiamata, dispensando saggezza, ma il suo microfono è inesorabilmente spento.',
    challenge: '📸 Fai uno screenshot a un collega in videochiamata mentre parla con l\'icona del microfono silenziato visibile.',
    imageUrl: 'images/mute_microphone.png'
  },
  {
    id: 'printer_oracle',
    name: '🖨️ L\'Oracolo della Stampante',
    rarity: 'rara',
    points: 60,
    description: 'L\'unica entità mistica in grado di scacciare l\'errore "Inceppamento carta nel cassetto 2" e sostituire il toner senza esplosioni di polvere nera.',
    challenge: '📸 Fotografa un collega (possibilmente in posa solenne) mentre estrae un foglio o un toner dalla stampante aziendale.',
    imageUrl: 'images/printer_oracle.png'
  },
  {
    id: 'pen_thief',
    name: '🖊️ Il Ladro di Penne',
    rarity: 'noncomune',
    points: 25,
    description: 'Ti giri un attimo per prendere un caffè e la tua penna preferita scompare per sempre nel nulla. Il suo cassetto è un tesoro di cancelleria.',
    challenge: '📸 Fotografa di nascosto un collega che sta usando una penna che sai per certo non essere la sua.',
    imageUrl: 'images/pen_thief.png'
  },
  {
    id: 'wifi_shaman',
    name: '📡 Lo Sciamano del Wi-Fi',
    rarity: 'rara',
    points: 50,
    description: 'Quando la rete cade, lui alza il portatile al cielo ed esegue un rito mistico avvicinandosi al router. Stranamente, funziona.',
    challenge: '📸 Fotografa un collega che solleva o inclina il laptop/telefono in posizioni assurde sperando di prendere campo.',
    imageUrl: 'images/wifi_shaman.png'
  },
  {
    id: 'break_marathoner',
    name: '🏃‍♂️ Il Maratoneta delle Pause',
    rarity: 'ultrarara',
    points: 80,
    description: 'Dice "Vado un attimo alla macchinetta del caffè" e scompare nei meandri dello spazio-tempo per ore.',
    challenge: '📸 Fotografa la scrivania vuota di un collega che si è alzato "solo per un caffè" e non è tornato dopo 45 minuti.',
    imageUrl: 'images/break_marathoner.png'
  },
  {
    id: 'seo_guru',
    name: '🔍 Il Guru della SEO',
    rarity: 'noncomune',
    points: 20,
    description: 'Sempre a parlare di keyword, backlinks e posizionamento organico. Vede il mondo solo come un grande motore di ricerca.',
    challenge: '📸 Fotografa una lavagna o uno schermo con un elenco lunghissimo di parole chiave assurde.',
    imageUrl: 'images/seo_guru.png'
  },
  {
    id: 'css_wizard',
    name: '🪄 Il Mago dei CSS',
    rarity: 'comune',
    points: 15,
    description: 'Riesce a centrare un div ad occhi chiusi, ma se gli parli di database inizia a sudare freddo.',
    challenge: '📸 Fotografa un collega mentre ispeziona un elemento del browser cambiando i colori a caso.',
    imageUrl: 'images/css_wizard.png'
  },
  {
    id: 'scrum_purist',
    name: '⏱️ Lo Scrum Master Purista',
    rarity: 'rara',
    points: 50,
    description: 'Se il daily standup sfora i 15 minuti, inizia ad iperventilare. La sua vita è scandita in sprint di due settimane.',
    challenge: '📸 Fai una foto al timer del daily meeting che sfora impietosamente.',
    imageUrl: 'images/scrum_purist.png'
  },
  {
    id: 'night_freelance',
    name: '🦉 Il Freelance Notturno',
    rarity: 'noncomune',
    points: 25,
    description: 'Lavora solo tra le 2 AM e le 6 AM, mandando email ad orari assurdi. Di giorno è praticamente un fantasma.',
    challenge: '📸 Fotografa una mail o un commit inviati in orari improponibili della notte.',
    imageUrl: 'images/night_freelance.png'
  },
  {
    id: 'indecisive_client',
    name: '🤷 Il Cliente Indeciso',
    rarity: 'comune',
    points: 10,
    description: 'Apprezza il lavoro ma chiede sempre di renderlo "più pop". Cambia idea al momento della consegna.',
    challenge: '📸 Fotografa un feedback del cliente che chiede di ingrandire il logo in modo eccessivo.',
    imageUrl: 'images/indecisive_client.png'
  },
  {
    id: 'keyboard_hacker',
    name: '⌨️ L\'Hacker da Tastiera',
    rarity: 'noncomune',
    points: 30,
    description: 'Usa il terminale con scritte verdi su sfondo nero persino per leggere le ricette di cucina. Non tocca un mouse dal 2012.',
    challenge: '📸 Fotografa uno schermo pieno di terminali aperti per svolgere compiti banali.',
    imageUrl: 'images/keyboard_hacker.png'
  },
  {
    id: 'aggressive_sales',
    name: '🤝 Il Sales Aggressivo',
    rarity: 'rara',
    points: 40,
    description: 'Vende features non ancora sviluppate e promette miracoli in tempi record ai clienti, mandando in panico il team tecnico.',
    challenge: '📸 Fotografa un collega commerciale mentre promette l\'impossibile al telefono.',
    imageUrl: 'images/aggressive_sales.png'
  },
  {
    id: 'blocked_copy',
    name: '✍️ Il Copywriter in Blocco',
    rarity: 'comune',
    points: 10,
    description: 'Fissa il foglio bianco aspettando l\'ispirazione divina che sembra non arrivare mai. Il suo cestino è pieno di idee scartate.',
    challenge: '📸 Fotografa una bozza di testo vuota o con solo il titolo scritto da ore.',
    imageUrl: 'images/blocked_copy.png'
  },
  {
    id: 'unfindable_bug',
    name: '🪲 Il Bug Introvabile',
    rarity: 'ultrarara',
    points: 90,
    description: 'Appare solo in produzione, mai in locale. Ha rovinato più weekend di quanti se ne possano contare.',
    challenge: '📸 Fai uno screenshot a un messaggio di errore incomprensibile che non sei riuscito a riprodurre.',
    imageUrl: 'images/unfindable_bug.png'
  },
  {
    id: 'data_magician',
    name: '🔮 Il Data Scientist Mago',
    rarity: 'rara',
    points: 60,
    description: 'Tira fuori predizioni da grafici incomprensibili e modelli di Machine Learning di cui nessuno capisce il funzionamento.',
    challenge: '📸 Fotografa un grafico pieno di punti e linee senza alcun senso apparente per chiunque non sia del settore.',
    imageUrl: 'images/data_magician.png'
  },
  {
    id: 'meticulous_tester',
    name: '🔎 Il Tester Pignolo',
    rarity: 'noncomune',
    points: 35,
    description: 'Trova i bug più assurdi testando i form inserendo l\'intero testo della Divina Commedia al posto della mail.',
    challenge: '📸 Fotografa un campo di testo riempito con caratteri casuali fino al limite massimo.',
    imageUrl: 'images/meticulous_tester.png'
  },
  {
    id: 'night_sysadmin',
    name: '🦇 Il Sistemista Notturno',
    rarity: 'rara',
    points: 45,
    description: 'Vive nel server room, non ha mai visto la luce del sole. Il suo gruppo sanguigno è Monster Energy.',
    challenge: '📸 Fotografa un collega che beve un energy drink alle 9 di mattina.',
    imageUrl: 'images/night_sysadmin.png'
  },
  {
    id: 'sorcerer_apprentice',
    name: '🧙 L\'Apprendista Stregone',
    rarity: 'comune',
    points: 10,
    description: 'Junior dev che fa copia-incolla da Stack Overflow sperando che la magia funzioni. A volte ci riesce.',
    challenge: '📸 Fai uno screenshot a un blocco di codice palesemente incollato che non c\'entra nulla col contesto.',
    imageUrl: 'images/sorcerer_apprentice.png'
  },
  {
    id: 'social_manager',
    name: '✨ La Social Media Manager',
    rarity: 'noncomune',
    points: 25,
    description: 'Tutto deve essere "aesthetic". Passa ore a scorrere TikTok sostenendo che sia "ricerca di mercato".',
    challenge: '📸 Fotografa qualcuno impegnato a registrare un balletto per i social in ufficio.',
    imageUrl: 'images/social_manager.png'
  },
  {
    id: 'ui_artist',
    name: '🎨 L\'UI Designer Artista',
    rarity: 'rara',
    points: 40,
    description: 'Crea interfacce di una bellezza commovente, ma completamente inusabili. "L\'accessibilità uccide l\'arte".',
    challenge: '📸 Fotografa un bottone su un sito o un\'app che è impossibile da cliccare o capire.',
    imageUrl: 'images/ui_artist.png'
  },
  {
    id: 'monolith_backend',
    name: '🧱 Il Backend Monolitico',
    rarity: 'rara',
    points: 50,
    description: 'Odia i microservizi. Gestisce tutta la logica di business dell\'azienda in un singolo file da 40.000 righe.',
    challenge: '📸 Fotografa un editor di codice con un file aperto che supera le 5000 righe.',
    imageUrl: 'images/monolith_backend.png'
  },
  {
    id: 'silent_videomaker',
    name: '🎬 Il Videomaker Silenzioso',
    rarity: 'noncomune',
    points: 30,
    description: 'Indossa perennemente cuffie giganti e fissa una timeline, spostando lo stesso fotogramma avanti e indietro per giorni.',
    challenge: '📸 Fotografa un collega con cuffie enormi isolato dal resto del mondo in ufficio.',
    imageUrl: 'images/silent_videomaker.png'
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

// Check for explicit demo mode request via URL parameter
const forceDemo = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === 'true';

let firebaseApp = null;
let auth = null;
let db = null;
let storage = null;
let isDemoMode = true;

if (hasConfig && !forceDemo) {
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
  console.log('💡 Demo mode forzata o credenziali Firebase assenti. Attiva la modalità DEMO locale.');
  isDemoMode = true;
}

export { auth, db, storage, isDemoMode };
