import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as productAPI from './productAPI'

export const getProducts = createAsyncThunk(
  'product/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await productAPI.fetchAllProducts()
      return data.products
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load menu')
    }
  }
)

const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export default productSlice.reducer