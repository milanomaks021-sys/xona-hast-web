import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [played, setPlayed] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    const t = setTimeout(() => setPlayed(true), 80);
    return () => clearTimeout(t);
  }, []);

  const sendCode = async (e) => {
    e.preventDefault();
    if (!phone) { toast.error('Введите номер телефона'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      }).then((r) => r.json());
      setLoading(false);
      if (res.success) {
        toast.success('Код отправлен!');
        if (res.dev_code) toast(`Тестовый код: ${res.dev_code}`, { duration: 8000, icon: '🔑' });
        setStep(2);
        setTimeout(() => inputsRef.current[0]?.focus(), 100);
      } else {
        toast.error(res.message || 'Ошибка');
      }
    } catch {
      setLoading(false);
      toast.error('Ошибка сети');
    }
  };

  const handleCodeChange = (i, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) inputsRef.current[i + 1]?.focus();
    if (next.every((c) => c !== '') && next.join('').length === 6) {
      verifyCode(next.join(''));
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      const next = text.split('');
      setCode(next);
      verifyCode(text);
    }
  };

  const verifyCode = async (fullCode) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: fullCode, name: name || undefined }),
      }).then((r) => r.json());
      setLoading(false);
      if (res.success) {
        localStorage.setItem('xh_token', res.token);
        localStorage.setItem('xh_user', JSON.stringify(res.user));
        if (res.is_new && !name) {
          setIsNew(true);
          setStep(3);
        } else {
          toast.success('Добро пожаловать!');
          router.push('/');
        }
      } else {
        toast.error(res.message || 'Неверный код');
        setCode(['', '', '', '', '', '']);
        inputsRef.current[0]?.focus();
      }
    } catch {
      setLoading(false);
      toast.error('Ошибка сети');
    }
  };

  const saveName = async (e) => {
    e.preventDefault();
    toast.success('Добро пожаловать в Хона.Ҳаст.tj!');
    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0F2244', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <div style={{ height: 180, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%', height: 36,
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.04))',
        }} />
        <HouseDragAnim played={played} />
      </div>

      <div style={{ flex: 1, background: '#F7F8FA', borderRadius: '28px 28px 0 0', padding: '32px 24px 40px', maxWidth: 420, margin: '0 auto', width: '100%' }}>

        {step === 1 && (
          <form onSubmit={sendCode}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#0F2244', margin: '0 0 6px' }}>
              Вход в Хона.Ҳаст.tj
            </h1>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 24px' }}>
              Введите номер телефона. Быстро и просто.
            </p>

            <label style={{ display: 'block', fontSize: 13, color: '#555', marginBottom: 6 }}>Номер телефона</label>
            <input
              type="tel"
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 900 123 45 67"
              style={inputStyle}
            />

            <button type="submit" disabled={loading} style={buttonStyle(loading)}>
              {loading ? 'Отправляем...' : 'Получить код'}
            </button>
          </form>
        )}

        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} style={backButtonStyle}>← Назад</button>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#0F2244', margin: '12px 0 6px' }}>
              Введите код
            </h1>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 28px' }}>
              Отправили 6-значный код на {phone}
            </p>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginBottom: 24 }} onPaste={handlePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  style={{
                    width: 46, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
                    borderRadius: 12, border: digit ? '2px solid #F97316' : '2px solid #DDE3EC',
                    background: '#fff', color: '#0F2244', outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                />
              ))}
            </div>

            {loading && <p style={{ textAlign: 'center', color: '#999', fontSize: 13 }}>Проверяем код...</p>}

            <button
              onClick={sendCode}
              style={{ display: 'block', margin: '0 auto', background: 'none', border: 'none', color: '#F97316', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Отправить код повторно
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={saveName}>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: '#0F2244', margin: '0 0 6px' }}>
              Как вас зовут?
            </h1>
            <p style={{ color: '#888', fontSize: 14, margin: '0 0 24px' }}>
              Это увидят те, кому вы пишете
            </p>

            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle(false)}>
              Готово, войти →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function HouseDragAnim({ played }) {
  return (
    <svg
      viewBox="0 0 320 180"
      style={{
        position: 'absolute', bottom: 8, left: 0, width: 220,
        transform: played ? 'translateX(0)' : 'translateX(-260px)',
        opacity: played ? 1 : 0,
        transition: 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease',
      }}
    >
      <line x1="118" y1="120" x2="170" y2="128" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />

      <g>
        <rect x="170" y="90" width="80" height="55" rx="6" fill="#fff" />
        <polygon points="165,90 210,55 255,90" fill="#F97316" />
        <rect x="195" y="112" width="22" height="33" rx="2" fill="#0F2244" />
        <rect x="178" y="100" width="14" height="14" rx="2" fill="#A9C4E8" />
        <rect x="222" y="100" width="14" height="14" rx="2" fill="#A9C4E8" />
        <circle cx="188" cy="148" r="7" fill="#0F2244" />
        <circle cx="232" cy="148" r="7" fill="#0F2244" />
      </g>

      <g style={{
        animation: played ? 'walk 0.5s ease-in-out infinite alternate' : 'none',
        transformOrigin: '100px 150px',
      }}>
        <circle cx="100" cy="98" r="10" fill="#FDBA74" />
        <rect x="92" y="108" width="16" height="28" rx="6" fill="#0F2244" />
        <line x1="94" y1="136" x2="88" y2="158" stroke="#0F2244" strokeWidth="5" strokeLinecap="round" />
        <line x1="106" y1="136" x2="112" y2="158" stroke="#0F2244" strokeWidth="5" strokeLinecap="round" />
        <line x1="108" y1="116" x2="120" y2="122" stroke="#FDBA74" strokeWidth="5" strokeLinecap="round" />
      </g>

      <style jsx>{`
        @keyframes walk {
          from { transform: translateY(0); }
          to { transform: translateY(-3px); }
        }
      `}</style>
    </svg>
  );
}

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: '1px solid #DDE3EC',
  fontSize: 16,
  outline: 'none',
  marginBottom: 20,
  boxSizing: 'border-box',
  background: '#fff',
};

const buttonStyle = (loading) => ({
  width: '100%',
  background: loading ? '#999' : '#F97316',
  color: '#fff',
  fontWeight: 700,
  fontSize: 16,
  padding: '15px',
  borderRadius: 12,
  border: 'none',
  cursor: loading ? 'default' : 'pointer',
  boxShadow: loading ? 'none' : '0 8px 16px -4px rgba(249,115,22,0.4)',
});

const backButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#888',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  padding: 0,
};
