import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Gate from './pages/Gate';
import Home from './pages/Home';
import Write from './pages/Write';
import Login from './pages/Login';
import Admin from './pages/Admin';

const Privacy = () => <div className="container"><h2>개인정보처리방침 (준비중)</h2></div>;
const Terms = () => <div className="container"><h2>이용약관 (준비중)</h2></div>;

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Gate />} />
            <Route path="/home" element={<Home />} />
            <Route path="/write" element={<Write />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        
        <footer style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)' }}>
          <p>서울강서초등학교 / 이지민</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px', fontSize: '0.9rem' }}>
            <a href="/privacy" style={{ textDecoration: 'underline' }}>개인정보처리방침</a>
            <a href="/terms" style={{ textDecoration: 'underline' }}>이용약관</a>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
