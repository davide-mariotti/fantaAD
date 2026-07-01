import React, { useState } from 'react';
import Card from './Card';
import { INITIAL_CARDS } from '../firebase/config';
import { Search } from 'lucide-react';

export default function CardGrid({ unlockedCards, onCardClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, unlocked, locked
  const [rarityFilter, setRarityFilter] = useState('all'); // all, comune, noncomune, rara, ultrarara

  // Filter cards based on user inputs
  const filteredCards = INITIAL_CARDS.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isUnlocked = unlockedCards.includes(card.id);
    const matchesStatus = statusFilter === 'all' ||
                          (statusFilter === 'unlocked' && isUnlocked) ||
                          (statusFilter === 'locked' && !isUnlocked);
    
    const matchesRarity = rarityFilter === 'all' || card.rarity === rarityFilter;

    return matchesSearch && matchesStatus && matchesRarity;
  });

  return (
    <div>
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <Search className="search-icon-svg" />
          <input
            type="text"
            placeholder="Cerca creatura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Status Filters */}
      <div className="filter-tabs">
        <button 
          className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          🔍 Tutte ({INITIAL_CARDS.length})
        </button>
        <button 
          className={`tab-btn ${statusFilter === 'unlocked' ? 'active' : ''}`}
          onClick={() => setStatusFilter('unlocked')}
        >
          🔓 Sbloccate ({INITIAL_CARDS.filter(c => unlockedCards.includes(c.id)).length})
        </button>
        <button 
          className={`tab-btn ${statusFilter === 'locked' ? 'active' : ''}`}
          onClick={() => setStatusFilter('locked')}
        >
          🔒 Da Sbloccare ({INITIAL_CARDS.filter(c => !unlockedCards.includes(c.id)).length})
        </button>
      </div>

      {/* Rarity Filters */}
      <div className="filter-tabs" style={{ marginTop: '-8px', marginBottom: '20px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <button 
          className={`tab-btn ${rarityFilter === 'all' ? 'active' : ''}`}
          onClick={() => setRarityFilter('all')}
          style={{ fontSize: '11px', padding: '6px 12px' }}
        >
          🌈 Tutte
        </button>
        <button 
          className={`tab-btn ${rarityFilter === 'comune' ? 'active' : ''}`}
          onClick={() => setRarityFilter('comune')}
          style={{ fontSize: '11px', padding: '6px 12px' }}
        >
          ⚪ Comuni
        </button>
        <button 
          className={`tab-btn ${rarityFilter === 'noncomune' ? 'active' : ''}`}
          onClick={() => setRarityFilter('noncomune')}
          style={{ fontSize: '11px', padding: '6px 12px' }}
        >
          🟢 Non Comuni
        </button>
        <button 
          className={`tab-btn ${rarityFilter === 'rara' ? 'active' : ''}`}
          onClick={() => setRarityFilter('rara')}
          style={{ fontSize: '11px', padding: '6px 12px' }}
        >
          ⭐ Rare
        </button>
        <button 
          className={`tab-btn ${rarityFilter === 'ultrarara' ? 'active' : ''}`}
          onClick={() => setRarityFilter('ultrarara')}
          style={{ fontSize: '11px', padding: '6px 12px' }}
        >
          👑 Ultra Rare
        </button>
      </div>

      {filteredCards.length > 0 ? (
        <div className="pokedex-grid">
          {filteredCards.map((card) => (
            <Card
              key={card.id}
              card={card}
              isUnlocked={unlockedCards.includes(card.id)}
              onClick={onCardClick}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <span style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }}>💨</span>
          Nessuna creatura trovata con questi filtri.
        </div>
      )}
    </div>
  );
}
