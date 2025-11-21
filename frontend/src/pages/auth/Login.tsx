import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
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
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right side  */}

      <div className="p-5">
        <div
          className="h-full w-full bg-cover bg-center rounded-lg"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.87)' }}
        >
        </div>
      </div>
    </div>
  )
}
