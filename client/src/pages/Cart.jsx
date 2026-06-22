import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCartAPI,
} from '@/features/cart/cartSlice'

function Cart() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items, totalAmount, status } = useAppSelector((state) => state.cart)

  useEffect(() => {
    dispatch(getCart())
  }, [dispatch])

  const handleQuantityChange = (productId, currentQty, delta) => {
    const next = currentQty + delta
    if (next < 1) return
    dispatch(updateCartItem({ productId, quantity: next }))
  }

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId))
  }

  const handleClear = () => {
    dispatch(clearCartAPI())
  }

  if (status === 'loading') {
    return <CartSkeleton />
  }

  if (!items || items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="bg-cream dark:bg-surface-dark min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink dark:text-text-dark">
            Your cart
          </h1>
          <button
            type="button"
            onClick={handleClear}
            className="font-body text-sm text-ink/40 dark:text-text-dark/40 hover:text-chili transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="grid md:grid-cols-[1fr_320px] gap-10 items-start">
          {/* Cart items */}
          <div className="flex flex-col divide-y divide-ink/8 dark:divide-border-dark">
            {items.map((item) => {
              const product = item.product
              const productId =
                typeof product === 'object' ? product._id : product

              const name =
                typeof product === 'object' ? product.name : item.name
              const image =
                typeof product === 'object' ? product.image : item.image
              const price = item.price

              const imageSrc = image
                ? image.startsWith('http')
                  ? image
                  : `${import.meta.env.VITE_SOCKET_URL}${image}`
                : null

              return (
                <div key={productId} className="flex gap-4 py-5">
                  {/* Image */}
                  <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-clay-light dark:bg-card-dark">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-display text-ink/20 dark:text-text-dark/20">
                        {name?.[0]}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-ink dark:text-text-dark truncate">
                      {name}
                    </h3>
                    <p className="font-body text-sm text-ink/50 dark:text-text-dark/50 mt-0.5">
                      Rs. {price} each
                    </p>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="inline-flex items-center gap-3 bg-clay-light dark:bg-card-dark rounded-full px-2 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(productId, item.quantity, -1)
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-cream dark:hover:bg-surface-dark transition-colors text-ink dark:text-text-dark"
                          aria-label="Decrease"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="font-body font-semibold text-sm text-ink dark:text-text-dark w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(productId, item.quantity, 1)
                          }
                          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-cream dark:hover:bg-surface-dark transition-colors text-ink dark:text-text-dark"
                          aria-label="Increase"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(productId)}
                        className="p-1.5 text-ink/30 dark:text-text-dark/30 hover:text-chili transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="shrink-0 text-right">
                    <span className="font-body font-bold text-ink dark:text-text-dark">
                      Rs. {price * item.quantity}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order summary */}
          <div className="bg-clay-light/40 dark:bg-card-dark border border-ink/8 dark:border-border-dark rounded-lg p-6 sticky top-28">
            <h2 className="font-display text-lg font-bold text-ink dark:text-text-dark mb-5">
              Order summary
            </h2>

            <div className="flex flex-col gap-3 font-body text-sm">
              <div className="flex justify-between text-ink/70 dark:text-text-dark/70">
                <span>
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span>Rs. {totalAmount}</span>
              </div>
              <div className="flex justify-between text-ink/70 dark:text-text-dark/70">
                <span>Delivery</span>
                <span className="text-cardamom font-medium">Free</span>
              </div>
            </div>

            <div className="h-px bg-ink/10 dark:bg-border-dark my-5" />

            <div className="flex justify-between font-body font-bold text-ink dark:text-text-dark mb-6">
              <span>Total</span>
              <span>Rs. {totalAmount}</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 bg-ink dark:bg-chili text-cream font-body font-semibold py-3.5 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors"
            >
              Proceed to checkout
              <ArrowRight size={16} />
            </button>

            <Link
              to="/menu"
              className="block text-center font-body text-sm text-ink/50 dark:text-text-dark/50 hover:text-chili mt-4 transition-colors"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="bg-cream dark:bg-surface-dark min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <ShoppingBag
          size={40}
          className="text-ink/15 dark:text-text-dark/15 mx-auto mb-5"
          strokeWidth={1.25}
        />
        <h2 className="font-display text-2xl font-bold text-ink dark:text-text-dark mb-2">
          Your cart is empty
        </h2>
        <p className="font-body text-ink/50 dark:text-text-dark/50 mb-8">
          Add something from the menu and it'll show up here.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 bg-ink dark:bg-chili text-cream font-body font-semibold px-6 py-3.5 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors"
        >
          Browse menu
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="h-9 w-40 bg-clay-light dark:bg-card-dark rounded animate-pulse mb-10" />
      <div className="grid md:grid-cols-[1fr_320px] gap-10">
        <div className="flex flex-col gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 py-5">
              <div className="w-20 h-20 bg-clay-light dark:bg-card-dark rounded-md animate-pulse shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 w-1/2 bg-clay-light dark:bg-card-dark rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-clay-light dark:bg-card-dark rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-64 bg-clay-light dark:bg-card-dark rounded-lg animate-pulse" />
      </div>
    </div>
  )
}

export default Cart