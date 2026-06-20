import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

const CATEGORIES = [
  ['🏢', 'Купить квартиру', '/listings?deal=sale&type=apartment'],
  ['🔑', 'Снять квартиру', '/listings?deal=rent&type=apartment'],
  ['🏡', 'Купить дом', '/listings?deal=sale&type=house'],
  ['🏗️', 'Новостройки', '/listings?type=apartment&new=1'],
  ['💼', 'Офис', '/listings?type=office'],
  ['🌿', 'Участок', '/listings?type=land'],
];

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API}/api/listings?limit=8`)
      .then((r) => r.json())
      .then((res) => { if (res.success) setListings(res.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FA', fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(160deg, #0F2244 0%, #16305E 55%, #1A3A6E 100%)',
        padding: '56px 20px 64px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -80, right: -60, width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(249,115,22,0.18), transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-block', background: 'rgba(249,115,22,0.14)', color: '#FDBA74',
            border: '1px solid rgba(249,115,22,0.3)', fontSize: 12, fontWeight: 700,
            letterSpacing: '0.04em', padding: '6px 14px', borderRadius: 30, marginBottom: 20,
          }}>
            🏠 НЕДВИЖИМОСТЬ ТАДЖИКИСТАНА №1
          </span>

          <h1 style={{
            fontFamily: 'Georgia, serif', color: '#fff', fontSize: 'clamp(32px, 7vw, 44px)',
            lineHeight: 1.15, margin: '0 0 14px',
          }}>
            Найди своё <span style={{ color: '#F97316' }}>идеальное жильё</span><br />в Таджикистане
          </h1>

          <p style={{ color: '#A9B6CC', fontSize: 15, lineHeight: 1.6, margin: '0 0 28px', maxWidth: 480 }}>
            Тысячи объявлений о продаже и аренде. Размести своё бесплатно на 14 дней.
          </p>

          <div style={{
            background: '#fff', borderRadius: 16, padding: 8, display: 'flex', gap: 8,
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)',
          }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Квартира, район, адрес…"
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, padding: '10px 12px', color: '#1A1A1A' }}
            />
            <Link
              href={`/listings${search ? `?search=${encodeURIComponent(search)}` : ''}`}
              style={{
                background: '#F97316', color: '#fff', fontWeight: 700, fontSize: 14,
                padding: '12px 24px', borderRadius: 10, textDecoration: 'none',
                display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
                boxShadow: '0 8px 16px -4px rgba(249,115,22,0.5)',
              }}
            >
              Найти
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 28, marginTop: 32, flexWrap: 'wrap' }}>
            <Stat value="2000+" label="Объявлений" />
            <Stat value="9" label="Городов" />
            <Stat value="14" label="Дней бесплатно" />
            <Stat value="100%" label="Проверено ИИ" />
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#0F2244', margin: '0 0 18px' }}>
          Что вы ищете?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
          {CATEGORIES.map(([icon, label, href]) => (
            <CategoryCard key={label} icon={icon} label={label} href={href} />
          ))}
        </div>
      </section>

      <section style={{ padding: '8px 20px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, color: '#0F2244', margin: 0 }}>
            ⭐ Топ объявлений
          </h2>
          <Link href="/listings" style={{ color: '#F97316', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Все →
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>Загрузка...</div>
        ) : listings.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
            {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>

      <section style={{ background: '#0F2244', padding: '48px 20px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 38, marginBottom: 12 }}>📸</div>
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#fff', fontSize: 24, margin: '0 0 8px' }}>
            Добавьте объявление
          </h2>
          <p style={{ color: '#A9B6CC', fontSize: 14, margin: '0 0 24px' }}>
            Загрузите фото и укажите цену. Бесплатно 14 дней — без скрытых платежей.
          </p>
          <Link href="/add-listing" style={{
            display: 'inline-block', background: '#F97316', color: '#fff', fontWeight: 700,
            fontSize: 16, padding: '16px 36px', borderRadius: 12, textDecoration: 'none',
            boxShadow: '0 12px 24px -6px rgba(249,115,22,0.5)',
          }}>
            Разместить объявление бесплатно →
          </Link>
        </div>
      </section>

      <footer style={{ background: '#0A1830', padding: '24px 20px', textAlign: 'center' }}>
        <p style={{ color: '#5C6B85', fontSize: 13, margin: 0 }}>
          © {new Date().getFullYear()} Хона.Ҳаст.tj — Недвижимость Таджикистана · <span style={{ color: '#F97316', fontWeight: 600 }}>Бо ақл биёв!</span>
        </p>
      </footer>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div style={{ color: '#F97316', fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ color: '#7C8BA8', fontSize: 12, marginTop: 4 }}>{label}</div>
    </div>
  );
}

function CategoryCard({ icon, label, href }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textDecoration: 'none', background: '#fff', borderRadius: 16, padding: '22px 14px',
        textAlign: 'center', transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        transform: hover ? 'translateY(-4px) scale(1.02)' : 'none',
        boxShadow: hover
          ? '0 16px 28px -8px rgba(15,34,68,0.18)'
          : '0 2px 8px -2px rgba(15,34,68,0.08)',
      }}
    >
      <div style={{ fontSize: 30, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{label}</div>
    </Link>
  );
}

function ListingCard({ listing }) {
  const [hover, setHover] = useState(false);
  const photo = listing.photos && listing.photos.length > 0 ? listing.photos[0] : null;
  const priceLabel = listing.price_somoni
    ? `${Number(listing.price_somoni).toLocaleString('ru-RU')} смн`
    : 'Цена не указана';

  return (
    <Link
      href={`/listings/${listing.id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textDecoration: 'none', color: 'inherit', background: '#fff', borderRadius: 16,
        overflow: 'hidden', display: 'block', transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        transform: hover ? 'translateY(-6px)' : 'none',
        boxShadow: hover
          ? '0 20px 32px -10px rgba(15,34,68,0.22)'
          : '0 2px 10px -4px rgba(15,34,68,0.1)',
      }}
    >
      <div style={{ height: 140, background: '#E8ECF2', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {photo ? (
          <img src={photo} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 28, opacity: 0.3 }}>🏠</span>
        )}
        {listing.vip_type && (
          <span style={{
            position: 'absolute', top: 8, left: 8,
            background: listing.vip_type === 'premium' ? '#F97316' : '#FACC15',
            color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
          }}>
            {listing.vip_type === 'premium' ? 'PREMIUM' : 'VIP'}
          </span>
        )}
      </div>
      <div style={{ padding: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: '#0F2244' }}>{priceLabel}</div>
        <div style={{ fontSize: 13, color: '#444', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {listing.title}
        </div>
        <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>
          {[listing.rooms && `${listing.rooms} комн.`, listing.city].filter(Boolean).join(' · ')}
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: '48px 20px', background: '#fff', borderRadius: 16,
      boxShadow: '0 2px 10px -4px rgba(15,34,68,0.08)',
    }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>🏠</div>
      <div style={{ fontSize: 15, color: '#555', marginBottom: 4 }}>Пока нет объявлений</div>
      <div style={{ fontSize: 13, color: '#999' }}>Станьте первым, кто разместит объявление</div>
    </div>
  );
}
