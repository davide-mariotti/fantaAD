import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import CardGrid from './components/CardGrid';
import CardModal from './components/CardModal';
import Chat from './components/Chat';
import Leaderboard from './components/Leaderboard';
import UserProfile from './components/UserProfile';
import { auth, isDemoMode } from './firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { registerUser, getUserProfile } from './firebase/db';
import RulesModal from './components/RulesModal';
import { Info } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); // Complete user profile from database
  const [currentView, setCurrentView] = useState('pokedex'); // pokedex, chat, leaderboard, profile
  const [inspectedUser, setInspectedUser] = useState(null); // Inspected user from leaderboard
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', show: false, type: 'info' });
  const [showRules, setShowRules] = useState(() => {
    return localStorage.getItem('fanta_rules_seen') !== 'true';
  });

  const handleCloseRules = () => {
    localStorage.setItem('fanta_rules_seen', 'true');
    setShowRules(false);
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, show: true, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  // Authentication state listeners
  useEffect(() => {
    if (isDemoMode) {
      // Local Auth persist layer
      const localUser = localStorage.getItem('fanta_current_user');
      if (localUser) {
        const user = JSON.parse(localUser);
        setCurrentUser(user);
        syncDbUser(user);
      } else {
        setLoading(false);
      }
    } else {

      // Real Firebase Auth listener
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          await syncDbUser(user);
        } else {
          setCurrentUser(null);
          setDbUser(null);
          setLoading(false);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Sync / Register user in the database (local or firestore)
  const syncDbUser = async (user) => {
    try {
      const dbProfile = await registerUser(user);
      setDbUser(dbProfile);
      
      // Keep Demo Mode session refreshed
      if (isDemoMode) {
        localStorage.setItem('fanta_current_user', JSON.stringify(user));
      }
    } catch (err) {
      console.error('Errore durante sincronizzazione profilo db:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to trigger database reload when user unlocks a card
  const reloadDbUser = async () => {
    if (!currentUser) return;
    try {
      const dbProfile = await getUserProfile(currentUser.uid);
      if (dbProfile) {
        setDbUser(dbProfile);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginSuccess = async (user) => {
    setLoading(true);
    setCurrentUser(user);
    await syncDbUser(user);
  };

  const handleLogout = async () => {
    setLoading(true);
    if (isDemoMode) {
      localStorage.removeItem('fanta_current_user');
      setCurrentUser(null);
      setDbUser(null);
      setLoading(false);
    } else {
      try {
        await signOut(auth);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Callback after claim submits to open chat view
  const handleClaimSubmitted = () => {
    setSelectedCard(null);
    setCurrentView('chat');
    reloadDbUser();
  };

  const handleInspectUser = (user) => {
    setInspectedUser(user);
    setCurrentView('profile'); // Switch to profile view, showing details of inspected user
  };

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '40px', display: 'block', animation: 'float 2s ease-in-out infinite' }}>🏆</span>
          <p style={{ marginTop: '16px', fontFamily: 'var(--font-display)', fontWeight: 'bold' }}>
            Caricamento Fanta Adiacent...
          </p>
        </div>
      </div>
    );
  }

  // If not logged in, force Login screen
  if (!currentUser || !dbUser) {
    return (
      <div className="app-container">
        {/* 🔔 Custom In-App Toast Popup */}
        <div className={`custom-toast ${toast.show ? 'show' : ''} ${toast.type}`}>
          <span className="custom-toast-icon">
            {toast.type === 'success' ? '🟢' : toast.type === 'error' ? '🔴' : '💡'}
          </span>
          <div className="custom-toast-content">
            {toast.message}
          </div>
        </div>
        <Login onLoginSuccess={handleLoginSuccess} showToast={showToast} />
      </div>
    );
  }

  // Render view based on navbar routing
  const renderViewContent = () => {
    switch (currentView) {
      case 'pokedex':
        return (
          <CardGrid 
            unlockedCards={dbUser.unlockedCards || []} 
            onCardClick={(card) => setSelectedCard(card)}
          />
        );
      case 'chat':
        return <Chat user={dbUser} />;
      case 'leaderboard':
        return <Leaderboard onUserSelect={handleInspectUser} />;
      case 'profile':
        // Inspecting someone else or looking at own profile
        const displayUser = inspectedUser || dbUser;
        return (
          <UserProfile 
            targetUser={displayUser} 
            currentUser={dbUser} 
            onLogout={handleLogout}
            onBackToLeaderboard={() => {
              setInspectedUser(null);
              setCurrentView('leaderboard');
            }}
            onCardClick={(card) => setSelectedCard(card)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* 🔔 Custom In-App Toast Popup */}
      <div className={`custom-toast ${toast.show ? 'show' : ''} ${toast.type}`}>
        <span className="custom-toast-icon">
          {toast.type === 'success' ? '🟢' : toast.type === 'error' ? '🔴' : '💡'}
        </span>
        <div className="custom-toast-content">
          {toast.message}
        </div>
      </div>

      {/* Header bar */}
      {currentView !== 'chat' && (
        <header style={{ padding: '16px 16px 8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>🏆 Fanta Adiacent</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button 
              className="btn btn-outline" 
              style={{ padding: '4px', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => setShowRules(true)}
            >
              <Info size={22} color="var(--primary)" />
            </button>
            <span style={{ fontSize: '13px', background: 'var(--bg-glass)', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', color: 'var(--secondary)', whiteSpace: 'nowrap' }}>
              💎 {dbUser.score || 0} pts
            </span>
          </div>
        </header>
      )}

      {/* Main page content area */}
      <main className={`main-content ${currentView === 'chat' ? 'no-scroll' : ''}`}>
        {renderViewContent()}
      </main>

      {/* Sticky Bottom Navigation */}
      <Navbar currentView={currentView} setCurrentView={(view) => {
        // Reset inspected profile when selecting navigation items
        if (view !== 'profile') {
          setInspectedUser(null);
        }
        setCurrentView(view);
        reloadDbUser();
      }} />

      {/* Rules Modal */}
      {showRules && <RulesModal onClose={handleCloseRules} />}

      {/* Shared detail modal for any card */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          isUnlocked={(inspectedUser || dbUser).unlockedCards?.includes(selectedCard.id)}
          user={dbUser}
          onClose={() => setSelectedCard(null)}
          onClaimSubmitted={handleClaimSubmitted}
          showToast={showToast}
        />
      )}
    </div>
  );
}
