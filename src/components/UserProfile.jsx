import React, { useState, useEffect } from 'react';
import Card from './Card';
import { INITIAL_CARDS } from '../firebase/config';
import { listenToUsers } from '../firebase/db';
import { LogOut, ArrowLeft, Award, Layers } from 'lucide-react';

export default function UserProfile({ targetUser, currentUser, onLogout, onBackToLeaderboard, onCardClick }) {
  const [globalRank, setGlobalRank] = useState('-');
  const isSelf = currentUser && targetUser.uid === currentUser.uid;

  // Retrieve global rank from leaderboard
  useEffect(() => {
    const unsubscribe = listenToUsers((users) => {
      const sorted = [...users].sort((a, b) => (b.score || 0) - (a.score || 0));
      const idx = sorted.findIndex(u => u.uid === targetUser.uid);
      if (idx !== -1) {
        setGlobalRank(`#${idx + 1}`);
      }
    });
    return () => unsubscribe && unsubscribe();
  }, [targetUser.uid]);

  const unlockedCards = targetUser.unlockedCards || [];
  const score = targetUser.score || 0;

  return (
    <div>
      {!isSelf && (
        <button 
          className="btn btn-outline" 
          onClick={onBackToLeaderboard}
          style={{ width: 'auto', padding: '8px 16px', marginBottom: '16px', fontSize: '13px' }}
        >
          <ArrowLeft size={14} />
          Torna alla Classifica 🔙
        </button>
      )}

      <div className="profile-card">
        <img 
          src={targetUser.photoURL} 
          alt={targetUser.displayName} 
          className="profile-avatar"
        />
        <h2 className="profile-name">
          {isSelf ? '👋 Ciao, ' : ''}@{targetUser.displayName}
        </h2>
        <p className="profile-email">{targetUser.email}</p>

        <div className="profile-stats-row">
          <div className="profile-stat-box">
            <span className="profile-stat-val">💎 {score}</span>
            <span className="profile-stat-lbl">Punti</span>
          </div>
          <div className="profile-stat-box">
            <span className="profile-stat-val">👾 {unlockedCards.length}/10</span>
            <span className="profile-stat-lbl">Catturate</span>
          </div>
          <div className="profile-stat-box">
            <span className="profile-stat-val">🏆 {globalRank}</span>
            <span className="profile-stat-lbl">Rango</span>
          </div>
        </div>

        {isSelf && onLogout && (
          <div className="logout-btn-wrapper">
            <button 
              className="btn btn-outline" 
              onClick={onLogout}
              style={{ padding: '8px 16px', fontSize: '12px', borderColor: 'rgba(229, 62, 62, 0.4)', color: '#feb2b2' }}
            >
              <LogOut size={12} style={{ marginRight: '6px' }} />
              Disconnetti Account 🚪
            </button>
          </div>
        )}
      </div>

      <div className="profile-binder-title">
        <Layers size={18} color="var(--secondary)" />
        <span>📖 Album di @{targetUser.displayName}</span>
      </div>

      <div className="pokedex-grid">
        {INITIAL_CARDS.map((card) => {
          const isUnlocked = unlockedCards.includes(card.id);
          return (
            <Card
              key={card.id}
              card={card}
              isUnlocked={isUnlocked}
              onClick={onCardClick}
            />
          );
        })}
      </div>
    </div>
  );
}
