import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { register as registerThunk } from '@/features/auth/authSlice'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().min(10, 'Enter a valid phone number'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status } = useAppSelector((state) => state.auth)
  const isLoading = status === 'loading'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    const result = await dispatch(registerThunk(data))
    if (registerThunk.fulfilled.match(result)) navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl grid md:grid-cols-2 border border-ink/10 rounded-sm overflow-hidden shadow-[0_1px_0_0_rgba(26,20,16,0.05)]">
        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-between bg-chili text-cream p-10 relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="font-display text-xl font-bold">
              Khaja.
            </Link>
          </div>

          <div className="relative z-10">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-cream/70 mb-4">
              New here
            </p>
            <h2 className="font-display text-4xl font-bold leading-[1.05]">
              Three steps to your first order.
            </h2>
          </div>

          <div className="relative z-10 font-body text-cream/60 text-sm">
            Real Nepali food, from kitchens across Biratnagar.
          </div>

          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full border-20 border-cream/10" />
        </div>

        {/* Form panel */}
        <div className="bg-cream p-8 md:p-10 flex flex-col justify-center">
          <h1 className="font-display text-3xl font-bold text-ink mb-1">
            Create account
          </h1>
          <p className="font-body text-ink/50 mb-8">
            Takes less than a minute.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <Field label="Full name" error={errors.name?.message}>
              <input
                type="text"
                placeholder="Yunan Rai"
                {...register('name')}
                className={inputClass(errors.name)}
              />
            </Field>

            <Field label="Email" error={errors.email?.message}>
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className={inputClass(errors.email)}
              />
            </Field>

            <Field label="Phone number" error={errors.phone?.message}>
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                {...register('phone')}
                className={inputClass(errors.phone)}
              />
            </Field>

            <Field label="Password" error={errors.password?.message}>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`${inputClass(errors.password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            <Field
              label="Confirm password"
              error={errors.confirmPassword?.message}
            >
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={inputClass(errors.confirmPassword)}
              />
            </Field>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ink text-cream font-body font-semibold py-3.5 rounded-sm hover:bg-chili transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              Create account
            </button>
          </form>

          <p className="font-body text-sm text-ink/50 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-chili font-semibold hover:text-chili-dark">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="font-body text-sm font-medium text-ink/70 mb-1.5 block">
        {label}
      </label>
      {children}
      {error && <p className="font-body text-xs text-chili mt-1.5">{error}</p>}
    </div>
  )
}

function inputClass(error) {
  return `w-full font-body bg-cream border ${
    error ? 'border-chili' : 'border-ink/15'
  } rounded-sm px-4 py-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-chili transition-colors`
}

export default Register