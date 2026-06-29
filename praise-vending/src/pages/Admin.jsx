import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';

export default function Admin() {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const fetchPending = async () => {
    try {
      const q = query(collection(db, 'praises'), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate().toLocaleDateString() || '방금 전'
      }));
      setPending(data);
    } catch (error) {
      console.error("미담 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 교사인지 확인 (이메일로 판별)
        if (user.email === 'teacher@school.com') {
          setIsAuthorized(true);
          fetchPending();
        } else {
          alert('선생님만 접근할 수 있는 페이지입니다.');
          navigate('/home');
        }
      } else {
        alert('로그인이 필요합니다.');
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleAction = async (id, actionType) => {
    try {
      const docRef = doc(db, 'praises', id);
      if (actionType === 'approve') {
        await updateDoc(docRef, { status: 'approved' });
      } else if (actionType === 'reject') {
        await deleteDoc(docRef); // 거절된 미담은 삭제
      }
      // 리스트에서 제거
      setPending(pending.filter(p => p.id !== id));
    } catch (error) {
      console.error("처리 실패:", error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container animate-slide-up" style={{ marginTop: '40px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: 'var(--color-primary-dark)' }}>👩‍🏫 교사 검수 페이지</h2>
        <button 
          onClick={() => navigate('/')}
          style={{ background: '#eee', padding: '8px 16px', borderRadius: 'var(--radius-pill)' }}
        >
          자판기로 돌아가기
        </button>
      </header>

      <div style={{ display: 'grid', gap: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
        ) : pending.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: 'var(--color-text-muted)' }}>
            대기 중인 미담이 없습니다.
          </div>
        ) : (
          pending.map(praise => (
            <div key={praise.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                <span>From. {praise.from} → To. {praise.to}</span>
                <span>{praise.date}</span>
              </div>
              <div>
                <strong>행동:</strong> {praise.behavior}
              </div>
              <div>
                <strong>한마디:</strong> {praise.message}
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  onClick={() => handleAction(praise.id, 'approve')}
                  style={{ flex: 1, background: 'var(--color-secondary)', color: 'white', padding: '10px', borderRadius: 'var(--radius-sm)' }}
                >
                  ✅ 승인 (자판기 표시)
                </button>
                <button 
                  onClick={() => handleAction(praise.id, 'reject')}
                  style={{ flex: 1, background: '#FF6B6B', color: 'white', padding: '10px', borderRadius: 'var(--radius-sm)' }}
                >
                  🚫 거절 (비방/장난)
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
