import React from 'react';
import { Award, Shield, Star, Crown } from 'lucide-react';

// Rarity icons helper (colored: comune=white, noncomune=grey, rara=yellow, ultrarara=gold)
export const getRarityIcon = (rarity, size = 14) => {
  switch (rarity) {
    case 'ultrarara':
      return <Crown size={size} color="#ffd700" style={{ fill: '#ffd700', filter: 'drop-shadow(0 0 3px rgba(255,215,0,0.8))' }} />;
    case 'rara':
      return <Star size={size} color="#ecc94b" style={{ fill: '#ecc94b' }} />;
    case 'noncomune':
      return <Shield size={size} color="#a0aec0" style={{ fill: '#a0aec0' }} />;
    case 'comune':
    default:
      return <Award size={size} color="#ffffff" style={{ fill: '#ffffff' }} />;
  }
};

export default function Card({ card, isUnlocked, onClick, unlockDate }) {
  const { name, rarity, points, imageUrl } = card;

  // Format rarity label with custom icons
  const renderRarityLabel = () => {
    const icon = getRarityIcon(rarity, 12);
    const text = rarity === 'ultrarara' ? 'Ultra Rara' :
                 rarity === 'rara' ? 'Rara' :
                 rarity === 'noncomune' ? 'Non Comune' : 'Comune';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {icon} {text}
      </span>
    );
  };

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
          {renderRarityLabel()}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '12px' }}>
          <span>{isUnlocked ? '🔓 Attiva' : '🔒 Bloccata'}</span>
          {unlockDate && (
            <span style={{ fontSize: '9px', opacity: 0.7, marginTop: '2px' }}>
              {new Date(unlockDate).toLocaleDateString('it-IT')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
