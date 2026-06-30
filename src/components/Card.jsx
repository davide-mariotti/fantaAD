import React from 'react';

export default function Card({ card, isUnlocked, onClick }) {
  const { name, rarity, points, imageUrl } = card;

  // Format rarity label
  const rarityLabel = rarity === 'ultrarara' ? '👑 Ultra Rara' :
                      rarity === 'rara' ? '⭐ Rara' :
                      rarity === 'noncomune' ? '🟢 Non Comune' : '⚪ Comune';

  return (
    <div 
      className={`pokemon-card ${rarity} ${!isUnlocked ? 'locked' : ''}`}
      onClick={() => onClick && onClick(card)}
    >
      <div className="pokemon-card-header">
        <span className="pokemon-card-name">{name}</span>
        <span className="pokemon-card-points">💎 {points} pts</span>
      </div>

      <div className="pokemon-card-image-container">
        <img 
          src={imageUrl} 
          alt={name} 
          className="pokemon-card-image"
          loading="lazy"
        />
      </div>

      <div className="pokemon-card-footer">
        <span className={`pokemon-card-rarity rarity-badge ${rarity}`}>
          {rarityLabel}
        </span>
        <span style={{ fontSize: '12px' }}>
          {isUnlocked ? '🔓 Attiva' : '🔒 Bloccata'}
        </span>
      </div>
    </div>
  );
}
