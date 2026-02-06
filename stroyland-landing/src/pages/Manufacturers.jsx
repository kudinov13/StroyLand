import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext.jsx'
import { usePageContent } from '../hooks/usePageContent.js'

const DEFAULT_CONTENT = {
  title: 'Производителям',
  lead:
    'ООО «Литокс» приглашает к сотрудничеству производителей строительных материалов на взаимовыгодных условиях.',
  text:
    'Наш многолетний опыт в сфере комплектации строительства позволяет нам занимать значительные позиции в данной отрасли. В случае заинтересованности просим оставить заявку в форме обратной связи и мы обязательно с вами свяжемся.',
  featuresTitle: 'Наши условия:',
  featuresItems: [
    'Долгосрочное партнерство',
    'Своевременная оплата',
    'Маркетинговая поддержка',
    'Совместные проекты',
  ],
  extraBlocks: [],
  primaryAction: 'Условия для производителей',
  secondaryAction: 'Оставить заявку',
  conditionsPdfUrl: '',
}

function Manufacturers() {
  const { isAdmin, token, registerPage, setActivePage } = useAdmin()
  const { content, setContent, isDirty, save, reset } = usePageContent(
    'manufacturers',
    DEFAULT_CONTENT,
  )
  const [editing, setEditing] = useState({})
  const [uploadingPdf, setUploadingPdf] = useState(false)

  useEffect(() => {
    const unregister = registerPage('manufacturers', { save, reset, isDirty: () => isDirty })
    setActivePage('manufacturers')
    return () => {
      unregister()
      setActivePage(null)
    }
  }, [isDirty, registerPage, reset, save, setActivePage])

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

  const toggleEdit = (key) => {
    setEditing((prev) => ({ ...prev, [key]: !prev[key] }))
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
                Текст (подзаголовок)
                <textarea rows={3} value={content.lead} onChange={updateField('lead')} />
              </label>
              <label>
                Основной текст
                <textarea rows={4} value={content.text} onChange={updateField('text')} />
              </label>
              <label>
                Заголовок списка условий
                <input value={content.featuresTitle} onChange={updateField('featuresTitle')} />
              </label>
              <div className="edit-list">
                <span>Список условий</span>
                {content.featuresItems.map((item, index) => (
                  <div key={`${item}-${index}`} className="edit-list-row">
                    <input value={item} onChange={updateListItem('featuresItems', index)} />
                    <button className="ghost-btn" type="button" onClick={removeListItem('featuresItems', index)}>
                      Удалить
                    </button>
                  </div>
                ))}
                <button className="secondary-btn" type="button" onClick={addListItem('featuresItems')}>
                  Добавить строку
                </button>
              </div>
              <div className="edit-list-actions">
                <button className="ghost-btn" type="button" onClick={() => updateField('featuresTitle')({ target: { value: '' } })}>
                  Удалить заголовок
                </button>
                <button className="secondary-btn" type="button" onClick={addExtraBlock}>
                  Добавить заголовок
                </button>
              </div>
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
            </div>
          ) : (
            <>
              <h1>{content.title}</h1>
              <p className="page-lead">{content.lead}</p>
              <p className="page-text">{content.text}</p>
              <h3 className="page-subtitle">{content.featuresTitle}</h3>
              <ul className="page-list">
                {content.featuresItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
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

export default Manufacturers
