import React, { useState, useRef } from 'react';
import Card, { getRarityIcon } from './Card';
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
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.floor(height * (MAX_WIDTH / width));
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress image to JPEG to save localStorage space / Firebase bandwidth
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        setSelectedPhoto(compressedBase64);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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

  const renderRarityLabel = () => {
    const icon = getRarityIcon(card.rarity, 14);
    const text = card.rarity === 'ultrarara' ? 'Ultra Rara' :
                 card.rarity === 'rara' ? 'Rara' :
                 card.rarity === 'noncomune' ? 'Non Comune' : 'Comune';
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        {icon} {text}
      </span>
    );
  };

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

            <div className="modal-title-row" style={{ alignItems: 'center' }}>
              <h2>{card.name}</h2>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <div className="modal-label" style={{ marginBottom: 0 }}>📜 Descrizione</div>
                <span className={`modal-card-rarity-tag rarity-badge ${card.rarity}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {renderRarityLabel()}
                </span>
              </div>
              <div className="modal-value-box">{card.description}</div>
            </div>

            <div>
              <div className="modal-label">🎯 Sfida</div>
              <div className="modal-value-box" style={{ borderColor: 'var(--primary)', color: '#d6bcfa' }}>
                {card.challenge}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <div style={{ flex: 1 }}>
                <div className="modal-label" style={{ textAlign: 'center' }}>💎 Valore</div>
                <div className="modal-value-box" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {card.points} punti
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="modal-label" style={{ textAlign: 'center' }}>🔒 Stato</div>
                <div className="modal-value-box" style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {isUnlocked ? 'Sbloccata!' : 'Da catturare'}
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
                Cattura Creatura
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
                      Invia Prova
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
