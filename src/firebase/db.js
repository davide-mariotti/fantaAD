import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  setDoc, 
  getDoc,
  getDocs 
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage, isDemoMode, INITIAL_CARDS } from './config';

// --- Local Storage Database Mock for DEMO Mode ---
const LOCAL_USERS_KEY = 'fanta_adiacent_users';
const LOCAL_MESSAGES_KEY = 'fanta_adiacent_messages';

// Helper to get local data
const getLocalUsers = () => {
  const users = localStorage.getItem(LOCAL_USERS_KEY);
  return users ? JSON.parse(users) : {};
};

const getLocalMessages = () => {
  const msgs = localStorage.getItem(LOCAL_MESSAGES_KEY);
  if (!msgs) {
    // Initial system seed message
    const initialSeed = [
      {
        id: 'welcome_system',
        text: '👋 Benvenuto in Fanta Adiacent! Cattura le creature in ufficio, carica le foto e sblocca le carte leggendarie. 🚀',
        type: 'system',
        timestamp: Date.now() - 3600000,
        senderName: 'System'
      }
    ];
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(initialSeed));
    return initialSeed;
  }
  return JSON.parse(msgs);
};

// Save helpers
const saveLocalUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  triggerLocalListeners('users');
};

const saveLocalMessages = (msgs) => {
  localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(msgs));
  triggerLocalListeners('messages');
};

// Simple event pub/sub for local updates
const localListeners = {
  messages: [],
  users: []
};

const triggerLocalListeners = (type) => {
  const data = type === 'messages' ? getLocalMessages() : Object.values(getLocalUsers());
  localListeners[type].forEach(callback => callback(data));
};


// --- DATABASE INTERFACE FUNCTIONS ---

/**
 * Register or update a user profile when they login.
 */
export const registerUser = async (user) => {
  if (isDemoMode) {
    const users = getLocalUsers();
    if (!users[user.uid]) {
      users[user.uid] = {
        uid: user.uid,
        displayName: user.displayName || 'Giocatore Anonimo',
        email: user.email || '',
        photoURL: user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.displayName}`,
        score: 0,
        unlockedCards: []
      };
      saveLocalUsers(users);
    }
    return users[user.uid];
  } else {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      const newUser = {
        uid: user.uid,
        displayName: user.displayName || 'Giocatore Anonimo',
        email: user.email || '',
        photoURL: user.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.displayName}`,
        score: 0,
        unlockedCards: []
      };
      await setDoc(userRef, newUser);
      return newUser;
    }
    return userDoc.data();
  }
};

/**
 * Get a specific user profile
 */
export const getUserProfile = async (uid) => {
  if (isDemoMode) {
    const users = getLocalUsers();
    return users[uid] || null;
  } else {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  }
};

/**
 * Listen to chat messages in real time.
 */
export const listenToMessages = (callback) => {
  if (isDemoMode) {
    localListeners.messages.push(callback);
    // Initial call
    callback(getLocalMessages());
    return () => {
      localListeners.messages = localListeners.messages.filter(cb => cb !== callback);
    };
  } else {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      callback(messages);
    });
  }
};

/**
 * Listen to all users to display on the leaderboard in real time.
 */
export const listenToUsers = (callback) => {
  if (isDemoMode) {
    localListeners.users.push(callback);
    // Initial call
    callback(Object.values(getLocalUsers()));
    return () => {
      localListeners.users = localListeners.users.filter(cb => cb !== callback);
    };
  } else {
    const q = query(collection(db, 'users'), orderBy('score', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        users.push(doc.data());
      });
      callback(users);
    });
  }
};

/**
 * Send a simple text message in chat.
 */
export const sendTextMessage = async (user, text) => {
  const messageData = {
    text,
    type: 'text',
    senderId: user.uid,
    senderName: user.displayName,
    senderPhoto: user.photoURL,
    timestamp: Date.now()
  };

  if (isDemoMode) {
    const msgs = getLocalMessages();
    messageData.id = 'msg_' + Date.now() + Math.random().toString(36).substr(2, 5);
    msgs.push(messageData);
    saveLocalMessages(msgs);
  } else {
    await addDoc(collection(db, 'messages'), messageData);
  }
};

/**
 * Submit a Card Capture Claim.
 * Photo data is uploaded as Base64 in Demo Mode, or saved to Storage in production.
 */
export const claimCapture = async (user, cardId, photoBase64) => {
  const card = INITIAL_CARDS.find(c => c.id === cardId);
  if (!card) return;

  let imageUrl = '';

  if (isDemoMode) {
    imageUrl = photoBase64; // local base64 preview is used as the storage URL
  } else {
    // Upload image to Firebase Storage
    const imagePath = `claims/${user.uid}_${cardId}_${Date.now()}.png`;
    const storageRef = ref(storage, imagePath);
    await uploadString(storageRef, photoBase64, 'data_url');
    imageUrl = await getDownloadURL(storageRef);
  }

  const claimMessage = {
    type: 'claim',
    senderId: user.uid,
    senderName: user.displayName,
    senderPhoto: user.photoURL,
    timestamp: Date.now(),
    cardId: card.id,
    cardName: card.name,
    cardPoints: card.points,
    cardRarity: card.rarity,
    imageUrl: imageUrl,
    approvals: [], // user IDs who voted yes
    rejections: [], // user IDs who voted no
    status: 'pending' // pending, approved, rejected
  };

  if (isDemoMode) {
    const msgs = getLocalMessages();
    claimMessage.id = 'claim_' + Date.now() + Math.random().toString(36).substr(2, 5);
    msgs.push(claimMessage);
    saveLocalMessages(msgs);
  } else {
    await addDoc(collection(db, 'messages'), claimMessage);
  }
};

/**
 * Vote on a claim.
 * Approving (voteType = 'approve') or rejecting (voteType = 'reject').
 * If user already voted this type, removes vote (toggle).
 * If user voted opposite, moves vote.
 * If approvals reach 5: triggers unlock and awards points.
 */
export const voteOnClaim = async (user, messageId, voteType) => {
  const userId = user.uid;

  if (isDemoMode) {
    const msgs = getLocalMessages();
    const messageIndex = msgs.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const msg = msgs[messageIndex];
    if (msg.status !== 'pending') return; // Voting is closed

    // Initialize lists if empty
    if (!msg.approvals) msg.approvals = [];
    if (!msg.rejections) msg.rejections = [];

    // Apply strict non-retractable voting rules (no toggles, no mind-changing)
    if (msg.approvals.includes(userId) || msg.rejections.includes(userId)) {
      return; // Vote is locked and final!
    }

    if (voteType === 'approve') {
      msg.approvals.push(userId);
    } else if (voteType === 'reject') {
      msg.rejections.push(userId);
    }
  
    // Check if approved (>= 5 approvals)
    if (msg.approvals.length >= 5) {
      await unlockCardDemo(msg.senderId, msg.cardId, msg.cardName, msg.cardPoints);
      msg.status = 'approved';
    } else if (msg.rejections.length >= 5) {
      msg.status = 'rejected';
    }

    saveLocalMessages(msgs);
  } else {
    // Real Firebase Voting Workflow
    const messageRef = doc(db, 'messages', messageId);
    const messageSnap = await getDoc(messageRef);
    if (!messageSnap.exists()) return;

    const msg = messageSnap.data();
    if (msg.status !== 'pending') return;

    let approvals = msg.approvals || [];
    let rejections = msg.rejections || [];

    // Apply strict non-retractable voting rules in production
    if (approvals.includes(userId) || rejections.includes(userId)) {
      return; // Vote is locked and final!
    }

    if (voteType === 'approve') {
      approvals.push(userId);
    } else if (voteType === 'reject') {
      rejections.push(userId);
    }

    const updates = { approvals, rejections };

    if (approvals.length >= 5) {
      updates.status = 'approved';
      await unlockCardFirebase(msg.senderId, msg.cardId, msg.cardName, msg.cardPoints);
    } else if (rejections.length >= 5) {
      updates.status = 'rejected';
    }

    await updateDoc(messageRef, updates);
  }
};

/**
 * Developer helper tool to quickly trigger 5 votes for local testing.
 */
export const simulateApprovals = async (claimId) => {
  if (!isDemoMode) return;
  const msgs = getLocalMessages();
  const index = msgs.findIndex(m => m.id === claimId);
  if (index === -1) return;

  const msg = msgs[index];
  if (msg.status !== 'pending') return;

  // Add 5 mock approvals
  msg.approvals = ['mock_user_1', 'mock_user_2', 'mock_user_3', 'mock_user_4', 'mock_user_5'];
  msg.rejections = [];
  msg.status = 'approved';

  await unlockCardDemo(msg.senderId, msg.cardId, msg.cardName, msg.cardPoints);
  saveLocalMessages(msgs);
};

// --- PRIVATE HELPERS FOR UNLOCKING CARDS AND ADDING SYSTEM MESSAGES ---

const unlockCardDemo = async (userId, cardId, cardName, cardPoints) => {
  const users = getLocalUsers();
  const user = users[userId];
  if (!user) return;

  // Ensure card not already unlocked
  if (!user.unlockedCards.includes(cardId)) {
    user.unlockedCards.push(cardId);
    user.score += cardPoints;
    saveLocalUsers(users);

    // Append system message celebration
    const msgs = getLocalMessages();
    msgs.push({
      id: 'system_unlock_' + Date.now(),
      text: `🎉 COMPLIMENTI! @${user.displayName} ha sbloccato la carta ${cardName} guadagnando +${cardPoints} punti! 🏆`,
      type: 'system',
      timestamp: Date.now(),
      senderName: 'System'
    });
    saveLocalMessages(msgs);
  }
};

const unlockCardFirebase = async (userId, cardId, cardName, cardPoints) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const userData = userSnap.data();
  const unlockedCards = userData.unlockedCards || [];

  if (!unlockedCards.includes(cardId)) {
    unlockedCards.push(cardId);
    const newScore = (userData.score || 0) + cardPoints;

    await updateDoc(userRef, {
      unlockedCards,
      score: newScore
    });

    // Add celebration message to chat
    await addDoc(collection(db, 'messages'), {
      text: `🎉 COMPLIMENTI! @${userData.displayName} ha sbloccato la carta ${cardName} guadagnando +${cardPoints} punti! 🏆`,
      type: 'system',
      senderName: 'System',
      timestamp: Date.now()
    });
  }
};
