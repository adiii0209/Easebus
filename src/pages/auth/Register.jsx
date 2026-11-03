import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, User, Phone } from 'lucide-react'
import { Field, Spinner } from '../../components/ui'
import { AuthShell, PasswordField } from './AuthShell'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
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

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\+\-\(\)\s]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)

      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        // In a real app, you would handle registration here
        // For now, just redirect to login page
        navigate('/login')
      }, 1500)
    }
  }

  const common = { onChange: handleInputChange }

  return (
    <AuthShell
      title="Create account"
      subtitle="Join EaseBus for a seamless journey"
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary-600">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <Field id="firstName" name="firstName" label="First name" icon={User} value={formData.firstName} placeholder="John" error={errors.firstName} autoComplete="given-name" {...common} />
          <Field id="lastName" name="lastName" label="Last name" value={formData.lastName} placeholder="Doe" error={errors.lastName} autoComplete="family-name" {...common} />
        </div>
        <Field id="email" name="email" type="email" label="Email" icon={Mail} value={formData.email} placeholder="you@example.com" error={errors.email} autoComplete="email" {...common} />
        <Field id="phone" name="phone" type="tel" label="Phone number" icon={Phone} value={formData.phone} placeholder="(123) 456-7890" error={errors.phone} autoComplete="tel" {...common} />
        <PasswordField id="password" name="password" label="Password" value={formData.password} placeholder="At least 8 characters" error={errors.password} autoComplete="new-password" {...common} />
        <PasswordField id="confirmPassword" name="confirmPassword" label="Confirm password" value={formData.confirmPassword} placeholder="••••••••" error={errors.confirmPassword} autoComplete="new-password" {...common} />

        <div>
          <label htmlFor="agreeToTerms" className="flex cursor-pointer items-start gap-2.5 text-sm text-gray-600">
            <input
              id="agreeToTerms" name="agreeToTerms" type="checkbox"
              checked={formData.agreeToTerms} onChange={handleInputChange}
              className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-md border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span>
              I agree to the <Link to="/terms" className="font-medium text-primary-600">Terms of Service</Link> and{' '}
              <Link to="/privacy" className="font-medium text-primary-600">Privacy Policy</Link>
            </span>
          </label>
          {errors.agreeToTerms && <p className="pt-1.5 text-[13px] text-red-500">{errors.agreeToTerms}</p>}
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={isLoading}>
          {isLoading ? (<><Spinner className="h-5 w-5" /> Creating account…</>) : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}

export default Register
