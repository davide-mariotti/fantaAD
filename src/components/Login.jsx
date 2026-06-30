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
      <div className="logo-container">
        <img
          src="/fantaAD/icon-512.png"
          alt="Fanta Adiacent Logo"
          className="logo-img"
        />
        <h1 className="login-title">Fanta Adiacent 🏆</h1>
        <p className="login-subtitle">Il Pokedex delle creature leggendarie in ufficio 🏢✨</p>
      </div>

      <div className="glass-panel login-card">
        {!isDemoMode ? (
          <div>
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
  );
}
