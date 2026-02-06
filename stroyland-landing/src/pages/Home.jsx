import { useEffect, useMemo, useState } from 'react'
import { useAdmin } from '../context/AdminContext.jsx'
import { usePageContent } from '../hooks/usePageContent.js'
import telegramIcon from '../assets/telegram-icon.svg'

const DEFAULT_SETTINGS = {
  phone: '+7 (495) 790-04-10',
  email: 'info@tdevs.ru',
  telegramUrl: 'https://t.me/yourusername',
  maxUrl: 'https://max.ru',
}

const DEFAULT_CONTENT = {
  heroEyebrow: 'Снабжение • строительство и ремонт • дизайн',
  heroTitle: 'Снабжение, строительство и ремонт, дизайн',
  heroText:
    'Мы поможем вам создать современный дизайн, подобрав подходящего под ваши критерии специалиста и снабдить всем необходимым материалом.',
  supplyTitle: 'Снабжение',
  supplyText:
    'Полное сопровождение поставок: подбираем материалы, организуем логистику и контролируем сроки.',
  designTitle: 'Дизайн',
  designText:
    'Создаем современный дизайн интерьера и экстерьера, подбираем специалистов и материалы под ваш проект.',
  servicesTitle: 'Строительство и ремонт',
  servicesIntro:
    'Выполняем полный комплекс строительно-ремонтных работ под ключ.',
  servicesItems: [
    'Монолитные работы.',
    'Кладочные работы. (кладка кирпича, газоблока, керамзитоблока и ПГП плит)',
    'Штукатурные работы. (механическое нанесение)',
    'Инженерные работы (электрика, сантехника, вентиляция).',
    'Шумоизоляция (полы, стены, потолки).',
    'Малярные работы.',
    'Монтаж гипсокартона.',
    'Укладка плитки.',
    'Изготовление и установка окон.',
    'Двери (входные и межкомнатные).',
    'Фасадные работы (вентилируемый и невентилируемый).',
    'Кровельные работы (мягкая кровля и металлочерепица).',
  ],
  rentTitle: 'Аренда оборудования и транспорта',
  rentText:
    'Предоставляем технику и оборудование для строительных работ.',
  rentItems: [
    'Оборудование для монолита (стойки, опалубка и т.д.).',
    'Грузовой транспорт: газель 1,5 т, 3 т.',
    'Манипулятор 5 т, 10 т.',
    'Башенный кран и другая спецтехника.',
  ],
  heroImageUrl: '/truck.jpg.png',
  stats: [
    { value: '120+', label: 'поставщиков' },
    { value: '24/7', label: 'контроль поставок' },
    { value: '98%', label: 'соблюдение сроков' },
  ],
  mapTitle: 'Контакты',
  mapAddress: 'г. Одинцово, ул. Маршала Неделина, 6Б',
  mapPhone: '+7 (495) 790-04-10',
  mapEmail: 'info@tdevs.ru',
}

function Home() {
  const { isAdmin, token, registerPage, setActivePage } = useAdmin()
  const { content, setContent, isDirty, save, reset } = usePageContent(
    'home',
    DEFAULT_CONTENT,
  )
  const { content: settings } = usePageContent('settings', DEFAULT_SETTINGS)
  const [editing, setEditing] = useState({})
  const [statsDraft, setStatsDraft] = useState([])
  const [heroImageDraft, setHeroImageDraft] = useState('')
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false)

  useEffect(() => {
    const unregister = registerPage('home', { save, reset, isDirty: () => isDirty })
    setActivePage('home')
    return () => {
      unregister()
      setActivePage(null)
    }
  }, [isDirty, registerPage, reset, save, setActivePage])

  const openContactCard = () => window.dispatchEvent(new Event('open-contact-card'))

  const heroStyle = useMemo(
    () => ({ '--hero-image': `url('${content.heroImageUrl}')` }),
    [content.heroImageUrl],
  )

  const toggleEdit = (key) => {
    setEditing((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const openStatsEditor = () => {
    setHeroImageDraft(content.heroImageUrl)
    setStatsDraft(content.stats.map((stat) => ({ ...stat })))
    setEditing((prev) => ({ ...prev, stats: true }))
  }

  const closeStatsEditor = () => {
    setEditing((prev) => ({ ...prev, stats: false }))
  }

  const saveStatsEditor = async () => {
    const next = { ...content, heroImageUrl: heroImageDraft, stats: statsDraft }
    setContent(next)
    try {
      const response = await fetch(`/api/content/home`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(next),
      })
      if (!response.ok) throw new Error('Failed to save content')
      closeStatsEditor()
    } catch (error) {
      window.alert('Не удалось сохранить изменения. Проверьте сервер.')
    }
  }

  const cancelStatsEditor = () => {
    setHeroImageDraft(content.heroImageUrl)
    setStatsDraft(content.stats.map((stat) => ({ ...stat })))
    closeStatsEditor()
  }

  const updateField = (field) => (event) => {
    setContent((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const updateListItem = (field, index) => (event) => {
    setContent((prev) => {
      const next = [...prev[field]]
      next[index] = event.target.value
      return { ...prev, [field]: next }
    })
  }

  const addListItem = (field) => () => {
    setContent((prev) => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeListItem = (field, index) => () => {
    setContent((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  const updateStat = (index, key) => (event) => {
    setStatsDraft((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [key]: event.target.value }
      return next
    })
  }

  const addStat = () => {
    setStatsDraft((prev) => [...prev, { value: '', label: '' }])
  }

  const removeStat = (index) => () => {
    setStatsDraft((prev) => prev.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleHeroImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const token = localStorage.getItem('adminToken')
    const formData = new FormData()
    formData.append('file', file)
    try {
      setUploadingHeroImage(true)
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      })
      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      setHeroImageDraft(data.url)
    } catch (error) {
      window.alert('Не удалось загрузить изображение. Проверьте сервер.')
    } finally {
      setUploadingHeroImage(false)
      event.target.value = ''
    }
  }

  return (
    <>
      <section id="hero" className="hero">
        <div className="container hero-grid">
          <div className="hero-content editable-block">
            {isAdmin && (
              <button className="edit-btn" type="button" onClick={() => toggleEdit('hero')}>
                Редактировать
              </button>
            )}
            {editing.hero && isAdmin ? (
              <div className="edit-fields">
                <label>
                  Подзаголовок
                  <input value={content.heroEyebrow} onChange={updateField('heroEyebrow')} />
                </label>
                <label>
                  Заголовок
                  <input value={content.heroTitle} onChange={updateField('heroTitle')} />
                </label>
                <label>
                  Текст
                  <textarea rows={3} value={content.heroText} onChange={updateField('heroText')} />
                </label>
              </div>
            ) : (
              <>
                <p className="eyebrow">{content.heroEyebrow}</p>
                <h1>{content.heroTitle}</h1>
                <p className="hero-subtext">{content.heroText}</p>
                <button className="primary-btn" type="button" onClick={openContactCard}>Связаться</button>
              </>
            )}
          </div>
          <div className="hero-media">
            <div className="hero-image editable-block" style={heroStyle}>
              {isAdmin && (
                <button className="edit-btn" type="button" onClick={openStatsEditor}>
                  Редактировать
                </button>
              )}
              <div className="hero-stats hero-overlay">
                {content.stats.map((stat, index) => (
                  <div key={`${stat.value}-${index}`} className="stat">
                    <span>{stat.value}</span>
                    <small>{stat.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {editing.stats && isAdmin && (
        <div className="edit-modal-overlay" onClick={cancelStatsEditor}>
          <div className="edit-modal" onClick={(event) => event.stopPropagation()}>
            <div className="edit-modal-header">
              <h3>Показатели и фото</h3>
              <button className="contact-card-close" type="button" onClick={cancelStatsEditor}>×</button>
            </div>
            <div className="edit-modal-body">
              <label>
                Фото для блока
                <input type="file" accept="image/*" onChange={handleHeroImageUpload} />
              </label>
              <small className="edit-hint">
                {uploadingHeroImage ? 'Загрузка изображения...' : `Текущий файл: ${heroImageDraft}`}
              </small>
              <div className="edit-list">
                <span>Показатели</span>
                {statsDraft.map((stat, index) => (
                  <div key={`${stat.value}-${index}`} className="edit-list-row double">
                    <input placeholder="Значение" value={stat.value} onChange={updateStat(index, 'value')} />
                    <input placeholder="Подпись" value={stat.label} onChange={updateStat(index, 'label')} />
                    <button className="ghost-btn" type="button" onClick={removeStat(index)}>
                      Удалить
                    </button>
                  </div>
                ))}
                <button className="secondary-btn" type="button" onClick={addStat}>
                  Добавить строку
                </button>
              </div>
              <div className="edit-modal-actions">
                <button className="secondary-btn" type="button" onClick={cancelStatsEditor}>Отменить</button>
                <button className="primary-btn" type="button" onClick={saveStatsEditor}>Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section id="about" className="section about">
        <div className="container">
          <div className="editable-block">
            {isAdmin && (
              <button className="edit-btn" type="button" onClick={() => toggleEdit('supply')}>
                Редактировать
              </button>
            )}
            {editing.supply && isAdmin ? (
              <div className="edit-fields">
                <label>
                  Заголовок
                  <input value={content.supplyTitle} onChange={updateField('supplyTitle')} />
                </label>
                <label>
                  Текст
                  <textarea rows={3} value={content.supplyText} onChange={updateField('supplyText')} />
                </label>
              </div>
            ) : (
              <>
                <h2>{content.supplyTitle}</h2>
                <p className="section-text">{content.supplyText}</p>
              </>
            )}
          </div>
          <div className="info-card highlight editable-block">
            {isAdmin && (
              <button className="edit-btn" type="button" onClick={() => toggleEdit('design')}>
                Редактировать
              </button>
            )}
            {editing.design && isAdmin ? (
              <div className="edit-fields">
                <label>
                  Заголовок
                  <input value={content.designTitle} onChange={updateField('designTitle')} />
                </label>
                <label>
                  Текст
                  <textarea rows={3} value={content.designText} onChange={updateField('designText')} />
                </label>
              </div>
            ) : (
              <>
                <h3>{content.designTitle}</h3>
                <p>{content.designText}</p>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="services" className="section services">
        <div className="container editable-block">
          {isAdmin && (
            <button className="edit-btn" type="button" onClick={() => toggleEdit('services')}>
              Редактировать
            </button>
          )}
          {editing.services && isAdmin ? (
            <div className="edit-fields">
              <label>
                Заголовок
                <input value={content.servicesTitle} onChange={updateField('servicesTitle')} />
              </label>
              <label>
                Вступление
                <textarea rows={2} value={content.servicesIntro} onChange={updateField('servicesIntro')} />
              </label>
              <div className="edit-list">
                <span>Список работ</span>
                {content.servicesItems.map((item, index) => (
                  <div key={`${item}-${index}`} className="edit-list-row">
                    <input value={item} onChange={updateListItem('servicesItems', index)} />
                    <button className="ghost-btn" type="button" onClick={removeListItem('servicesItems', index)}>
                      Удалить
                    </button>
                  </div>
                ))}
                <button className="secondary-btn" type="button" onClick={addListItem('servicesItems')}>
                  Добавить строку
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2>{content.servicesTitle}</h2>
              <p className="section-text">{content.servicesIntro}</p>
              <ul className="checklist">
                {content.servicesItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section id="rent" className="section dark-section">
        <div className="container editable-block">
          {isAdmin && (
            <button className="edit-btn" type="button" onClick={() => toggleEdit('rent')}>
              Редактировать
            </button>
          )}
          {editing.rent && isAdmin ? (
            <div className="edit-fields">
              <label>
                Заголовок
                <input value={content.rentTitle} onChange={updateField('rentTitle')} />
              </label>
              <label>
                Текст
                <textarea rows={2} value={content.rentText} onChange={updateField('rentText')} />
              </label>
              <div className="edit-list">
                <span>Список аренды</span>
                {content.rentItems.map((item, index) => (
                  <div key={`${item}-${index}`} className="edit-list-row">
                    <input value={item} onChange={updateListItem('rentItems', index)} />
                    <button className="ghost-btn" type="button" onClick={removeListItem('rentItems', index)}>
                      Удалить
                    </button>
                  </div>
                ))}
                <button className="secondary-btn" type="button" onClick={addListItem('rentItems')}>
                  Добавить строку
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2>{content.rentTitle}</h2>
              <div className="stacked">
                {content.rentItems.map((item) => (
                  <div key={item} className="dark-card">
                    {item}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section id="contacts" className="section contacts">
        <div className="container editable-block">
          {isAdmin && (
            <button className="edit-btn" type="button" onClick={() => toggleEdit('contacts')}>
              Редактировать
            </button>
          )}
          {editing.contacts && isAdmin ? (
            <div className="edit-fields">
              <label>
                Заголовок
                <input value={content.mapTitle} onChange={updateField('mapTitle')} />
              </label>
              <label>
                Адрес (для карты)
                <input value={content.mapAddress} onChange={updateField('mapAddress')} />
              </label>
            </div>
          ) : (
            <>
              <h2>{content.mapTitle}</h2>
              <div className="contacts-grid">
                <div className="map-card">
                  <iframe
                    title="Yandex map"
                    className="map-embed"
                    src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(content.mapAddress)}&z=16&l=map`}
                    loading="lazy"
                  />
                </div>
                <div className="contact-card">
                  <h3>Связь с нами</h3>
                  <div className="contact-row">
                    <span>Адрес:</span>
                    <strong>{content.mapAddress}</strong>
                  </div>
                  <div className="contact-row">
                    <span>Телефон/факс:</span>
                    <strong>{settings.phone}</strong>
                  </div>
                  <div className="contact-row">
                    <span>Эл. почта:</span>
                    <strong>{settings.email}</strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="section cta">
        <div className="container cta-inner">
          <div>
            <h2>Остались вопросы? Оставь заявку и мы ответим!</h2>
            <p>Проконсультируем по срокам, бюджету и оптимальному формату работы.</p>
          </div>
          <button className="primary-btn" type="button" onClick={openContactCard}>Связаться</button>
        </div>
      </section>
    </>
  )
}

export default Home
