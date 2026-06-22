import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import * as cartAPI from './cartAPI'

// Thunks
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
      return rejectWithValue(err.response?.data?.message || 'Failed to update')
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
      return rejectWithValue(err.response?.data?.message || 'Failed to remove')
    }
  }
)

export const clearCartAPI = createAsyncThunk(
  'cart/clearCartAPI',
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart()
      return { items: [], totalAmount: 0 }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to clear cart')
    }
  }
)

const initialState = {
  items: [],
  totalAmount: 0,
  status: 'idle',
  actionStatus: 'idle', 
  error: null,
}

const setCartState = (state, action) => {
  state.items = action.payload?.items || []
  state.totalAmount = action.payload?.totalAmount || 0
  state.status = 'succeeded'
  state.actionStatus = 'idle'
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartLocal: (state) => {
      state.items = []
      state.totalAmount = 0
      state.status = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      // getCart
      .addCase(getCart.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getCart.fulfilled, setCartState)
      .addCase(getCart.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })

      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.actionStatus = 'loading'
      })
      .addCase(addToCart.fulfilled, setCartState)
      .addCase(addToCart.rejected, (state) => {
        state.actionStatus = 'failed'
      })

      // updateCartItem
      .addCase(updateCartItem.fulfilled, setCartState)

      // removeFromCart
      .addCase(removeFromCart.fulfilled, setCartState)

      // clearCartAPI
      .addCase(clearCartAPI.fulfilled, setCartState)
  },
})

export const { clearCartLocal } = cartSlice.actions
export default cartSlice.reducer