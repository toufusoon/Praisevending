import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Gate() {
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  const guides = [
    { title: '가이드 1 활용 목적', desc: '생성형 AI를 쓰기 전, \'왜\' 쓰는지 말할 수 있어야 해요.\n생성형 AI를 사용하기 전에 \'지금 내가 왜 쓰려고 하지?\'라고 스스로 물어보세요. 생성형 AI는 내 생각을 대신해주는 게 아니라, 내 생각을 도와주는 도구임을 기억하세요.' },
    { title: '가이드 2 주도적 학습', desc: '생성형 AI에게 물어보기 전, 내 생각을 먼저 말해요.\n막막할 때 바로 생성형 AI에게 묻고 싶은 마음이 들 수 있지만, 먼저 스스로 시도해 보아야 나의 성장에 도움이 돼요.' },
    { title: '가이드 3 비판적 검증', desc: '생성형 AI가 틀릴 수 있다는 점을 알아요.\n생성형 AI는 틀린 정보를 마치 사실인 것처럼 제시하기도 하므로, 알려준 내용은 항상 \'정말 맞을까?\' 하고 한 번 더 확인하는 습관을 가져요.' },
    { title: '가이드 4 사고의 확장', desc: '생성형 AI와 함께 상상하며 내 생각을 더 크게 키워요.\n생성형 AI를 내 생각의 범위를 넓혀주는 도구로 사용해보세요. 생성형 AI의 결과물을 그대로 사용하지 않고, 나의 경험과 생각을 더하여 나만의 색깔을 담은 최종 결과물을 만들어요.' },
    { title: '가이드 5 안전과 관계', desc: '나의 정보와 비밀을 말하지 않아요.\n내가 입력한 정보는 어디에서 어떻게 사용될지 모르기 때문에 이름, 주소, 학교, 전화번호 같은 개인정보는 생성형 AI에게 알려주면 안돼요.' },
    { title: '가이드 6 투명성·윤리', desc: '생성형 AI의 도움을 받았다면 숨기지 않고 정직하게 이야기해요.\n어느 부분이 생성형 AI의 것이고 어느 부분이 나의 것인지 명확히 밝히는 것은 나 자신을 속이지 않는 정직한 태도예요.' },
  ];

  const handleEnter = () => {
    if (isChecked) {
      navigate('/home');
    } else {
      alert('윤리 핵심가이드 실천에 동의해주세요!');
    }
  };

  return (
    <div className="container animate-slide-up" style={{ maxWidth: '800px', marginTop: '40px', marginBottom: '40px' }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'var(--color-primary-dark)' }}>
          📚 윤리 핵심가이드
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
          {guides.map((guide, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              background: 'white', 
              borderRadius: 'var(--radius-sm)', 
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ 
                background: 'var(--color-accent)', 
                padding: '20px', 
                width: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {guide.title}
              </div>
              <div style={{ padding: '20px', flex: 1, whiteSpace: 'pre-line' }}>
                {guide.desc}
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          padding: '20px', 
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', cursor: 'pointer', marginBottom: '20px' }}>
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              나는 윤리 핵심가이드를 빠짐없이 읽고 이를 실천하겠습니다.
            </span>
          </label>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
            style={{ 
              background: isChecked ? 'var(--gradient-primary)' : '#ccc', 
              color: 'white', 
              padding: '15px 40px', 
              borderRadius: 'var(--radius-pill)',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: isChecked ? 'pointer' : 'not-allowed',
              boxShadow: isChecked ? 'var(--shadow-glow)' : 'none',
              transition: 'background 0.3s'
            }}
          >
            동의하고 입장하기
          </motion.button>
        </div>
      </div>
    </div>
  );
}
