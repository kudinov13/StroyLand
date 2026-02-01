import { Link } from 'react-router-dom'

function Customers() {
  return (
    <section className="simple-page">
      <div className="container">
        <Link className="back-link" to="/">← Вернуться на главную</Link>
        <h1>Заказчикам</h1>
        <p className="page-lead">
          Уважаемые руководители и менеджмент строительных организаций!
          В случае вашей заинтересованности в услугах аутсорсинга функций
          отдела снабжения, просим оставить заявку на нашем сайте и мы свяжемся
          с вами для уточнения условий возможного сотрудничества.
        </p>
        <div className="page-actions">
          <button className="primary-btn" type="button">Условия для заказчиков</button>
          <button className="secondary-btn" type="button">Оставить заявку</button>
        </div>
      </div>
    </section>
  )
}

export default Customers
