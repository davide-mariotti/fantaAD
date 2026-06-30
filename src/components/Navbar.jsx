import React from 'react';
import { Layers, MessageSquare, Trophy, User } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const tabs = [
    { id: 'pokedex', label: '🎴 Pokedex', icon: Layers },
    { id: 'chat', label: '💬 Chat', icon: MessageSquare },
    { id: 'leaderboard', label: '🏆 Classifica', icon: Trophy },
    { id: 'profile', label: '👤 Profilo', icon: User },
  ];

  return (
    <nav className="navbar-bottom">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = currentView === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setCurrentView(tab.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
            aria-label={tab.label}
          >
            <IconComponent 
              className="nav-icon" 
              size={26}
              color={isActive ? '#805ad5' : '#a0aec0'} 
            />
          </button>
        );
      })}
    </nav>
  );
}
