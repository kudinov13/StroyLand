import { Link, Outlet } from 'react-router-dom'
import '../App.css'

function Layout() {
  return (
    <div className="page">
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand">
            <div className="brand-logo" aria-hidden="true">
              <span>SL</span>
            </div>
            <div className="brand-text">
              <span className="brand-title">Надпись без названия</span>
              <span className="brand-subtitle">Торговый дом</span>
            </div>
          </div>
          <nav className="nav">
            <Link to="/">Главная</Link>
            <a href="/#about">О нас</a>
            <a href="/#outsourcing">Об аутсорсинге</a>
            <div className="nav-dropdown">
              <span className="nav-trigger">Партнерам</span>
              <div className="dropdown-menu">
                <Link to="/partners/customers">Заказчикам</Link>
                <Link to="/partners/manufacturers">Производителям</Link>
                <Link to="/partners/suppliers">Поставщикам</Link>
              </div>
            </div>
            <a href="/#contacts">Контакты</a>
          </nav>
          <button className="ghost-btn" type="button">Перезвонить мне</button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <span>ООО ТД «Надпись без названия»</span>
          <span>Политика конфиденциальности</span>
        </div>
      </footer>
    </div>
  )
}

export default Layout
