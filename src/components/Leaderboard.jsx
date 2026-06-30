import React, { useState, useEffect } from 'react';
import { listenToUsers } from '../firebase/db';

export default function Leaderboard({ onUserSelect }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToUsers((data) => {
      // Sort users by score descending
      const sorted = [...data].sort((a, b) => (b.score || 0) - (a.score || 0));
      setUsers(sorted);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  // Listen to custom local storage update events (Demo Mode reactive support)
  useEffect(() => {
    const handleLocalUpdate = () => {
      const usersData = Object.values(JSON.parse(localStorage.getItem('fanta_adiacent_users') || '{}'));
      const sorted = usersData.sort((a, b) => (b.score || 0) - (a.score || 0));
      setUsers(sorted);
    };
    window.addEventListener('fanta_db_update', handleLocalUpdate);
    return () => window.removeEventListener('fanta_db_update', handleLocalUpdate);
  }, []);

  const getRankEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `🏅 ${index + 1}`;
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🏆 Classifica Globale
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Clicca su un utente per ispezionare il suo album di carte sbloccate! 🔍📖
        </p>
      </div>

      {users.length > 0 ? (
        <div className="leaderboard-list">
          {users.map((item, idx) => {
            const unlockedCount = item.unlockedCards?.length || 0;
            return (
              <div 
                key={item.uid} 
                className="leaderboard-item"
                onClick={() => onUserSelect(item)}
              >
                <div className={`leaderboard-rank rank-${idx + 1}`}>
                  {getRankEmoji(idx)}
                </div>
                <img 
                  src={item.photoURL} 
                  alt={item.displayName} 
                  className="leaderboard-avatar"
                />
                <div className="leaderboard-name">
                  <div>{item.displayName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                    👾 {unlockedCount} carte sbloccate
                  </div>
                </div>
                <div className="leaderboard-score">
                  💎 {item.score || 0} pts
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>🏃‍♂️</span>
          Ancora nessun giocatore registrato. Sii il primo!
        </div>
      )}
    </div>
  );
}
