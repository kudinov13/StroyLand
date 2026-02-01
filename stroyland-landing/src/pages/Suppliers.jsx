import { Link } from 'react-router-dom'

function Suppliers() {
  return (
    <section className="simple-page">
      <div className="container">
        <Link className="back-link" to="/">← Вернуться на главную</Link>
        <h1>Поставщикам</h1>
        <p className="page-lead">
          ООО «Торговый Дом Базовая Структура» приглашает к сотрудничеству
          поставляющие организации по всем направлениям строительных материалов,
          оборудования и услуг, связанных со строительной сферой.
        </p>
        <h3 className="page-subtitle">Мы привлекаем партнеров:</h3>
        <ol className="page-list">
          <li>Продукция соответствует оговоренным стандартам качества.</li>
          <li>Соблюдаются объемы и сроки поставки с бесперебойной логистикой.</li>
          <li>Оптимальное соотношение цена/качество + выдержка условий цены.</li>
          <li>Наличие профессиональных знаний и опыта в торговой деятельности.</li>
        </ol>
        <p className="page-text">
          Все заказы на закупку работ, материалов, оборудования и услуг
          осуществляются только на тендерной основе. Вся информация доступна на
          портале современной торговой экосистемы «НейроСнаб» —
          <a className="inline-link" href="https://trade.neurosnab.ru" target="_blank" rel="noreferrer">
            https://trade.neurosnab.ru
          </a>
        </p>
        <h3 className="page-subtitle">Для получения доступа:</h3>
        <ol className="page-list">
          <li>Зарегистрироваться на платформе «НейроСнаб».</li>
          <li>Подписаться на соответствующую группу товаров, работ и услуг.</li>
          <li>Настроить уведомления о заказах в Telegram, на почту и в браузере.</li>
          <li>Разместить свое предложение в случае заинтересованности в тендере.</li>
        </ol>
        <p className="page-text">
          Мы всегда рады знакомству и развитию отношений с новыми ответственными
          партнерами. Гарантируем открытость и порядочность в сотрудничестве!
        </p>
        <div className="page-actions">
          <button className="primary-btn" type="button">Условия для поставщиков</button>
          <button className="secondary-btn" type="button">Оставить заявку</button>
        </div>
      </div>
    </section>
  )
}

export default Suppliers
