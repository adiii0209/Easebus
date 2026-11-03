import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Field, Spinner } from '../../components/ui'
import { AuthShell, PasswordField } from './AuthShell'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        // Mock user data - in a real app, this would come from your backend
        const userData = {
          name: 'John Doe',
          email: formData.email,
          role: 'passenger',
          avatar: '👤' // Adding default avatar
        }
        login(userData)
        navigate('/passenger-dashboard')
      }, 1500)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your journey"
      footer={<>Don’t have an account? <Link to="/register" className="font-semibold text-primary-600">Sign up</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Field
          id="email" name="email" type="email" label="Email" icon={Mail}
          value={formData.email} onChange={handleInputChange}
          placeholder="you@example.com" error={errors.email} autoComplete="email"
        />
        <PasswordField
          id="password" name="password" label="Password"
          value={formData.password} onChange={handleInputChange}
          placeholder="••••••••" error={errors.password} autoComplete="current-password"
        />

        <div className="flex items-center justify-between pt-1">
          <label htmlFor="rememberMe" className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-600">
            <input
              id="rememberMe" name="rememberMe" type="checkbox"
              checked={formData.rememberMe} onChange={handleInputChange}
              className="h-5 w-5 rounded-md border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-primary-600">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={isLoading}>
          {isLoading ? (<><Spinner className="h-5 w-5" /> Signing in…</>) : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  )
}

export default Login
