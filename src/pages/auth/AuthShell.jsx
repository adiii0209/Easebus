import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bus, Eye, EyeOff, Lock } from 'lucide-react'
import { Field } from '../../components/ui'

export const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="relative min-h-[100dvh] overflow-hidden">
    {/* Brand backdrop */}
    <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-br from-indigo-600 via-purple-600 to-primary-600" />

    <div className="relative mx-auto flex max-w-md flex-col px-5 pb-12 pt-[calc(env(safe-area-inset-top)+2.5rem)]">
      <Link to="/" className="mx-auto mb-5 flex h-16 w-16 animate-scale-in items-center justify-center rounded-[22px] bg-white text-primary-600 shadow-ios-lg transition active:scale-90" aria-label="EaseBus home">
        <Bus className="h-8 w-8" strokeWidth={2.25} />
      </Link>
      <div className="mb-6 animate-slide-up text-center text-white">
        <h1 className="text-[26px] font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-[15px] text-white/75">{subtitle}</p>
      </div>

      <div className="card animate-slide-up p-5 shadow-ios-lg" style={{ animationDelay: '90ms' }}>{children}</div>

      {footer && <div className="mt-6 animate-fade-in text-center text-[15px] text-gray-500" style={{ animationDelay: '250ms' }}>{footer}</div>}
    </div>
  </div>
)

export const PasswordField = ({ label, error, ...props }) => {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Field label={label} icon={Lock} error={error} type={visible ? 'text' : 'password'} inputClassName="pr-11" {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-1.5 top-[31px] flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition active:scale-90 hover:text-gray-600"
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
      </button>
    </div>
  )
}
