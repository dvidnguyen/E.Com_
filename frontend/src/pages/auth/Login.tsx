import { LoginForm } from "../../components/auth/login-form"
import { useAppDispatch, useAppSelector } from "../../store"
import { loginUser, selectAuthLoading, selectAuthError, selectIsAuthenticated } from "../../store/slices/authSlice.ts"
import { addToast } from "../../store/slices/uiSlice.ts"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isLoading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await dispatch(loginUser(data)).unwrap()

      // Show success toast
      dispatch(addToast({
        type: 'success',
        message: 'Login successful! Welcome back.',
      }))

      // Navigate to home page
      navigate('/')
    } catch (error) {
      // Error is already handled by the slice
      console.error('Login failed:', error)
    }
  }
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left Panel - Login Form */}
      <div className="flex flex-col p-8 lg:p-16">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Your Logo</h1>
        </div>

        {/* Login Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Dark Background with Image */}
      <div className="p-5 hidden lg:block">
        <div
          className="h-full w-full rounded-lg relative overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.87)' }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="https://d23d66lis8iz5d.cloudfront.net/Saly-10.png"
              alt="E-commerce illustration"
              className="w-130 h-auto object-contain opacity-100"
            />
          </div>

          {/* Bottom Right Corner Element */}
          <div className="absolute bottom-6 right-6 flex flex-col items-end space-y-2">
            {/* Animated Shopping Cart */}
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7m-7 0a2 2 0 100 4 2 2 0 000-4zm7 0a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
            </div>

            {/* Welcome Text */}
            <div className="text-white/80 text-right">
              <div className="text-sm font-medium">Welcome back!</div>
              <div className="text-xs">Start shopping today</div>
            </div>

            {/* Floating Dots */}
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
