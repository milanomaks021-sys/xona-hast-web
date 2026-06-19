import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/api/listings/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setListing(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
        Загрузка...
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
        <div style={{ fontSize: 16, color: '#555', marginBottom: 20 }}>Объявление не найдено</div>
        <Link href="/listings" style={{ color: '#F97316', fontWeight: 600, textDecoration: 'none' }}>
          ← Вернуться к объявлениям
        </Link>
      </div>
    );
  }

  const photos = listing.photos && listing.photos.length > 0 ? listing.photos : [];
  const dealLabel = listing.deal === 'rent' ? 'Аренда' : 'Продажа';
  const priceSomoni = listing.price_somoni ? `${Number(listing.price_somoni).toLocaleString('ru-RU')} смн` : null;
  const priceUsd = listing.price_usd ? `$${Number(listing.price_usd).toLocaleString('en-US')}` : null;

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FA' }}>
      <div style={{ background: '#0F2244', padding: '16px 20px' }}>
        <Link href="/listings" style={{ color: '#A9B6CC', fontSize: 14, textDecoration: 'none' }}>
          ← Все объявления
        </Link>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px' }}>

        {/* Фото */}
        <div style={{ background: '#E8ECF2', borderRadius: 16, height: 280, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
          {photos.length > 0 ? (
            <img src={photos[activePhoto]} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 48, opacity: 0.3 }}>🏠</span>
          )}
          {listing.vip_type && (
            <span style={{
              position: 'absolute', top: 12, left: 12,
              background: listing.vip_type === 'premium' ? '#F97316' : '#FACC15',
              color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
            }}>
              {listing.vip_type === 'premium' ? 'PREMIUM' : 'VIP'}
            </span>
          )}
        </div>

        {photos.length > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
            {photos.map((p, i) => (
              <img
                key={i}
                src={p}
                onClick={() => setActivePhoto(i)}
                style={{
                  width: 60, height: 60, objectFit: 'cover', borderRadius: 8, cursor: 'pointer',
                  border: i === activePhoto ? '2px solid #F97316' : '2px solid transparent',
                }}
              />
            ))}
          </div>
        )}

        {/* Цена и заголовок */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <span style={{ background: '#EEF2F7', color: '#0F2244', fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6 }}>
              {dealLabel}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#0F2244' }}>
              {priceSomoni || 'Цена не указана'}
            </span>
            {priceUsd && <span style={{ fontSize: 16, color: '#888' }}>{priceUsd}</span>}
          </div>
          <h1 style={{ fontSize: 18, fontFamily: 'Georgia, serif', color: '#1A1A1A', margin: 0, marginBottom: 12 }}>
            {listing.title}
          </h1>
          <div style={{ fontSize: 13, color: '#888' }}>
            📍 {[listing.district, listing.city].filter(Boolean).join(', ')}
            {listing.address && ` · ${listing.address}`}
          </div>
        </div>

        {/* Параметры */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F2244', marginBottom: 14 }}>Параметры</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {listing.rooms && <Param label="Комнат" value={listing.rooms} />}
            {listing.area_m2 && <Param label="Площадь" value={`${listing.area_m2} м²`} />}
            {listing.floor && <Param label="Этаж" value={listing.floors_total ? `${listing.floor} из ${listing.floors_total}` : listing.floor} />}
            <Param label="Просмотров" value={listing.views_count || 0} />
          </div>
        </div>

        {/* Описание */}
        {listing.description && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F2244', marginBottom: 10 }}>Описание</h2>
            <p style={{ fontSize: 14, color: '#444', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
              {listing.description}
            </p>
          </div>
        )}

        {/* Продавец */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F2244', marginBottom: 14 }}>Контакты</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0F2244', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
              {(listing.user_name || '?')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>
                {listing.user_name || 'Пользователь'}
                {listing.user_role === 'agent' && <span style={{ marginLeft: 6, fontSize: 11, color: '#16A34A' }}>Риелтор ✓</span>}
                {listing.user_role === 'developer' && <span style={{ marginLeft: 6, fontSize: 11, color: '#2563EB' }}>Застройщик</span>}
              </div>
            </div>
          </div>

          {listing.contact_phone && (
            <a href={`tel:${listing.contact_phone}`} style={{
              display: 'block', textAlign: 'center', background: '#0F2244', color: '#fff',
              padding: '14px', borderRadius: 12, fontWeight: 700, textDecoration: 'none', marginBottom: 10,
            }}>
              📞 {listing.contact_phone}
            </a>
          )}
          {listing.contact_whatsapp && (
            <a href={`https://wa.me/${listing.contact_whatsapp.replace(/[^0-9]/g, '')}`} style={{
              display: 'block', textAlign: 'center', background: '#25D366', color: '#fff',
              padding: '14px', borderRadius: 12, fontWeight: 700, textDecoration: 'none',
            }}>
              💬 Написать в WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Param({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>{value}</div>
    </div>
  );
    }
