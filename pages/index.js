import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://xona-hast-backend.onrender.com/api';

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/listings?limit=12&sort=vip_first`)
      .then(r => r.json())
      .then(d => setListings(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg,#0F2340,#1B3A6B)', minHeight: '90vh', display: 'flex', alignItems: 'center', paddingTop: 70 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', width: '100%' }}>
          <div style={{ display: 'inline-block', background: 'rgba(244,130,31,0.15)', border: '1px solid rgba(244,130,31,0.3)', borderRadius: 20, padding: '6px 16px', color: '#F4821F', fontSize: 12, fontWeight: 700, marginBottom: 24, letterSpacing: '0.06em' }}>
            🏠 НЕДВИЖИМОСТЬ ТАДЖИКИСТАНА №1
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 'clamp(32px,6vw,60px)', color: '#fff', lineHeight: 1.15, marginBottom: 16, maxWidth: 650 }}>
            Найди своё<br /><span style={{ color: '#F4821F' }}>идеальное жильё</span><br />в Таджикистане
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 17, maxWidth: 500, lineHeight: 1.7, marginBottom: 36 }}>
            Тысячи объявлений о продаже и аренде. Бесплатно разместить на 14 дней.
          </p>

          {/* ПОИСК */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 680, marginBottom: 40 }}>
            <input placeholder="🔍 Квартира, район, адрес..." style={{ flex: '1 1 200px', padding: '14px 18px', borderRadius: 10, border: 'none', fontSize: 15, outline: 'none' }} />
            <Link href="/listings" style={{ padding: '14px 28px', background: '#F4821F', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
              Найти
            </Link>
          </div>

          {/* СТАТИСТИКА */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {[['2000+','Объявлений'],['9','Городов'],['14','Дней бесплатно'],['100%','Проверено ИИ']].map(([n,l]) => (
              <div key={l}>
                <div style={{ fontWeight: 900, fontSize: 28, color: '#F4821F' }}>{n}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* КАТЕГОРИИ */}
      <div style={{ background: '#fff', padding: '48px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia,serif', fontWeight: 800, fontSize: 26, color: '#0F2340', marginBottom: 24 }}>Что вы ищете?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14 }}>
            {[
              ['🏢','Купить квартиру','/listings?type=apartment&deal=sale'],
              ['🔑','Снять квартиру','/listings?type=apartment&deal=rent'],
              ['🏠','Купить дом','/listings?type=house&deal=sale'],
              ['🏗️','Новостройки','/listings?type=new_building&deal=sale'],
              ['💼','Офис','/listings?type=office&deal=rent'],
              ['🌿','Участок','/listings?type=land&deal=sale'],
            ].map(([icon,label,href]) => (
              <Link key={label} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 12px', background: '#F7F8FA', borderRadius: 14, border: '2px solid transparent', textAlign: 'center', gap: 8, transition: 'all 0.15s', color: '#1A1A2E', fontWeight: 600, fontSize: 13 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='#F4821F'; e.currentTarget.style.background='#FFF8F3'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='#F7F8FA'; }}
              >
                <span style={{ fontSize: 30 }}>{icon}</span>{label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ОБЪЯВЛЕНИЯ */}
      <div style={{ padding: '48px 20px', background: '#F7F8FA' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Georgia,serif', fontWeight: 800, fontSize: 26, color: '#0F2340' }}>⭐ Топ объявлений</h2>
            <Link href="/listings" style={{ color: '#F4821F', fontWeight: 600, fontSize: 14 }}>Все →</Link>
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#6B7280' }}>⏳ Загружаем...</div>
          ) : listings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
              <p style={{ color: '#6B7280', marginBottom: 20 }}>Пока нет объявлений</p>
              <Link href="/add-listing" style={{ padding: '12px 24px', background: '#F4821F', color: '#fff', borderRadius: 10, fontWeight: 700 }}>+ Разместить первое</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
              {listings.map(l => (
                <Link key={l.id} href={`/listing/${l.id}`} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'block', transition: 'transform 0.2s', color: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform='none'}
                >
                  <div style={{ height: 190, background: '#E4E7ED', position: 'relative' }}>
                    {l.photos && JSON.parse(l.photos||'[]')[0] && (
                      <img src={JSON.parse(l.photos)[0]} alt={l.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                    {l.vip_type && <span style={{ position: 'absolute', top: 10, left: 10, background: l.vip_type==='premium'?'#F4821F':'#EAB308', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{l.vip_type.toUpperCase()}</span>}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: '#F4821F', marginBottom: 6 }}>
                      {l.price_somoni ? `${Number(l.price_somoni).toLocaleString()} сом` : l.price_usd ? `$${Number(l.price_usd).toLocaleString()}` : 'Договорная'}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A2E', marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{l.title}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>📍 {l.city}{l.district?`, ${l.district}`:''}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* КАК РАБОТАЕТ */}
      <div style={{ background: '#0F2340', padding: '56px 20px', color: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia,serif', fontWeight: 800, fontSize: 26, marginBottom: 48 }}>Как это <span style={{ color: '#F4821F' }}>работает?</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32 }}>
            {[
              ['📱','Регистрация','Войдите по номеру телефона. Быстро и просто.'],
              ['📸','Добавьте объявление','Загрузите фото и укажите цену. Бесплатно 14 дней.'],
              ['🤖','Проверка ИИ','Модератор проверит за 1–5 минут. Защита от мошенников.'],
              ['📢','Автопостинг','Объявление опубликуется в Telegram и Instagram.'],
            ].map(([icon,title,desc]) => (
              <div key={title}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(244,130,31,0.15)', border: '2px solid rgba(244,130,31,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 16px' }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48 }}>
            <Link href="/add-listing" style={{ padding: '15px 32px', background: '#F4821F', color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 16 }}>
              Разместить объявление бесплатно →
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#060F1E', color: 'rgba(255,255,255,0.5)', padding: '24px 20px', textAlign: 'center', fontSize: 13 }}>
        © {new Date().getFullYear()} Хона.Ҳаст.tj — Недвижимость Таджикистана · <span style={{ color: '#F4821F', fontWeight: 700 }}>Бо Ақл Биёв!</span>
      </footer>
    </div>
  );
}
