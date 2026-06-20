import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as cartAPI from './cartAPI'
import toast from 'react-hot-toast'

export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await cartAPI.fetchCart()
      return data.cart
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await cartAPI.addItemToCart(productId, quantity)
      toast.success('Added to cart')
      return data.cart
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add item'
      toast.error(message)
      return rejectWithValue(message)
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await cartAPI.updateItemQuantity(productId, quantity)
      return data.cart
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update item')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await cartAPI.removeItemFromCart(productId)
      toast.success('Item removed')
      return data.cart
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item')
    }
  }
)

const initialState = {
  items: [],
  totalAmount: 0,
  status: 'idle',
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartLocal: (state) => {
      state.items = []
      state.totalAmount = 0
    },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.items = action.payload.items
      state.totalAmount = action.payload.totalAmount
      state.status = 'succeeded'
    }

    builder
      .addCase(getCart.fulfilled, setCart)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeFromCart.fulfilled, setCart)
  },
})

export const { clearCartLocal } = cartSlice.actions
export default cartSlice.reducer