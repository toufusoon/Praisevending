import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, where, onSnapshot, doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { FaCog } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();
  const [praises, setPraises] = useState([]);
  const [selectedCan, setSelectedCan] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, 'praises'), where('status', '==', 'approved'));
    const unsubscribeDb = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPraises(data);
    });
    
    return () => {
      unsubscribeAuth();
      unsubscribeDb();
    };
  }, []);

  const handleLike = async (id) => {
    if (!user) {
      alert('공감하시려면 로그인이 필요합니다!');
      navigate('/login');
      return;
    }

    if (selectedCan.likedBy && selectedCan.likedBy.includes(user.uid)) {
      alert('이미 공감한 미담입니다!');
      return;
    }

    try {
      const docRef = doc(db, 'praises', id);
      await updateDoc(docRef, { 
        likes: increment(1),
        likedBy: arrayUnion(user.uid)
      });
      setSelectedCan(prev => prev ? {
        ...prev, 
        likes: (prev.likes || 0) + 1,
        likedBy: [...(prev.likedBy || []), user.uid]
      } : null);
    } catch (error) {
      console.error("공감 실패:", error);
    }
  };

  const topPraise = [...praises].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];

  return (
    <div className="container animate-slide-up" style={{ position: 'relative' }}>
      
      {/* Teacher Menu Button */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
        <button 
          onClick={() => navigate('/login')}
          style={{ 
            background: 'rgba(255,255,255,0.7)', 
            padding: '10px 15px', 
            borderRadius: 'var(--radius-pill)',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <FaCog /> 교사/학생 메뉴
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2b5e4b', textShadow: '2px 2px 4px rgba(255,255,255,0.8)' }}>
          🌸 뿅뿅 미담 자판기 🌸
        </h1>
        <p style={{ color: '#4a7c59', fontWeight: 'bold' }}>따뜻한 마음을 뽑아보세요!</p>
      </div>

      <div className="vending-machine">
        
        {/* Top Voted inside Vending Machine (like an advertisement banner) */}
        {topPraise && topPraise.likes > 0 && (
          <div style={{ 
            background: 'white', 
            padding: '10px', 
            borderRadius: '10px',
            marginBottom: '15px',
            textAlign: 'center',
            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: 'bold' }}>⭐ 베스트 미담</span>
            <div style={{ fontWeight: 'bold', color: 'var(--color-primary-dark)' }}>To. {topPraise.to}</div>
          </div>
        )}

        {/* Display Area (Shelves) */}
        <div className="vending-display">
          {praises.length === 0 ? (
             <div style={{ textAlign: 'center', color: '#555', paddingTop: '100px', zIndex: 5 }}>
               아직 미담 캔이 없습니다.
             </div>
          ) : (
            <div className="vending-shelf">
              {praises.slice(0, 5).map((praise) => (
                <motion.div
                  key={praise.id}
                  whileHover={{ scale: 1.1, y: -5 }}
                  onClick={() => setSelectedCan(praise)}
                  className="fat-can"
                  style={{ background: praise.color || '#FF6B6B' }}
                >
                  <div className="can-label">{praise.to}</div>
                </motion.div>
              ))}
            </div>
          )}
          {/* Second Shelf if many praises */}
          {praises.length > 5 && (
            <div className="vending-shelf">
              {praises.slice(5, 10).map((praise) => (
                <motion.div
                  key={praise.id}
                  whileHover={{ scale: 1.1, y: -5 }}
                  onClick={() => setSelectedCan(praise)}
                  className="fat-can"
                  style={{ background: praise.color || '#4ECDC4' }}
                >
                  <div className="can-label">{praise.to}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Lower Controls & Output */}
        <div className="vending-lower">
          <div className="vending-ad">
            PRAISE
          </div>
          
          <div className="vending-panel">
            <div className="digital-display">
              8888
            </div>
            
            <button 
              onClick={() => navigate('/write')}
              style={{ 
                background: '#FFD700', color: '#000', 
                padding: '8px', borderRadius: '5px', 
                fontWeight: 'bold', width: '100%',
                marginTop: '15px', border: '2px solid #B8860B',
                cursor: 'pointer'
              }}
            >
              미담 작성
            </button>
          </div>
        </div>

        <div className="output-container">
          <div className="output-slot">
            <div className="output-flap"></div>
          </div>
        </div>
      </div>

      {/* Selected Can Modal */}
      {selectedCan && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
          onClick={() => setSelectedCan(null)}
        >
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              padding: '40px',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '500px',
              width: '90%',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setSelectedCan(null)}
              style={{ position: 'absolute', top: '15px', right: '20px', fontSize: '1.5rem', color: '#999' }}
            >
              ✕
            </button>
            <div className="fat-can" style={{ 
              background: selectedCan.color || '#FF6B6B', 
              margin: '0 auto 20px', transform: 'scale(0.8)' 
            }}></div>
            
            <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>To. {selectedCan.to}</h2>
            <h3 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '20px' }}>
              "{selectedCan.behavior}"
            </h3>
            <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.6' }}>
              {selectedCan.message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>From. {selectedCan.from}</span>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleLike(selectedCan.id)}
                style={{ 
                  background: 'var(--color-background)', 
                  padding: '8px 16px', 
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  display: 'flex', alignItems: 'center', gap: '5px'
                }}
              >
                ❤️ {selectedCan.likes || 0} 공감하기
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
