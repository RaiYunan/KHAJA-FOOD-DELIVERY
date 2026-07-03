import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { verifyKhaltiAPI } from '@/features/order/orderAPI'

function PaymentVerify() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [state, setState] = useState('verifying') // verifying | success | failed
  const [message, setMessage] = useState('')

  useEffect(() => {
    const pidx = searchParams.get('pidx')
    const status = searchParams.get('status')

    if (!pidx) {
      setState('failed')
      setMessage('Missing payment reference')
      return
    }

    if (status === 'User canceled') {
      setState('failed')
      setMessage('Payment was cancelled')
      return
    }

    verifyKhaltiAPI(pidx)
      .then(() => setState('success'))
      .catch((err) => {
        setState('failed')
        setMessage(err.response?.data?.message || 'Payment verification failed')
      })
  }, [searchParams])

  return (
    <div className="bg-cream dark:bg-surface-dark min-h-screen flex items-center justify-center px-6">
      <div className="max-w-sm w-full text-center">
        {state === 'verifying' && (
          <>
            <Loader2 size={40} className="animate-spin text-chili mx-auto mb-5" />
            <h1 className="font-display text-2xl font-bold text-ink dark:text-text-dark mb-2">
              Verifying your payment
            </h1>
            <p className="font-body text-sm text-ink/50 dark:text-text-dark/50">
              Hang tight, this only takes a moment.
            </p>
          </>
        )}

        {state === 'success' && (
          <>
            <CheckCircle2 size={44} className="text-cardamom mx-auto mb-5" />
            <h1 className="font-display text-2xl font-bold text-ink dark:text-text-dark mb-2">
              Payment successful
            </h1>
            <p className="font-body text-sm text-ink/50 dark:text-text-dark/50 mb-7">
              Your order has been confirmed and is on its way to the kitchen.
            </p>
            <button
              onClick={() => navigate('/orders')}
              className="inline-flex items-center gap-2 bg-ink dark:bg-chili text-cream font-body font-semibold text-sm px-6 py-3 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors"
            >
              View my orders
            </button>
          </>
        )}

        {state === 'failed' && (
          <>
            <XCircle size={44} className="text-chili mx-auto mb-5" />
            <h1 className="font-display text-2xl font-bold text-ink dark:text-text-dark mb-2">
              Payment failed
            </h1>
            <p className="font-body text-sm text-ink/50 dark:text-text-dark/50 mb-7">
              {message}
            </p>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 border border-ink/15 dark:border-border-dark text-ink dark:text-text-dark font-body font-semibold text-sm px-6 py-3 rounded-sm hover:border-chili hover:text-chili transition-colors"
            >
              Go to my orders
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default PaymentVerify