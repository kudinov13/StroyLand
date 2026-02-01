import { Link } from 'react-router-dom'

function Manufacturers() {
  return (
    <section className="simple-page">
      <div className="container">
        <Link className="back-link" to="/">← Вернуться на главную</Link>
        <h1>Производителям</h1>
        <p className="page-lead">
          ООО «Торговый Дом Базовая Структура» приглашает к сотрудничеству
          производителей строительных материалов на взаимовыгодных условиях.
        </p>
        <p className="page-text">
          Наш многолетний опыт в сфере комплектации строительства позволяет нам
          занимать значительные позиции в данной отрасли. В случае заинтересованности
          просим оставить заявку в форме обратной связи и мы обязательно с вами
          свяжемся.
        </p>
      </div>
    </section>
  )
}

export default Manufacturers
