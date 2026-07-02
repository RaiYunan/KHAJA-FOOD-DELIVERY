import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { connectSocket, disconnectSocket } from '@/lib/socket'
import { updateOrderStatusRealtime } from '@/features/order/orderSlice'

const STATUS_LABEL = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function useOrderSocket() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, token } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      disconnectSocket()
      return
    }

    const socket = connectSocket(token)

    const handleStatusUpdate = (payload) => {
      dispatch(updateOrderStatusRealtime(payload))
      toast.success(`Order status: ${STATUS_LABEL[payload.status] || payload.status}`)
    }

    socket.on('orderStatusUpdate', handleStatusUpdate)

    return () => {
      socket.off('orderStatusUpdate', handleStatusUpdate)
    }
  }, [isAuthenticated, token, dispatch])
}