import { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import '../App.css'
import { useAdmin } from '../context/AdminContext.jsx'
import { usePageContent } from '../hooks/usePageContent.js'
import telegramIcon from '../assets/telegram-icon.svg'

const DEFAULT_SETTINGS = {
  phone: '+7 (495) 790-04-10',
  email: 'info@tdevs.ru',
  telegramUrl: 'https://t.me/yourusername',
  maxUrl: 'https://max.ru',
}

const DEFAULT_HOME_CONTACT = {
  mapAddress: 'г. Одинцово, ул. Маршала Неделина, 6Б',
}

function Layout() {
  const navigate = useNavigate()
  const {
    isAdmin,
    token,
    checking,
    activePage,
    getHandlers,
    registerPage,
    setActivePage,
    logout,
  } = useAdmin()

  const [showSettings, setShowSettings] = useState(false)
  const [prevActivePage, setPrevActivePage] = useState(null)
  const [showContactCard, setShowContactCard] = useState(false)
  const {
    content: settings,
    setContent: setSettings,
    isDirty: settingsDirty,
    save: saveSettings,
    reset: resetSettings,
  } = usePageContent('settings', DEFAULT_SETTINGS)

  const { content: homeContact } = usePageContent('home', DEFAULT_HOME_CONTACT)

  useEffect(() => {
    const unregister = registerPage('settings', {
      save: saveSettings,
      reset: resetSettings,
      isDirty: () => settingsDirty,
    })
    return unregister
  }, [registerPage, resetSettings, saveSettings, settingsDirty])

  useEffect(() => {
    const handleShortcut = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'a') {
        event.preventDefault()
        navigate('/admin')
      }
    }

    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [navigate])

  useEffect(() => {
    const handleOpenContact = () => setShowContactCard(true)
    window.addEventListener('open-contact-card', handleOpenContact)
    return () => window.removeEventListener('open-contact-card', handleOpenContact)
  }, [])

  useEffect(() => {
    const tryScroll = () => {
      if (!window.location.hash) return
      const id = window.location.hash.slice(1)
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        requestAnimationFrame(tryScroll)
      }
    }

    requestAnimationFrame(tryScroll)
  }, [])

  const handleSave = async () => {
    if (!activePage) return
    const handlers = getHandlers(activePage)
    const dirty = typeof handlers?.isDirty === 'function' ? handlers.isDirty() : handlers?.isDirty
    if (!dirty) return
    const confirmed = window.confirm('Сохранить изменения?')
    if (!confirmed) return
    try {
      await handlers.save(token)
    } catch (error) {
      window.alert('Не удалось сохранить изменения. Проверьте сервер.')
    }
  }

  const handleCancel = () => {
    if (!activePage) return
    const handlers = getHandlers(activePage)
    if (!handlers) return
    handlers.reset()
  }

  const openSettings = () => {
    setPrevActivePage(activePage)
    setActivePage('settings')
    setShowSettings(true)
  }

  const closeSettings = () => {
    setShowSettings(false)
    setActivePage(prevActivePage)
  }

  const handleSettingsSave = async () => {
    try {
      await saveSettings(token)
      closeSettings()
    } catch (error) {
      window.alert('Не удалось сохранить личные данные. Проверьте сервер.')
    }
  }

  const handleSettingsCancel = () => {
    resetSettings()
    closeSettings()
  }

  return (
    <div className="page">
      <div className="watermark-layer" aria-hidden="true">
        <span>Demo • Не для копирования</span>
        <span>Demo • Не для копирования</span>
        <span>Demo • Не для копирования</span>
        <span>Demo • Не для копирования</span>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-logo" aria-hidden="true">
              <span>Л</span>
            </div>
            <div className="brand-text">
              <span className="brand-title">Литокс</span>
              <span className="brand-subtitle">Строительный магазин</span>
            </div>
          </div>
          <nav className="nav">
            <a href="/">Главная</a>
            <a href="/#about">Снабжение</a>
            <a href="/#services">Строительство</a>
            <a href="/#rent">Аренда</a>
            <div className="nav-dropdown">
              <span className="nav-trigger">Партнерам</span>
              <div className="dropdown-menu">
                <Link to="/partners/customers">Заказчикам</Link>
                <Link to="/partners/manufacturers">Производителям</Link>
                <Link to="/partners/suppliers">Поставщикам</Link>
              </div>
            </div>
            <a
              href="/#contacts"
              onClick={(event) => {
                if (window.location.pathname !== '/') {
                  event.preventDefault()
                  window.location.href = '/#contacts'
                }
              }}
            >
              Контакты
            </a>
          </nav>
          <div className="header-actions">
            {isAdmin && !checking && (
              <div className="admin-toolbar">
                <span className="admin-badge">Режим админа</span>
                <button className="secondary-btn" type="button" onClick={handleCancel}>Отменить</button>
                <button className="primary-btn" type="button" onClick={handleSave}>Сохранить</button>
                <button className="ghost-btn" type="button" onClick={openSettings}>Личные данные</button>
                <button className="ghost-btn" type="button" onClick={logout}>Выйти</button>
              </div>
            )}
            <button
              className="ghost-btn"
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-contact-card'))}
            >
              Перезвонить мне
            </button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {showContactCard && (
        <div className="contact-card-overlay" onClick={() => setShowContactCard(false)}>
          <div className="contact-card" onClick={(event) => event.stopPropagation()}>
            <div className="contact-card-header">
              <div>
                <h3>Связаться</h3>
                <p>Мы ответим в мессенджере или по телефону</p>
              </div>
              <button className="contact-card-close" type="button" onClick={() => setShowContactCard(false)}>
                ×
              </button>
            </div>
            <div className="contact-card-body">
              <div className="contact-info">
                <h4>ООО «Литокс»</h4>
                <p>Строительный магазин</p>
                <div className="contact-detail">
                  <strong>Адрес:</strong>
                  <span>{homeContact.mapAddress}</span>
                </div>
                <div className="contact-detail">
                  <strong>Телефон:</strong>
                  <span>{settings.phone}</span>
                </div>
                <div className="contact-detail">
                  <strong>Email:</strong>
                  <span>{settings.email}</span>
                </div>
                <div className="contact-messengers">
                  <strong>Мессенджеры:</strong>
                  <div className="messenger-links">
                    <a
                      href={settings.telegramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="messenger-link telegram"
                      title="Написать в Telegram"
                    >
                      <img src={telegramIcon} alt="Telegram" width="20" height="20" />
                    </a>
                    <a
                      href={settings.maxUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="messenger-link max"
                      title="Написать в MAX"
                    >
                      <img
                        src="https://logo-teka.com/wp-content/uploads/2025/07/max-messenger-sign-logo.svg"
                        alt="MAX"
                        width="20"
                        height="20"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="settings-overlay" onClick={closeSettings}>
          <div className="settings-modal" onClick={(event) => event.stopPropagation()}>
            <div className="settings-header">
              <h3>Личные данные</h3>
              <button className="contact-card-close" type="button" onClick={closeSettings}>×</button>
            </div>
            <div className="settings-body">
              <label>
                Телефон
                <input value={settings.phone} onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))} />
              </label>
              <label>
                Email
                <input value={settings.email} onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))} />
              </label>
              <label>
                Ссылка Telegram
                <input value={settings.telegramUrl} onChange={(e) => setSettings((prev) => ({ ...prev, telegramUrl: e.target.value }))} />
              </label>
              <label>
                Ссылка MAX
                <input value={settings.maxUrl} onChange={(e) => setSettings((prev) => ({ ...prev, maxUrl: e.target.value }))} />
              </label>
              <div className="settings-actions">
                <button className="secondary-btn" type="button" onClick={handleSettingsCancel}>Отменить</button>
                <button className="primary-btn" type="button" onClick={handleSettingsSave}>Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>ООО ТД «Литокс»</span>
          <span>Политика конфиденциальности</span>
        </div>
      </footer>
    </div>
  )
}

export default Layout
