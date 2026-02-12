import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://698d85bbb79d1c928ed59d0f.mockapi.io/contacts',
})

export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async () => {
    const response = await api.get('/')
    return response.data
  }
)

export const addContact = createAsyncThunk(
  'contacts/add',
  async (contact) => {
    const response = await api.post('/', contact)
    return response.data
  }
)

export const updateContact = createAsyncThunk(
  'contacts/update',
  async ({ id, updates }) => {
    const response = await api.put(`/${id}`, updates)
    return response.data
  }
)

export const deleteContact = createAsyncThunk(
  'contacts/delete',
  async (id) => {
    await api.delete(`/${id}`)
    return id
  }
)

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch contacts'
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (contact) => contact.id === action.payload.id
        )
        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (contact) => contact.id !== action.payload
        )
      })
  },
})

export default contactsSlice.reducer
