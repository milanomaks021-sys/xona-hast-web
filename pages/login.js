import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://xona-hast-backend.onrender.com/api';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (phone.length < 9) { toast.error('Введите номер'); return; }
    setLoading(true);
    const res = await fetch(`${API}/auth/send-code`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+992' + phone.replace(/\D/g,'') })
    }).then(r => r.json());
    setLoading(false);
    if (res.success) { toast.success('SMS отправлен!'); setStep(2); if (res.dev_code) toast(`Код: ${res.dev_code}`, { icon: '🔧', duration: 15000 }); }
    else toast.error(res.message);
  };

  const verifyCode = async () => {
    setLoading(true);
    const res = await fetch(`${API}/auth/verify-code`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+992' + phone.replace(/\D/g,''), code, name })
    }).then(r => r.json());
    setLoading(false);
    if (res.success) {
      localStorage.setItem('xh_token', res.token);
      localStorage.setItem('xh_user', JSON.stringify(res.user));
      toast.success('Добро пожаловать!');
      router.push('/');
    } else toast.error(res.message);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0F2340,#1B3A6B)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '36px 28px', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏠</div>
          <div style={{ fontFamily: 'Georgia,serif', fontWeight: 800, fontSize: 22, color: '#0F2340' }}>Хона.<span style={{ color: '#F4821F' }}>Ҳаст</span>.tj</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>Войти или зарегистрироваться</div>
        </div>

        {step === 1 && (
          <>
            <div style={{ display: 'flex', border: '1.5px solid #E4E7ED', borderRadius: 10, overflow: 'hidden', marginBottom: 16 }}>
              <span style={{ padding: '12px 14px', background: '#F7F8FA', fontWeight: 700, fontSize: 14, borderRight: '1.5px solid #E4E7ED', whiteSpace: 'nowrap' }}>🇹🇯 +992</span>
              <input type="tel" placeholder="XX XXX XXXX" value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1, padding: '12px 14px', border: 'none', outline: 'none', fontSize: 16 }} />
            </div>
            <button onClick={sendCode} disabled={loading} style={{ width: '100%', padding: '13px', background: '#F4821F', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
              {loading ? '...' : 'Получить SMS-код'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input placeholder="6-значный код из SMS" value={code} onChange={e => setCode(e.target.value)} maxLength={6} style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #E4E7ED', borderRadius: 10, fontSize: 20, textAlign: 'center', letterSpacing: '0.3em', outline: 'none', marginBottom: 12, fontWeight: 700 }} />
            <input placeholder="Ваше имя (необязательно)" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '13px 16px', border: '1.5px solid #E4E7ED', borderRadius: 10, fontSize: 15, outline: 'none', marginBottom: 16 }} />
            <button onClick={verifyCode} disabled={loading || code.length < 6} style={{ width: '100%', padding: '13px', background: code.length >= 6 ? '#F4821F' : '#E4E7ED', color: code.length >= 6 ? '#fff' : '#9CA3AF', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: code.length >= 6 ? 'pointer' : 'default' }}>
              {loading ? '...' : 'Войти'}
            </button>
            <button onClick={() => setStep(1)} style={{ width: '100%', padding: '10px', background: 'none', border: 'none', color: '#6B7280', fontSize: 13, marginTop: 8, cursor: 'pointer' }}>← Изменить номер</button>
          </>
        )}
      </div>
    </div>
  );
}
