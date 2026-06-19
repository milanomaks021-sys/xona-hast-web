import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL;

const TYPES = [
  ['apartment', 'Квартира'],
  ['house', 'Дом'],
  ['office', 'Офис'],
  ['land', 'Участок'],
];

const CITIES = [
  // Душанбе
  'Душанбе',
  // РРП
  'Вахдат','Гиссар','Рогун','Турсунзаде',
  'Варзобский','Файзабадский','Рудаки (Джалолиддини Балхи)','Лахшский','Нурабадский','Раштский','Сангворский','Таджикабадский','Шахринавский','Шамсиддин-Шохин',
  // ГБАО
  'Хорог','Ванчский','Дарвазский','Ишкашимский','Мургабский','Рошткалинский','Рушанский','Шугнанский',
  // Согдийская область
  'Худжанд','Бустон','Исфара','Истаравшан','Истиклол','Канибадам','Пенджикент',
  'Айнинский','Аштский','Бободжон-Гафуровский','Деваштич','Зафарабадский','Истаравшанский','Канибадамский','Кухистони Мастчохский','Мастчинский','Пенджикентский','Спитаменский','Шахристанский',
  // Хатлонская область
  'Бохтар','Куляб','Норак','Левакант',
  'Абдурахмони Джоми','Бальджуванский','Вахшский','Восейский','Дангаринский','Дусти','Кубодиенский','Кулябский','Муминабадский','Носири Хусрав','Панджский','Темурмаликский','Фархорский','Хамадони','Хуросонский','Чиликунский','Шахритузский','Яванский',
];

export default function AddListing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'apartment',
    deal: 'sale',
    price_somoni: '',
    price_usd: '',
    rooms: '',
    area_m2: '',
    floor: '',
    floors_total: '',
    city: 'Душанбе',
    district: '',
    address: '',
    contact_phone: '',
    contact_whatsapp: '',
  });
  const [photos, setPhotos] = useState([]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 10);
    setPhotos(files);
  };

  const submit = async (e) => {
    e.preventDefault();

    const token = typeof window !== 'undefined' ? localStorage.getItem('xh_token') : null;
    if (!token) {
      toast.error('Сначала войдите в аккаунт');
      router.push('/login');
      return;
    }
    if (!form.title || !form.type || !form.deal) {
      toast.error('Заполните обязательные поля');
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      photos.forEach((file) => fd.append('photos', file));

      const res = await fetch(`${API}/api/listings`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      }).then((r) => r.json());

      setLoading(false);

      if (res.success) {
        toast.success(res.message || 'Объявление опубликовано!');
        router.push('/listings');
      } else {
        toast.error(res.message || 'Ошибка при публикации');
      }
    } catch (err) {
      setLoading(false);
      toast.error('Ошибка сети. Попробуйте снова.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FA' }}>
      <div style={{ background: '#0F2244', padding: '24px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: 26, margin: 0 }}>
          Разместить объявление
        </h1>
        <p style={{ color: '#A9B6CC', fontSize: 14, marginTop: 6 }}>
          Бесплатно на 14 дней
        </p>
      </div>

      <form onSubmit={submit} style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 60px' }}>

        <Section title="Основное">
          <Field label="Заголовок объявления *">
            <input style={input} placeholder="3-комнатная квартира в центре" value={form.title} onChange={update('title')} required />
          </Field>
          <Field label="Описание">
            <textarea style={{ ...input, height: 100, resize: 'vertical' }} placeholder="Расскажите подробнее..." value={form.description} onChange={update('description')} />
          </Field>

          <Row>
            <Field label="Тип недвижимости *">
              <select style={input} value={form.type} onChange={update('type')}>
                {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
            <Field label="Тип сделки *">
              <select style={input} value={form.deal} onChange={update('deal')}>
                <option value="sale">Продажа</option>
                <option value="rent">Аренда</option>
              </select>
            </Field>
          </Row>
        </Section>

        <Section title="Цена">
          <Row>
            <Field label="Цена, сомони">
              <input style={input} type="number" placeholder="650000" value={form.price_somoni} onChange={update('price_somoni')} />
            </Field>
            <Field label="Цена, $ (необязательно)">
              <input style={input} type="number" placeholder="58000" value={form.price_usd} onChange={update('price_usd')} />
            </Field>
          </Row>
        </Section>

        <Section title="Параметры">
          <Row>
            <Field label="Комнат">
              <input style={input} type="number" placeholder="3" value={form.rooms} onChange={update('rooms')} />
            </Field>
            <Field label="Площадь, м²">
              <input style={input} type="number" placeholder="75" value={form.area_m2} onChange={update('area_m2')} />
            </Field>
          </Row>
          <Row>
            <Field label="Этаж">
              <input style={input} type="number" placeholder="4" value={form.floor} onChange={update('floor')} />
            </Field>
            <Field label="Этажей в доме">
              <input style={input} type="number" placeholder="9" value={form.floors_total} onChange={update('floors_total')} />
            </Field>
          </Row>
        </Section>

        <Section title="Адрес">
          <Row>
            <Field label="Город / район">
              <select style={input} value={form.city} onChange={update('city')}>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Район (доп.)">
              <input style={input} placeholder="Сино" value={form.district} onChange={update('district')} />
            </Field>
          </Row>
          <Field label="Адрес">
            <input style={input} placeholder="ул. Рудаки, 25" value={form.address} onChange={update('address')} />
          </Field>
        </Section>

        <Section title="Контакты">
          <Field label="Телефон для связи">
            <input style={input} type="tel" placeholder="+992 900 12 34 56" value={form.contact_phone} onChange={update('contact_phone')} />
          </Field>
          <Field label="WhatsApp (необязательно)">
            <input style={input} type="tel" placeholder="+992 900 12 34 56" value={form.contact_whatsapp} onChange={update('contact_whatsapp')} />
          </Field>
        </Section>

        <Section title="Фотографии">
          <label style={{ ...input, display: 'block', textAlign: 'center', cursor: 'pointer', color: '#888' }}>
            📷 Выбрать фото (до 10 шт)
            <input type="file" accept="image/*" multiple onChange={handlePhotos} style={{ display: 'none' }} />
          </label>
          {photos.length > 0 && (
            <p style={{ fontSize: 13, color: '#16A34A', marginTop: 8 }}>
              ✅ Выбрано фото: {photos.length}
            </p>
          )}
        </Section>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#999' : '#F97316',
            color: '#fff',
            fontWeight: 700,
            fontSize: 17,
            padding: '16px',
            borderRadius: 12,
            border: 'none',
            marginTop: 8,
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          {loading ? 'Публикуем...' : 'Опубликовать объявление'}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0F2244', marginBottom: 14 }}>{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14, flex: 1 }}>
      <label style={{ display: 'block', fontSize: 13, color: '#555', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function Row({ children }) {
  return <div style={{ display: 'flex', gap: 12 }}>{children}</div>;
}

const input = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid #DDE3EC',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
};
