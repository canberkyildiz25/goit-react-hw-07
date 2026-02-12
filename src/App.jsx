import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import ContactForm from './components/ContactForm'
import ContactList from './components/ContactList'
import FilterBar from './components/FilterBar'
import SearchBar from './components/SearchBar'
import {
  addContact,
  deleteContact,
  fetchContacts,
  updateContact,
} from './store/contactsSlice'
import { setFilter, setSearch } from './store/filtersSlice'

function App() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.contacts)
  const { search, filter } = useSelector((state) => state.filters)
  const [editingContact, setEditingContact] = useState(null)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchContacts())
    }
  }, [dispatch, status])

  const filteredContacts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return items.filter((contact) => {
      const matchesSearch = normalizedSearch
        ? `${contact.name} ${contact.phone} ${contact.email || ''}`
            .toLowerCase()
            .includes(normalizedSearch)
        : true

      const matchesFilter =
        filter === 'all' ||
        (filter === 'hasEmail' && contact.email) ||
        (filter === 'hasPhone' && contact.phone)

      return matchesSearch && matchesFilter
    })
  }, [items, search, filter])

  const handleSubmit = async (payload) => {
    if (editingContact) {
      await dispatch(updateContact({ id: editingContact.id, updates: payload }))
      setEditingContact(null)
      return
    }
    dispatch(addContact(payload))
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
  }

  const handleDelete = (id) => {
    dispatch(deleteContact(id))
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-content">
          <p className="eyebrow">Forest contacts</p>
          <h1>Leafline Directory</h1>
          <p className="subtitle">
            Keep your people organized with a calm, green-first contact hub.
          </p>
          <div className="hero-stats">
            <div>
              <span>Total</span>
              <strong>{items.length}</strong>
            </div>
            <div>
              <span>Filtered</span>
              <strong>{filteredContacts.length}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{status === 'loading' ? 'Loading' : 'Ready'}</strong>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <ContactForm
            initialContact={editingContact}
            onSubmit={handleSubmit}
            onCancel={() => setEditingContact(null)}
          />
        </div>
      </header>

      <main className="content">
        <section className="panel">
          <div className="panel-header">
            <h2>Search and filter</h2>
            <p>Find the people you need faster.</p>
          </div>
          <div className="panel-controls">
            <SearchBar value={search} onChange={(value) => dispatch(setSearch(value))} />
            <FilterBar value={filter} onChange={(value) => dispatch(setFilter(value))} />
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Contact list</h2>
            <p>Manage details, update, or remove contacts.</p>
          </div>
          {status === 'failed' && (
            <div className="error-banner">{error}</div>
          )}
          <ContactList
            contacts={filteredContacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  )
}

export default App
