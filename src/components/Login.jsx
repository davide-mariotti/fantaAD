import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, isDemoMode } from '../firebase/config';

// 5 pre-made office avatars to select in Demo Mode
const MOCK_AVATARS = [
  { name: 'Ale 👨‍💻', seed: 'ale' },
  { name: 'Giulia 👩‍💼', seed: 'giulia' },
  { name: 'Marco 🎨', seed: 'marco' },
  { name: 'Sarah 📈', seed: 'sarah' },
  { name: 'Luca 🛡️', seed: 'luca' }
];

export default function Login({ onLoginSuccess, showToast }) {
  const [customName, setCustomName] = useState('');
  const [selectedAvatarIdx, setSelectedAvatarIdx] = useState(0);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Revert to popup sign-in which is required for custom domains (GitHub Pages) to bypass storage blocking
      const result = await signInWithPopup(auth, provider);
      onLoginSuccess(result.user);
    } catch (error) {
      console.error('Errore Google Sign-in:', error);
      showToast(`Errore Google Sign-in: ${error.code || error.message} ❌`, 'error');
    }
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
    const name = customName.trim() || MOCK_AVATARS[selectedAvatarIdx].name;
    const seed = MOCK_AVATARS[selectedAvatarIdx].seed;

    // Generate a unique mock uid
    const mockUser = {
      uid: `mock_${seed}_${Date.now()}`,
      displayName: name,
      email: `${seed}@adiacent.it`,
      photoURL: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`
    };

    onLoginSuccess(mockUser);
  };

  return (
    <div className="login-screen">
      <div style={{ margin: 'auto 0', width: '100%' }}>
        <div className="logo-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <img
            src="/fantaAD/icon-512.png"
            alt="Fanta Adiacent Logo"
            className="logo-img"
          />
          <h1 className="login-title">Fanta Adiacent 🏆</h1>
          <p className="login-subtitle">Il Pokedex delle creature leggendarie in ufficio 🏢✨</p>
          <p style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '-24px', marginBottom: '32px', fontWeight: 'bold' }}>v1.1.0</p>
        </div>

        <div className="glass-panel login-card">
          {!isDemoMode ? (
            <div>
              {(isMobile && !isStandalone) ? (
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#ecc94b' }}>
                    📱 Installa l'App per Giocare!
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '20px' }}>
                    I browser in-app (es. Instagram) bloccano il login Google.<br />
                    Devi installare Fanta Adiacent per accedere.
                  </p>
                  
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', textAlign: 'left', display: 'inline-block', width: '100%' }}>
                    <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>🍎 iPhone (Safari):</h3>
                    <ul style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '20px', marginBottom: '16px' }}>
                      <li>Tocca l'icona <strong>Condividi</strong> (quadrato con freccia)</li>
                      <li>Scegli <strong>"Aggiungi alla schermata Home"</strong></li>
                    </ul>
                    
                    <h3 style={{ fontSize: '14px', marginBottom: '8px' }}>🤖 Android (Chrome):</h3>
                    <ul style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '20px' }}>
                      <li>Tocca i <strong>3 puntini</strong> in alto a destra</li>
                      <li>Scegli <strong>"Aggiungi a schermata Home"</strong></li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Accedi per Giocare 🎮</h2>
                  <button className="btn btn-google" onClick={handleGoogleLogin}>
                    <img
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                      alt="Google"
                      style={{ width: '18px', height: '18px' }}
                    />
                    Accedi con Google
                  </button>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Accedi in sicurezza tramite Google per sincronizzare le tue catture! 🔒
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleDemoLogin}>
              <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>💡 Demo Mode Attiva</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Crea un account di test locale per provare l'applicazione!
              </p>

              <div className="avatar-selector">
                {MOCK_AVATARS.map((avatar, idx) => (
                  <div
                    key={avatar.seed}
                    className={`avatar-option ${selectedAvatarIdx === idx ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatarIdx(idx)}
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${avatar.seed}`}
                      alt={avatar.name}
                      className="avatar-img"
                    />
                  </div>
                ))}
              </div>

              <input
                type="text"
                placeholder={`Es: ${MOCK_AVATARS[selectedAvatarIdx].name}`}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="input-field"
                maxLength={20}
              />

              <button type="submit" className="btn btn-primary">
                Entra nel Pokedex 🚪✨
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
