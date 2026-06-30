import React, { useState, useRef } from 'react';
import Card from './Card';
import { claimCapture } from '../firebase/db';
import { Camera, Send, X } from 'lucide-react';

export default function CardModal({ card, isUnlocked, user, onClose, onClaimSubmitted, showToast }) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!card) return null;

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedPhoto(reader.result); // Base64 data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPhoto) {
      showToast('Carica una foto prima di inviare! 📸', 'error');
      return;
    }

    try {
      setIsUploading(true);
      await claimCapture(user, card.id, selectedPhoto);
      showToast('Segnalazione inviata! Corri in chat a far approvare la tua cattura! 💬🏃‍♂️', 'success');
      setIsClaiming(false);
      setSelectedPhoto(null);
      onClaimSubmitted(); // Callback to route/refresh state
    } catch (error) {
      console.error('Errore durante claim:', error);
      showToast('Errore durante l\'invio. Riprova. ❌', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const rarityLabel = card.rarity === 'ultrarara' ? '👑 Ultra Rara' :
                      card.rarity === 'rara' ? '⭐ Rara' :
                      card.rarity === 'noncomune' ? '🟢 Non Comune' : '⚪ Comune';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Chiudi">
          <X size={18} />
        </button>

        {!isClaiming ? (
          <div className="modal-details">
            <div className="modal-card-preview">
              <Card card={card} isUnlocked={isUnlocked} />
            </div>

            <div className="modal-title-row">
              <h2>{card.name}</h2>
              <span className={`modal-card-rarity-tag rarity-badge ${card.rarity}`}>
                {rarityLabel}
              </span>
            </div>

            <div>
              <div className="modal-label">📜 Descrizione / Lore</div>
              <div className="modal-value-box">{card.description}</div>
            </div>

            <div>
              <div className="modal-label">🎯 Sfida / Obiettivo di Cattura</div>
              <div className="modal-value-box" style={{ borderColor: 'var(--primary)', color: '#d6bcfa' }}>
                {card.challenge}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <div style={{ flex: 1 }}>
                <div className="modal-label">💎 Valore Carta</div>
                <div className="modal-value-box" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {card.points} punti
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="modal-label">🔒 Stato Sblocco</div>
                <div className="modal-value-box" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {isUnlocked ? '🔓 Sbloccata!' : '🔒 Da catturare'}
                </div>
              </div>
            </div>

            {!isUnlocked && (
              <button 
                className="btn btn-primary" 
                style={{ marginTop: '16px' }}
                onClick={() => setIsClaiming(true)}
              >
                <Camera size={18} />
                Cattura Creatura 📸
              </button>
            )}
          </div>
        ) : (
          <div className="claim-form">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              📸 Segnala Cattura
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Carica una foto come prova per catturare <strong>{card.name}</strong>.
            </p>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flex: '1', flexDirection: 'column', gap: '16px' }}>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" // trigger direct mobile camera
                ref={fileInputRef}
                onChange={handlePhotoSelect}
                style={{ display: 'none' }}
              />

              <div className="camera-preview-box" onClick={triggerFileInput}>
                {selectedPhoto ? (
                  <img src={selectedPhoto} alt="Anteprima prova" className="preview-uploaded-img" />
                ) : (
                  <>
                    <Camera size={40} color="var(--primary)" />
                    <span className="camera-preview-text">
                      Scatta foto o carica file 📂
                    </span>
                  </>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  style={{ flex: 1 }}
                  onClick={() => { setIsClaiming(false); setSelectedPhoto(null); }}
                  disabled={isUploading}
                >
                  Annulla
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 2 }}
                  disabled={isUploading || !selectedPhoto}
                >
                  {isUploading ? (
                    'Invio...'
                  ) : (
                    <>
                      <Send size={16} />
                      Invia Prova 🚀
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
