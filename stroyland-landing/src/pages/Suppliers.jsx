import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext.jsx'
import { usePageContent } from '../hooks/usePageContent.js'

const DEFAULT_CONTENT = {
  title: 'Поставщикам',
  lead:
    'ООО «Литокс» приглашает к сотрудничеству поставляющие организации по всем направлениям строительных материалов, оборудования и услуг, связанных со строительной сферой.',
  listTitle: 'Мы привлекаем партнеров:',
  listItems: [
    'Продукция соответствует оговоренным стандартам качества.',
    'Соблюдаются объемы и сроки поставки с бесперебойной логистикой.',
    'Оптимальное соотношение цена/качество + выдержка условий цены.',
    'Наличие профессиональных знаний и опыта в торговой деятельности.',
  ],
  portalText:
    'Все заказы на закупку работ, материалов, оборудования и услуг осуществляются только на тендерной основе. Вся информация доступна на портале современной торговой экосистемы «НейроСнаб» —',
  portalUrl: 'https://trade.neurosnab.ru',
  accessTitle: 'Для получения доступа:',
  accessItems: [
    'Зарегистрироваться на платформе «НейроСнаб».',
    'Подписаться на соответствующую группу товаров, работ и услуг.',
    'Настроить уведомления о заказах в Telegram, на почту и в браузере.',
    'Разместить свое предложение в случае заинтересованности в тендере.',
  ],
  closingText:
    'Мы всегда рады знакомству и развитию отношений с новыми ответственными партнерами. Гарантируем открытость и порядочность в сотрудничестве!',
  extraBlocks: [],
  primaryAction: 'Условия для поставщиков',
  secondaryAction: 'Оставить заявку',
  conditionsPdfUrl: '',
}

function Suppliers() {
  const { isAdmin, token, registerPage, setActivePage } = useAdmin()
  const { content, setContent, isDirty, save, reset } = usePageContent(
    'suppliers',
    DEFAULT_CONTENT,
  )
  const [editing, setEditing] = useState({})
  const [uploadingPdf, setUploadingPdf] = useState(false)

  useEffect(() => {
    const unregister = registerPage('suppliers', { save, reset, isDirty: () => isDirty })
    setActivePage('suppliers')
    return () => {
      unregister()
      setActivePage(null)
    }
  }, [isDirty, registerPage, reset, save, setActivePage])

  const toggleEdit = (key) => {
    setEditing((prev) => ({ ...prev, [key]: !prev[key] }))
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

  const addExtraBlock = () => {
    setContent((prev) => ({
      ...prev,
      extraBlocks: [
        ...prev.extraBlocks,
        {
          title: 'Новый заголовок:',
          subtitle: 'Подзаголовок',
          text: 'Основной текст',
          items: [''],
        },
      ],
    }))
  }

  const updateExtraBlock = (blockIndex, field) => (event) => {
    setContent((prev) => {
      const next = [...prev.extraBlocks]
      next[blockIndex] = { ...next[blockIndex], [field]: event.target.value }
      return { ...prev, extraBlocks: next }
    })
  }

  const updateExtraBlockItem = (blockIndex, itemIndex) => (event) => {
    setContent((prev) => {
      const next = [...prev.extraBlocks]
      const block = { ...next[blockIndex] }
      const items = [...block.items]
      items[itemIndex] = event.target.value
      next[blockIndex] = { ...block, items }
      return { ...prev, extraBlocks: next }
    })
  }

  const addExtraBlockItem = (blockIndex) => () => {
    setContent((prev) => {
      const next = [...prev.extraBlocks]
      const block = { ...next[blockIndex] }
      block.items = [...block.items, '']
      next[blockIndex] = block
      return { ...prev, extraBlocks: next }
    })
  }

  const removeExtraBlockItem = (blockIndex, itemIndex) => () => {
    setContent((prev) => {
      const next = [...prev.extraBlocks]
      const block = { ...next[blockIndex] }
      block.items = block.items.filter((_, idx) => idx !== itemIndex)
      next[blockIndex] = block
      return { ...prev, extraBlocks: next }
    })
  }

  const removeExtraBlock = (blockIndex) => () => {
    setContent((prev) => ({
      ...prev,
      extraBlocks: prev.extraBlocks.filter((_, idx) => idx !== blockIndex),
    }))
  }

  const openContactCard = () => window.dispatchEvent(new Event('open-contact-card'))

  const openPdf = () => {
    if (!content.conditionsPdfUrl) {
      window.alert('Файл условий не загружен')
      return
    }
    window.open(content.conditionsPdfUrl, '_blank', 'noreferrer')
  }

  const handlePdfUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    try {
      setUploadingPdf(true)
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: formData,
      })
      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      setContent((prev) => ({ ...prev, conditionsPdfUrl: data.url }))
    } catch (error) {
      window.alert('Не удалось загрузить PDF. Проверьте сервер.')
    } finally {
      setUploadingPdf(false)
      event.target.value = ''
    }
  }

  return (
    <section className="simple-page">
      <div className="container">
        <Link className="back-link" to="/">← Вернуться на главную</Link>
        <div className="editable-block">
          {isAdmin && (
            <button className="edit-btn" type="button" onClick={() => toggleEdit('main')}>
              Редактировать
            </button>
          )}
          {editing.main && isAdmin ? (
            <div className="edit-fields">
              <label>
                Заголовок
                <input value={content.title} onChange={updateField('title')} />
              </label>
              <label>
                Текст
                <textarea rows={3} value={content.lead} onChange={updateField('lead')} />
              </label>
              <label>
                Заголовок списка партнеров
                <input value={content.listTitle} onChange={updateField('listTitle')} />
              </label>
              <div className="edit-list">
                <span>Список партнеров</span>
                {content.listItems.map((item, index) => (
                  <div key={`${item}-${index}`} className="edit-list-row">
                    <input value={item} onChange={updateListItem('listItems', index)} />
                    <button className="ghost-btn" type="button" onClick={removeListItem('listItems', index)}>
                      Удалить
                    </button>
                  </div>
                ))}
                <button className="secondary-btn" type="button" onClick={addListItem('listItems')}>
                  Добавить строку
                </button>
              </div>
              <div className="edit-list-actions">
                <button className="ghost-btn" type="button" onClick={() => updateField('listTitle')({ target: { value: '' } })}>
                  Удалить заголовок
                </button>
                <button className="secondary-btn" type="button" onClick={addExtraBlock}>
                  Добавить заголовок
                </button>
              </div>
              <label>
                Текст про портал
                <textarea rows={3} value={content.portalText} onChange={updateField('portalText')} />
              </label>
              <label>
                Ссылка на портал
                <input value={content.portalUrl} onChange={updateField('portalUrl')} />
              </label>
              <label>
                Заголовок списка доступа
                <input value={content.accessTitle} onChange={updateField('accessTitle')} />
              </label>
              <div className="edit-list">
                <span>Список доступа</span>
                {content.accessItems.map((item, index) => (
                  <div key={`${item}-${index}`} className="edit-list-row">
                    <input value={item} onChange={updateListItem('accessItems', index)} />
                    <button className="ghost-btn" type="button" onClick={removeListItem('accessItems', index)}>
                      Удалить
                    </button>
                  </div>
                ))}
                <button className="secondary-btn" type="button" onClick={addListItem('accessItems')}>
                  Добавить строку
                </button>
              </div>
              <div className="edit-list-actions">
                <button className="ghost-btn" type="button" onClick={() => updateField('accessTitle')({ target: { value: '' } })}>
                  Удалить заголовок
                </button>
                <button className="secondary-btn" type="button" onClick={addExtraBlock}>
                  Добавить заголовок
                </button>
              </div>
              <label>
                Заключительный текст
                <textarea rows={3} value={content.closingText} onChange={updateField('closingText')} />
              </label>
              <label>
                Текст кнопки 1
                <input value={content.primaryAction} onChange={updateField('primaryAction')} />
              </label>
              <label>
                Текст кнопки 2
                <input value={content.secondaryAction} onChange={updateField('secondaryAction')} />
              </label>
              <label>
                PDF условий
                <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
              </label>
              <small className="edit-hint">
                {uploadingPdf ? 'Загрузка PDF...' : `Текущий файл: ${content.conditionsPdfUrl || 'не загружен'}`}
              </small>
              {content.extraBlocks.map((block, blockIndex) => (
                <div key={blockIndex} className="edit-extra-block">
                  <div className="edit-extra-header">
                    <h4>Дополнительный блок #{blockIndex + 1}</h4>
                    <button className="ghost-btn" type="button" onClick={removeExtraBlock(blockIndex)}>
                      Удалить блок
                    </button>
                  </div>
                  <label>
                    Заголовок
                    <input value={block.title} onChange={updateExtraBlock(blockIndex, 'title')} />
                  </label>
                  <label>
                    Подзаголовок
                    <input value={block.subtitle} onChange={updateExtraBlock(blockIndex, 'subtitle')} />
                  </label>
                  <label>
                    Основной текст
                    <textarea rows={3} value={block.text} onChange={updateExtraBlock(blockIndex, 'text')} />
                  </label>
                  <div className="edit-list">
                    <span>Список</span>
                    {block.items.map((item, itemIndex) => (
                      <div key={`${item}-${itemIndex}`} className="edit-list-row">
                        <input value={item} onChange={updateExtraBlockItem(blockIndex, itemIndex)} />
                        <button className="ghost-btn" type="button" onClick={removeExtraBlockItem(blockIndex, itemIndex)}>
                          Удалить
                        </button>
                      </div>
                    ))}
                    <button className="secondary-btn" type="button" onClick={addExtraBlockItem(blockIndex)}>
                      Добавить строку
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <h1>{content.title}</h1>
              <p className="page-lead">{content.lead}</p>
              <h3 className="page-subtitle">{content.listTitle}</h3>
              <ol className="page-list">
                {content.listItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <p className="page-text">
                {content.portalText}
                <a className="inline-link" href={content.portalUrl} target="_blank" rel="noreferrer">
                  {content.portalUrl}
                </a>
              </p>
              <h3 className="page-subtitle">{content.accessTitle}</h3>
              <ol className="page-list">
                {content.accessItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <p className="page-text">{content.closingText}</p>
              {content.extraBlocks.map((block, blockIndex) => (
                <div key={blockIndex} className="extra-block">
                  <h3 className="page-subtitle">{block.title}</h3>
                  <h4 className="page-sub-subtitle">{block.subtitle}</h4>
                  <p className="page-text">{block.text}</p>
                  {block.items.length > 0 && (
                    <ul className="page-list">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <div className="page-actions">
                <button className="primary-btn" type="button" onClick={openPdf}>
                  {content.primaryAction}
                </button>
                <button className="secondary-btn" type="button" onClick={openContactCard}>
                  {content.secondaryAction}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default Suppliers
