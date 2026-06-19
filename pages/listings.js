import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

const TYPES = [
  ['', 'Все типы'],
  ['apartment', 'Квартиры'],
  ['house', 'Дома'],
  ['office', 'Офисы'],
  ['land', 'Участки'],
];

const CITIES = [
  // Душанбе
  'Душанбе',
  // РРП
  'Вахдат','Гиссар','Рогун','Турсунзаде',
  'Варзобский район','Файзабадский район','Рудаки (Джалолиддини Балхи)','Лахшский район','Нурабадский район','Раштский район','Сангворский район','Таджикабадский район','Шахринавский район','Шамсиддин-Шохин район',
  // ГБАО
  'Хорог','Ванчский район','Дарвазский район','Ишкашимский район','Мургабский район','Рошткалинский район','Рушанский район','Шугнанский район',
  // Согдийская область
  'Худжанд','Бустон','Исфара','Истаравшан','Истиклол','Канибадам','Пенджикент',
  'Айнинский район','Аштский район','Бободжон-Гафуровский район','Деваштич','Зафарабадский район','Истаравшанский район','Канибадамский район','Кухистони Мастчохский район','Мастчинский район','Пенджикентский район','Спитаменский район','Шахристанский район',
  // Хатлонская область
  'Бохтар','Куляб','Норак','Левакант',
  'Абдурахмони Джоми район','Бальджуванский район','Вахшский район','Восейский район','Дангаринский район','Дусти район','Кубодиенский район','Кулябский район','Муминабадский район','Носири Хусрав район','Панджский район','Темурмаликский район','Фархорский район','Хамадони район','Хуросонский район','Чиликунский район','Шахритузский район','Яванский район',
];

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 0 });
  const [filters, setFilters] = useState({ deal: '', type: '', city: '', page: 1 });

  const fetchListings = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v); });

    fetch(`${API}/api/listings?${params.toString()}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setListings(res.data || []);
          setPagination(res.pagination || { total: 0, page: 1, pages: 0 });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FA' }}>
      <div style={{ background: '#0F2244', padding: '24px 20px' }}>
        <h1 style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: 24, margin: 0, marginBottom: 16 }}>
          Объявления
        </h1>

        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <FilterButton active={filters.deal === ''} onClick={() => updateFilter('deal', '')}>Все</FilterButton>
          <FilterButton active={filters.deal === 'sale'} onClick={() => updateFilter('deal', 'sale')}>Купить</FilterButton>
          <FilterButton active={filters.deal === 'rent'} onClick={() => updateFilter('deal', 'rent')}>Снять</FilterButton>
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          <select style={selectStyle} value={filters.type} onChange={(e) => updateFilter('type', e.target.value)}>
            {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select style={selectStyle} value={filters.city} onChange={(e) => updateFilter('city', e.target.value)}>
            <option value="">Все города</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px 60px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>Загрузка...</div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
            <div style={{ fontSize: 16, color: '#555', marginBottom: 6 }}>Объявлений не найдено</div>
            <div style={{ fontSize: 13, color: '#999', marginBottom: 20 }}>Попробуйте изменить фильтры или станьте первым</div>
            <Link href="/add-listing" style={{ display: 'inline-block', background: '#F97316', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none' }}>
              Разместить объявление
            </Link>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
              Найдено объявлений: {pagination.total}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
            </div>

            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilters((f) => ({ ...f, page: p }))}
                    style={{
                      width: 36, height: 36, borderRadius: 8, border: '1px solid #DDE3EC',
                      background: p === pagination.page ? '#0F2244' : '#fff',
                      color: p === pagination.page ? '#fff' : '#333',
                      fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ListingCard({ listing }) {
  const photo = listing.photos && listing.photos.length > 0 ? listing.photos[0] : null;
  const priceLabel = listing.price_somoni
    ? `${Number(listing.price_somoni).toLocaleString('ru-RU')} смн`
    : 'Цена не указана';

  return (
    <Link href={`/listings/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', height: '100%' }}>
        <div style={{ height: 160, background: '#E8ECF2', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {photo ? (
            <img src={photo} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 32, opacity: 0.3 }}>🏠</span>
          )}
          {listing.vip_type && (
            <span style={{
              position: 'absolute', top: 8, left: 8,
              background: listing.vip_type === 'premium' ? '#F97316' : '#FACC15',
              color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
            }}>
              {listing.vip_type === 'premium' ? 'PREMIUM' : 'VIP'}
            </span>
          )}
        </div>
        <div style={{ padding: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#0F2244', marginBottom: 4 }}>
            {priceLabel}
          </div>
          <div style={{ fontSize: 14, color: '#333', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {listing.title}
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>
            {[listing.rooms && `${listing.rooms} комн.`, listing.area_m2 && `${listing.area_m2} м²`, listing.city].filter(Boolean).join(' · ')}
          </div>
        </div>
      </div>
    </Link>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: 20,
        border: 'none',
        background: active ? '#F97316' : 'rgba(255,255,255,0.12)',
        color: '#fff',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

const selectStyle = {
  padding: '8px 12px',
  borderRadius: 10,
  border: 'none',
  fontSize: 13,
  background: 'rgba(255,255,255,0.95)',
  color: '#333',
  minWidth: 130,
};
