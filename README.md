# Fanta Adiacent 🏆

Fanta Adiacent è una Web App interattiva e gamificata concepita per la vita d'ufficio. Funziona come una sorta di "Pokedex" aziendale, in cui l'obiettivo dei colleghi (i giocatori) è individuare, fotografare e collezionare le diverse "creature leggendarie" (gli stereotipi o i personaggi tipici) che si aggirano per l'ufficio.

## 🎯 Scopo del Gioco

I giocatori devono completare la propria collezione di carte catturando ogni creatura presente nel Pokedex. 
Ogni creatura ha una specifica **Sfida** (es. fotografare un collega al telefono mentre gesticola, oppure fotografare il tavolo del calcetto durante una pausa).
Una volta scattata la foto, il giocatore invia la **Prova di Cattura** nella chat globale dell'ufficio.

A questo punto la community (gli altri colleghi registrati) dovrà visionare la foto e **votare (✅ Approvata o ❌ Rifiutata)** per confermare o meno la validità dello scatto. 
Se la prova riceve 5 voti positivi, la creatura viene ufficialmente "sbloccata" per quel giocatore, che guadagnerà i punti corrispondenti al **Valore della Carta**. (Nota: per prevenire spam, le votazioni vengono chiuse automaticamente al raggiungimento dei 5 voti).

## 🚀 Funzionalità Principali

- **Login Google & Sincronizzazione Cloud:** Autenticazione sicura tramite Google Firebase per salvare i propri progressi e sincronizzarli su tutti i dispositivi.
- **Demo Mode Integrata:** Possibilità di testare localmente tutte le funzionalità del sistema (inviando foto, simulando voti e sblocchi) senza "inquinare" il database di produzione, utile per test e sviluppo.
- **Pokedex Interattivo:** Griglia in stile Pokemon che mostra le creature da sbloccare, divise in Rarità (Comune, Non Comune, Rara, Ultra Rara), con effetti CSS 3D e animazioni olografiche.
- **Chat e Validazione Partecipata:** Chat real-time in cui appaiono le "Richieste di Cattura" complete della foto scattata, della sfida richiesta e dello stato di avanzamento delle approvazioni (es. 3/5).
- **Leaderboard (Classifica):** Una bacheca che ordina automaticamente tutti i giocatori in base al punteggio accumulato sbloccando le creature.
- **Ottimizzazione Mobile-First & PWA:** UX e design moderni studiati per sembrare a tutti gli effetti un'applicazione mobile nativa, compatibile con gli standard PWA. Per gli utenti smartphone è forzata l'installazione PWA (Aggiungi a Schermata Home) per garantire il corretto funzionamento del Login Google, spesso bloccato dai browser in-app (es. social network o modalità incognito).
- **Compressione Immagini Lato Client:** Ottimizzazione integrata che riduce drasticamente il peso delle foto in locale (via Canvas API) prima del caricamento, per abbattere il consumo di rete e storage (e prevenire errori di quota in Demo Mode).

*(Versione Attuale: **v1.1.0**)*

## 🛠️ Stack Tecnologico

Questo progetto è una Single Page Application (SPA) creata con:
- **React.js** (Componenti funzionali e hooks)
- **Vite** (Bundler e dev server)
- **Firebase** (Firestore Database, Firebase Auth e Firebase Storage)
- **Vanilla CSS3** (Design system personalizzato, variabili CSS ed effetti Glassmorphism premium)
- **Lucide Icons** (Libreria iconografica SVG)

## 🎮 Come Avviare il Progetto (Sviluppo Locale)

1. Assicurati di avere `Node.js` e `npm` installati sul tuo computer.
2. Clona il repository e installa le dipendenze:
   ```bash
   npm install
   ```
3. Avvia il server di sviluppo locale:
   ```bash
   npm run dev
   ```
4. Apri l'applicazione all'indirizzo restituito dal terminale (tipicamente `http://localhost:5173`).

## 🧪 Demo Mode

Per testare l'app in un ambiente isolato è inclusa una speciale "Demo Mode". Per attivarla su qualsiasi istanza (anche in produzione), basta aggiungere il parametro `?demo=true` alla fine dell'URL, ad esempio: 
`https://iltuodominio.com/?demo=true`

In questa modalità, le chiamate a Firebase vengono bloccate e vengono utilizzati avatar fittizi per popolare il Pokedex e la Chat, utilizzando esclusivamente il `localStorage` del browser. Nella Chat dei claim in pending apparirà anche un pulsante "Simula Sblocco Immediato" per approvare istantaneamente una card ai fini dei test.