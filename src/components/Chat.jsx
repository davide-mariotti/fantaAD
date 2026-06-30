import React, { useState, useEffect, useRef } from 'react';
import { 
  listenToMessages, 
  sendTextMessage, 
  voteOnClaim, 
  simulateApprovals,
  claimCapture
} from '../firebase/db';
import { isDemoMode } from '../firebase/config';
import { Send, Image, Check, X, ShieldCheck } from 'lucide-react';

export default function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Subscribe to real-time chat updates
  useEffect(() => {
    const unsubscribe = listenToMessages((data) => {
      setMessages(data);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    
    try {
      await sendTextMessage(user, inputVal.trim());
      setInputVal('');
    } catch (error) {
      console.error('Errore invio testo:', error);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Sending a normal image chat message can be represented as a text-claim style message with an imageUrl
          // To implement this, we can reuse claimCapture but with a special identifier, or send text message
          // Let's implement sending a normal image as a special text message that carries an image.
          // For simplicity, let's post it in the db. In db.js we support imageUrl for claims.
          // Let's adapt client-side send message to accept files. 
          // We can call sendTextMessage or write a direct message object to simulate normal photo sharing.
          // Let's send a claim but with a null cardId or type 'photo'.
          // Let's implement photo message directly in client-side db layer since we're using a single database list.
          // To support this, let's create a custom message with type 'photo'.
          // Let's check how we handle it in Firestore/LocalStorage. In db.js, sendTextMessage only takes (user, text).
          // We can write a custom helper here or simply send the photo as a Base64 string / Storage URL inside a text message.
          // Let's do it by sending a claim capture with cardId = 'photo_share' or simply posting to messages.
          // Let's make a mock file upload message helper:
          await sendPhotoMessage(user, reader.result);
        } catch (err) {
          console.error(err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sendPhotoMessage = async (user, base64Data) => {
    // In demo mode we write directly, in firebase we write to messages collection
    const messageData = {
      text: '📷 Ha condiviso una foto in chat',
      type: 'photo',
      imageUrl: base64Data,
      senderId: user.uid,
      senderName: user.displayName,
      senderPhoto: user.photoURL,
      timestamp: Date.now()
    };

    if (isDemoMode) {
      const msgs = JSON.parse(localStorage.getItem('fanta_adiacent_messages') || '[]');
      messageData.id = 'photo_' + Date.now();
      msgs.push(messageData);
      localStorage.setItem('fanta_adiacent_messages', JSON.stringify(msgs));
      // Trigger listeners manually
      const event = new Event('storage');
      window.dispatchEvent(event);
      // Call listener manually for reactive UI update
      window.location.reload; // simple reload fallback or trigger local pubsub
      // Since local listeners are running, let's trigger them
      const customEvent = new CustomEvent('fanta_db_update', { detail: 'messages' });
      window.dispatchEvent(customEvent);
    } else {
      // In firebase we can add this directly to messages collection
      const { db } = await import('../firebase/config');
      const { collection, addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'messages'), messageData);
    }
  };

  // Listen to custom local storage event updates to reload local state reactively
  useEffect(() => {
    if (isDemoMode) {
      const handleLocalUpdate = () => {
        const msgs = JSON.parse(localStorage.getItem('fanta_adiacent_messages') || '[]');
        setMessages(msgs);
      };
      window.addEventListener('fanta_db_update', handleLocalUpdate);
      return () => window.removeEventListener('fanta_db_update', handleLocalUpdate);
    }
  }, []);

  const handleVote = async (messageId, voteType) => {
    try {
      await voteOnClaim(user, messageId, voteType);
      if (isDemoMode) {
        // Trigger local listeners
        window.dispatchEvent(new CustomEvent('fanta_db_update'));
      }
    } catch (error) {
      console.error('Errore durante voto:', error);
    }
  };

  const handleSimulateUnlock = async (messageId) => {
    try {
      await simulateApprovals(messageId);
      window.dispatchEvent(new CustomEvent('fanta_db_update'));
    } catch (error) {
      console.error('Errore durante sblocco simulato:', error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          💬 Chat di Gruppo Adiacent
        </h2>
        {isDemoMode && (
          <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '20px' }}>
            ⚡ Demo Mode Active
          </span>
        )}
      </div>

      <div className="chat-messages">
        {messages.map((msg) => {
          if (msg.type === 'system') {
            return (
              <div key={msg.id || msg.timestamp} className="chat-system-message">
                {msg.text}
              </div>
            );
          }

          if (msg.type === 'claim') {
            const hasApproved = msg.approvals?.includes(user.uid);
            const hasRejected = msg.rejections?.includes(user.uid);
            const totalApprovals = msg.approvals?.length || 0;
            const progressPercent = Math.min((totalApprovals / 5) * 100, 100);

            return (
              <div key={msg.id} className="claim-card-block">
                <div className="claim-header">
                  <span className="claim-title">📸 Cattura Richiesta!</span>
                  <span className={`claim-rarity-badge rarity-badge ${msg.cardRarity}`}>
                    {msg.cardRarity === 'ultrarara' ? '👑 Ultra Rara' :
                     msg.cardRarity === 'rara' ? '⭐ Rara' :
                     msg.cardRarity === 'noncomune' ? '🟢 Non Comune' : '⚪ Comune'}
                  </span>
                </div>
                <img 
                  src={msg.imageUrl} 
                  alt="Proof of Capture" 
                  className="claim-proof-img" 
                />
                <div className="claim-body">
                  <div className="claim-info-text">
                    <strong>@{msg.senderName}</strong> afferma di aver trovato la creatura: <br />
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{msg.cardName}</span>
                  </div>

                  <div className="claim-progress-bar-container">
                    <div 
                      className="claim-progress-bar" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <span>Approvazioni: <strong>{totalApprovals}/5</strong></span>
                    <span>Status: <strong>{msg.status.toUpperCase()}</strong></span>
                  </div>

                  {msg.status === 'pending' ? (
                    <div className="claim-vote-row">
                      <button 
                        className={`btn-vote approve ${hasApproved ? 'active' : ''}`}
                        onClick={() => handleVote(msg.id, 'approve')}
                      >
                        <Check size={16} />
                        🟢 Approva ({totalApprovals})
                      </button>
                      <button 
                        className={`btn-vote reject ${hasRejected ? 'active' : ''}`}
                        onClick={() => handleVote(msg.id, 'reject')}
                      >
                        <X size={16} />
                        🔴 Falso ({msg.rejections?.length || 0})
                      </button>
                    </div>
                  ) : (
                    <div className={`claim-status-banner ${msg.status}`}>
                      {msg.status === 'approved' ? '🟢 Cattura Approvata & Sbloccata! 🔓' : '🔴 Cattura Respinta (Falso) 🔒'}
                    </div>
                  )}

                  {isDemoMode && msg.status === 'pending' && (
                    <button 
                      className="btn-simulate"
                      onClick={() => handleSimulateUnlock(msg.id)}
                    >
                      <ShieldCheck size={12} style={{ marginRight: '4px' }} />
                      Simula Sblocco Immediato (+5 Voti)
                    </button>
                  )}
                </div>
              </div>
            );
          }

          if (msg.type === 'photo') {
            const isMe = msg.senderId === user.uid;
            return (
              <div 
                key={msg.id || msg.timestamp} 
                className={`chat-bubble ${isMe ? 'sent' : 'received'}`}
              >
                <span className="bubble-sender">@{msg.senderName}</span>
                <div className="bubble-inner" style={{ padding: '6px' }}>
                  <img 
                    src={msg.imageUrl} 
                    alt="shared" 
                    style={{ width: '100%', borderRadius: '12px', display: 'block', maxHeight: '200px', objectFit: 'cover' }}
                  />
                  <div style={{ fontSize: '11px', marginTop: '6px', color: 'rgba(255,255,255,0.7)', padding: '0 4px' }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          }

          const isMe = msg.senderId === user.uid;
          return (
            <div 
              key={msg.id || msg.timestamp} 
              className={`chat-bubble ${isMe ? 'sent' : 'received'}`}
            >
              <span className="bubble-sender">@{msg.senderName}</span>
              <div className="bubble-inner">
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendText} className="chat-input-panel">
        <input 
          type="file" 
          accept="image/*"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          style={{ display: 'none' }}
        />
        <button 
          type="button" 
          className="chat-btn-icon"
          onClick={() => fileInputRef.current.click()}
          aria-label="Invia foto"
        >
          <Image size={20} />
        </button>
        <input
          type="text"
          placeholder="Scrivi qualcosa in chat..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="chat-input"
        />
        <button type="submit" className="chat-btn-send" aria-label="Invia messaggio">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
