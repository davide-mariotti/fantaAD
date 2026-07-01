import React from 'react';
import { X, Info, Camera, Users, Award, ShieldAlert } from 'lucide-react';

export default function RulesModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} color="var(--text-muted)" />
        </button>

        <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={20} color="var(--primary)" /> Regolamento Ufficiale
        </h2>

        <div style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '12px' }}>
            Benvenuto in <strong>Fanta Adiacent</strong>! Il tuo obiettivo è completare l'album fotografando le creature leggendarie dell'ufficio.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
            <Camera size={24} color="#ecc94b" style={{ flexShrink: 0 }} />
            <div>
              <strong>1. Trova e Fotografa</strong><br />
              Scegli una creatura dal Pokedex, leggi la sua "Sfida" e scatta una foto che la rappresenti perfettamente.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
            <Users size={24} color="#4299e1" style={{ flexShrink: 0 }} />
            <div>
              <strong>2. Il Giudizio della Community</strong><br />
              La tua foto verrà inviata nella Chat Globale. I tuoi colleghi dovranno votare se la foto è valida (✅) o meno (❌).
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
            <Award size={24} color="#48bb78" style={{ flexShrink: 0 }} />
            <div>
              <strong>3. Sblocco e Punti</strong><br />
              Raggiunti <strong>5 voti positivi</strong>, la creatura sarà sbloccata nel tuo album e guadagnerai i punti in palio! Se ricevi 5 voti negativi, la richiesta verrà respinta.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', background: 'rgba(229,62,62,0.1)', padding: '12px', borderRadius: '8px' }}>
            <ShieldAlert size={24} color="#f56565" style={{ flexShrink: 0 }} />
            <div style={{ color: '#feb2b2' }}>
              <strong>Attenzione allo Spam!</strong><br />
              Non inviare foto a caso o non inerenti alla sfida, altrimenti i tuoi colleghi le rifiuteranno senza pietà!
            </div>
          </div>
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '16px', width: '100%' }}>
          Ho Capito, Giochiamo! 🚀
        </button>
      </div>
    </div>
  );
}
