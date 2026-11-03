import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { User, Mail, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Field, Segmented } from '../../components/ui'
import { AuthShell, PasswordField } from './AuthShell'

const AuthPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Please fill in all fields')
      return
    }

    // For demo purposes, we'll simulate authentication
    // In a real app, you would make API calls here
    try {
      const userData = {
        id: Date.now().toString(),
        name: formData.name || 'User',
        email: formData.email,
        avatar: '👤'
      }

      login(userData)
      navigate('/passenger-dashboard')
    } catch (err) {
      setError('Authentication failed. Please try again.')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <AuthShell
      title={isLogin ? 'Welcome back' : 'Create account'}
      subtitle={isLogin ? 'Sign in to continue your journey' : 'Join EaseBus in a few seconds'}
    >
      <Segmented
        id="auth-mode"
        value={isLogin ? 'in' : 'up'}
        onChange={(v) => { setIsLogin(v === 'in'); setError('') }}
        options={[{ value: 'in', label: 'Sign in' }, { value: 'up', label: 'Sign up' }]}
        className="mb-5"
      />

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AnimatePresence initial={false}>
          {!isLogin && (
            <motion.div
              key="name"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden"
            >
              <Field id="name" name="name" label="Full name" icon={User} value={formData.name} onChange={handleChange} placeholder="Your name" autoComplete="name" />
            </motion.div>
          )}
        </AnimatePresence>

        <Field id="email" name="email" type="email" label="Email" icon={Mail} value={formData.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
        <PasswordField id="password" name="password" label="Password" value={formData.password} onChange={handleChange} placeholder="••••••••" autoComplete={isLogin ? 'current-password' : 'new-password'} />

        <AnimatePresence initial={false}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600"
              role="alert"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" className="btn btn-primary btn-lg btn-block">
          {isLogin ? 'Sign in' : 'Create account'}
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>
    </AuthShell>
  )
}

export default AuthPage
