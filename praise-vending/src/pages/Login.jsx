import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login() {
  const navigate = useNavigate();
  const [isTeacher, setIsTeacher] = useState(false);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    if (!nickname || !password) return alert('아이디(이름)과 비밀번호를 입력해주세요.');
    // 비밀번호 숫자 체크 (선택사항, 하지만 안내를 위해)
    if (!/^\d+$/.test(password)) return alert('비밀번호는 숫자로만 입력해주세요.');

    const email = `${nickname}@student.school.com`;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          alert(`'${nickname}' 님, 환영합니다! 계정이 생성되었습니다.`);
          navigate('/home');
        } catch (createError) {
          console.error(createError);
          alert('가입 중 오류가 발생했습니다.');
        }
      } else {
        console.error(error);
        alert('비밀번호가 틀렸거나 오류가 발생했습니다.');
      }
    }
  };

  const handleTeacherLogin = async (e) => {
    e.preventDefault();
    if (!password) return alert('비밀번호를 입력해주세요.');
    
    const email = 'teacher@school.com';
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          alert('선생님 계정이 처음으로 설정되었습니다!');
          navigate('/admin');
        } catch (createError) {
          console.error(createError);
          alert('로그인/가입 중 오류가 발생했습니다.');
        }
      } else {
        console.error(error);
        alert('비밀번호가 틀렸습니다.');
      }
    }
  };

  return (
    <div className="container animate-slide-up" style={{ maxWidth: '400px', marginTop: '80px' }}>
      <button onClick={() => navigate('/home')} style={{ marginBottom: '20px', color: '#fff' }}>← 메인으로</button>
      
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '30px', color: 'var(--color-primary-dark)' }}>로그인</h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#eee', padding: '5px', borderRadius: 'var(--radius-pill)' }}>
          <button 
            onClick={() => setIsTeacher(false)}
            style={{ 
              flex: 1, padding: '10px', borderRadius: 'var(--radius-pill)',
              background: !isTeacher ? 'white' : 'transparent',
              boxShadow: !isTeacher ? 'var(--shadow-sm)' : 'none',
              fontWeight: !isTeacher ? 'bold' : 'normal'
            }}
          >
            학생
          </button>
          <button 
            onClick={() => setIsTeacher(true)}
            style={{ 
              flex: 1, padding: '10px', borderRadius: 'var(--radius-pill)',
              background: isTeacher ? 'white' : 'transparent',
              boxShadow: isTeacher ? 'var(--shadow-sm)' : 'none',
              fontWeight: isTeacher ? 'bold' : 'normal'
            }}
          >
            선생님
          </button>
        </div>

        {!isTeacher ? (
          <form onSubmit={handleStudentLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ fontSize: '0.8rem', color: '#666' }}>* 처음 로그인하면 자동으로 계정이 만들어집니다.</p>
            <input 
              type="text" 
              placeholder="이름 (예: 홍길동)" 
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd', outline: 'none' }}
            />
            <input 
              type="password" 
              placeholder="비밀번호 (숫자)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd', outline: 'none' }}
            />
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                background: 'var(--gradient-secondary)', color: 'white', padding: '12px', 
                borderRadius: 'var(--radius-pill)', fontWeight: 'bold', marginTop: '10px' 
              }}
            >
              입장하기
            </motion.button>
          </form>
        ) : (
          <form onSubmit={handleTeacherLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>교사용 비밀번호를 입력해주세요.</p>
            <input 
              type="password" 
              placeholder="비밀번호" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid #ddd', outline: 'none' }}
            />
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                background: 'var(--color-primary-dark)', color: 'white', padding: '12px', 
                borderRadius: 'var(--radius-pill)', fontWeight: 'bold', marginTop: '10px' 
              }}
            >
              교사로 입장하기
            </motion.button>
          </form>
        )}
      </div>
    </div>
  );
}
