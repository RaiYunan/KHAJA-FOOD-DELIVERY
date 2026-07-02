import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, MapPin, Phone, CreditCard, Banknote } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { placeOrder, clearCurrentOrder } from '@/features/order/orderSlice'
import { initiateKhaltiAPI } from '@/features/order/orderAPI'

const checkoutSchema = z.object({
  street: z.string().min(5, 'Enter your full street address'),
  city: z.string().min(2, 'Enter your city'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  paymentMethod: z.enum(['cash', 'khalti']),
  note: z.string().optional(),
})

const paymentOptions = [
  {
    value: 'cash',
    label: 'Cash on delivery',
    description: 'Pay when your order arrives',
    icon: Banknote,
  },
  {
    value: 'khalti',
    label: 'Khalti',
    description: 'Pay securely via Khalti wallet',
    icon: CreditCard,
  },
]

function Checkout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { items, totalAmount } = useAppSelector((state) => state.cart)
  const { placeStatus, currentOrder } = useAppSelector((state) => state.order)
  const { user } = useAppSelector((state) => state.auth)

  const isLoading = placeStatus === 'loading'

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      phone: user?.phone || '',
      paymentMethod: 'cash',
    },
  })

  const paymentMethod = watch('paymentMethod')

  useEffect(() => {
    if (items.length === 0 && placeStatus !== 'succeeded') {
      navigate('/cart')
    }
  }, [items, placeStatus, navigate])

  useEffect(() => {
    return () => {
      dispatch(clearCurrentOrder())
    }
  }, [dispatch])

  const onSubmit = async (formData) => {
    const result = await dispatch(
      placeOrder({
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        note: formData.note || '',
      })
    )

    if (placeOrder.fulfilled.match(result)) {
      const order = result.payload

      if (formData.paymentMethod === 'khalti') {
        try {
          const { data } = await initiateKhaltiAPI(order._id)
          window.location.href = data.paymentUrl
        } catch {
          toast.error('Khalti initiation failed — try cash on delivery')
        }
      }else {
        navigate('/orders')
      }
    }
  }

  return (
    <div className="bg-cream dark:bg-surface-dark min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink dark:text-text-dark mb-10">
          Checkout
        </h1>

        <div className="grid md:grid-cols-[1fr_320px] gap-10 items-start">
          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
            noValidate
          >
            {/* Delivery address */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={16} className="text-chili" />
                <h2 className="font-body font-semibold text-ink dark:text-text-dark">
                  Delivery address
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                <Field label="Street address" error={errors.street?.message}>
                  <input
                    type="text"
                    placeholder="Mahendrapath, Ward 5"
                    {...register('street')}
                    className={inputClass(errors.street)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="City" error={errors.city?.message}>
                    <input
                      type="text"
                      placeholder="Dharan"
                      {...register('city')}
                      className={inputClass(errors.city)}
                    />
                  </Field>

                  <Field label="Phone number" error={errors.phone?.message}>
                    <div className="relative">
                      <Phone
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30 dark:text-text-dark/30"
                      />
                      <input
                        type="tel"
                        placeholder="98XXXXXXXX"
                        {...register('phone')}
                        className={`${inputClass(errors.phone)} pl-10`}
                      />
                    </div>
                  </Field>
                </div>

                <Field label="Note for kitchen (optional)" error={null}>
                  <input
                    type="text"
                    placeholder="Extra spicy, no onions..."
                    {...register('note')}
                    className={inputClass(null)}
                  />
                </Field>
              </div>
            </section>

            {/* Payment method */}
            <section>
              <div className="flex items-center gap-2 mb-5">
                <CreditCard size={16} className="text-chili" />
                <h2 className="font-body font-semibold text-ink dark:text-text-dark">
                  Payment method
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {paymentOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = paymentMethod === option.value
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-chili bg-chili/5 dark:bg-chili/10'
                          : 'border-ink/10 dark:border-border-dark hover:border-ink/25 dark:hover:border-text-dark/25'
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        {...register('paymentMethod')}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-chili'
                            : 'border-ink/25 dark:border-text-dark/25'
                        }`}
                      >
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-chili" />
                        )}
                      </div>
                      <Icon
                        size={18}
                        className={
                          isSelected
                            ? 'text-chili'
                            : 'text-ink/40 dark:text-text-dark/40'
                        }
                      />
                      <div>
                        <p className="font-body font-semibold text-sm text-ink dark:text-text-dark">
                          {option.label}
                        </p>
                        <p className="font-body text-xs text-ink/50 dark:text-text-dark/50">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </section>

            {/* Submit — mobile only, desktop is in summary */}
            <div className="md:hidden">
              <SubmitButton isLoading={isLoading} method={paymentMethod} />
            </div>
          </form>

          {/* Order summary */}
          <div className="bg-clay-light/40 dark:bg-card-dark border border-ink/8 dark:border-border-dark rounded-lg p-6 sticky top-28">
            <h2 className="font-display text-lg font-bold text-ink dark:text-text-dark mb-5">
              Your order
            </h2>

            <div className="flex flex-col gap-2.5 mb-5">
              {items.map((item) => {
                const product = item.product
                const name =
                  typeof product === 'object' ? product.name : item.name
                return (
                  <div
                    key={typeof product === 'object' ? product._id : product}
                    className="flex justify-between font-body text-sm"
                  >
                    <span className="text-ink/70 dark:text-text-dark/70">
                      {name}{' '}
                      <span className="text-ink/40 dark:text-text-dark/40">
                        ×{item.quantity}
                      </span>
                    </span>
                    <span className="text-ink dark:text-text-dark font-medium">
                      Rs. {item.price * item.quantity}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="h-px bg-ink/10 dark:bg-border-dark mb-5" />

            <div className="flex justify-between font-body text-sm text-ink/70 dark:text-text-dark/70 mb-2">
              <span>Delivery</span>
              <span className="text-cardamom font-medium">Free</span>
            </div>

            <div className="flex justify-between font-body font-bold text-ink dark:text-text-dark text-base mb-6">
              <span>Total</span>
              <span>Rs. {totalAmount}</span>
            </div>

            <div className="hidden md:block">
              <SubmitButton isLoading={isLoading} method={paymentMethod} onClick={handleSubmit(onSubmit)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmitButton({ isLoading, method, onClick }) {
  return (
    <button
      type={onClick ? 'button' : 'submit'}
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 bg-ink dark:bg-chili text-cream font-body font-semibold py-3.5 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {isLoading && <Loader2 size={16} className="animate-spin" />}
      {method === 'khalti' ? 'Pay with Khalti' : 'Place order'}
    </button>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="font-body text-sm font-medium text-ink/70 dark:text-text-dark/70 mb-1.5 block">
        {label}
      </label>
      {children}
      {error && (
        <p className="font-body text-xs text-chili mt-1.5">{error}</p>
      )}
    </div>
  )
}

function inputClass(error) {
  return `w-full font-body bg-cream dark:bg-surface-dark border ${
    error ? 'border-chili' : 'border-ink/15 dark:border-border-dark'
  } rounded-sm px-4 py-3 text-ink dark:text-text-dark placeholder:text-ink/30 dark:placeholder:text-text-dark/30 focus:outline-none focus:border-chili transition-colors`
}

export default Checkout