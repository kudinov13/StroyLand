function Home() {
  return (
    <>
      <section id="hero" className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <p className="eyebrow">Аутсорсинг закупок и снабжение</p>
            <h1>
              АУТСОРСИНГ ЗАКУПОК И СНАБЖЕНИЕ ОБЪЕКТОВ
              СТРОЙМАТЕРИАЛАМИ
            </h1>
            <p className="hero-subtext">
              Освобождаем ваше время для решения важных бизнес-задач.
              Берем на себя управление закупками, логистикой и контролем.
            </p>
            <button className="primary-btn" type="button">Оставить заявку</button>
          </div>
          <div className="hero-media">
            <div className="hero-image">
              <div className="hero-overlay">
                <div className="stat">
                  <span>120+</span>
                  <small>Поставщиков</small>
                </div>
                <div className="stat">
                  <span>24/7</span>
                  <small>Контроль поставок</small>
                </div>
                <div className="stat">
                  <span>98%</span>
                  <small>Соблюдение сроков</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="section about">
        <div className="container">
          <h2>О нас</h2>
          <p className="section-text">
            Имеем более 20-летний опыт закупок и комплектации строительных
            объектов. Полностью берём на себя процессы поиска поставщиков,
            переговоров, согласования договоров и мониторинга поставок.
          </p>
          <div className="info-card">
            <h3>Что такое аутсорсинг закупок?</h3>
            <p>
              Аутсорсинг — это передача непрофильных функций компании внешним
              исполнителям, специализирующимся на решении задач закупок и
              снабжения.
            </p>
          </div>
        </div>
      </section>

      <section id="outsourcing" className="section grid-section">
        <div className="container">
          <h2>Минусы самостоятельного снабжения</h2>
          <div className="cards-grid">
            {[
              {
                title: 'Расфокусировка внимания',
                text: 'Закупщики заняты операционными задачами и не успевают работать стратегически.',
              },
              {
                title: 'Необходимость рекрутинга',
                text: 'Найм специалистов занимает время и требует дополнительных ресурсов.',
              },
              {
                title: 'Недовольство инициаторов',
                text: 'Поставки затягиваются из-за бюрократии и долгих согласований.',
              },
              {
                title: 'Высокие затраты',
                text: 'Не хватает экспертизы для оптимизации закупок и выбора лучших условий.',
              },
              {
                title: 'Отсутствие прозрачности',
                text: 'Недостаток аналитики не позволяет управлять ситуацией в закупках.',
              },
              {
                title: 'Плохие условия',
                text: 'Высокий процент предоплаты и невыгодные условия контрактов.',
              },
            ].map((card) => (
              <article key={card.title} className="card">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark-section">
        <div className="container">
          <h2>Эффект достигаем благодаря</h2>
          <div className="stacked">
            {[
              'Отработанным процессам и использованию современных цифровых решений.',
              'Полностью открытому подходу: вы видите предложения и принимаете решение.',
              'Сбору лучших предложений рынка и контролю поставки.',
              'Прописанным стадиям обработки заявок и прозрачным регламентам.',
              'Адаптации схемы аутсорсинга под ваши потребности.',
            ].map((item) => (
              <div key={item} className="dark-card">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section services">
        <div className="container">
          <h2>Что входит в сервис</h2>
          <ul className="checklist">
            {[
              'Регистрация и организация согласования заявок на закупку',
              'Размещение заказов',
              'Поиск, сбор и анализ коммерческих предложений',
              'Согласование лучшего предложения',
              'Администрирование процесса заключения договоров',
              'Администрирование доставки',
              'Контроль закрывающих документов и передача в оплату',
              'Бухгалтерская отчетность и «экспорт первички»',
              'Ведение реестра и бюджет регулярных оплат',
              'Контроль процесса закупок и расходов в реальном времени',
              'Портал для сотрудников со статусами заявок',
              'Стандартизация и централизация процессов',
              'Регулярная отчетность и аналитика по срокам поставки',
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="contacts" className="section contacts">
        <div className="container">
          <h2>Контакты</h2>
          <div className="contacts-grid">
            <div className="map-card">
              <div className="map-placeholder">
                <div className="map-pin" />
                <p>г. Одинцово, ул. Маршала Неделина, 6Б</p>
              </div>
            </div>
            <div className="contact-card">
              <h3>Адрес</h3>
              <p>МО, г. Одинцово, ул. Маршала Неделина, 6Б</p>
              <div className="contact-row">
                <span>Телефон/факс:</span>
                <strong>+7 (495) 790-04-10</strong>
              </div>
              <div className="contact-row">
                <span>Эл. почта:</span>
                <strong>info@tdevs.ru</strong>
              </div>
            </div>
          </div>
          <div className="contacts-list">
            {[
              {
                name: 'Общая эл. почта',
                role: 'Для коммерческих предложений',
                value: 'snab@tdevs.ru',
              },
              {
                name: 'Бороздина Анастасия Олеговна',
                role: 'Генеральный директор',
                value: 'borozdina@tdevs.ru',
              },
              {
                name: 'Корнейчук Сергей Владимирович',
                role: 'Руководитель отдела комплектации',
                value: 'kornejchuk@tdevs.ru',
              },
              {
                name: 'Малахова Олеся Николаевна',
                role: 'Руководитель тендерного отдела',
                value: 'malahova@tdevs.ru',
              },
              {
                name: 'Бутенко Екатерина Сергеевна',
                role: 'Руководитель отдела конъюнктурного анализа цен',
                value: 'butenko@tdevs.ru',
              },
              {
                name: 'Баранова Олеся Владимировна',
                role: 'Руководитель отдела сопровождения сделок',
                value: 'o.baranova@tdevs.ru',
              },
            ].map((person) => (
              <div key={person.name} className="person-card">
                <h4>{person.name}</h4>
                <p>{person.role}</p>
                <span>{person.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta">
        <div className="container cta-inner">
          <div>
            <h2>Остались вопросы? Оставь заявку и мы ответим!</h2>
            <p>Проконсультируем по срокам, бюджету и оптимальному формату работы.</p>
          </div>
          <button className="primary-btn" type="button">Оставить заявку</button>
        </div>
      </section>
    </>
  )
}

export default Home
