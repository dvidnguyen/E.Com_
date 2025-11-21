import { SignupForm } from "@/components/auth/signup-form"

export default function RegisterPage() {
  return (
    <div className="grid h-screen lg:grid-cols-2">
      {/* Left Panel - Signup Form */}
      <div className="flex flex-col p-4 lg:p-8 overflow-y-auto lg:overflow-y-visible">
        {/* Logo */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Your Logo</h1>
        </div>

        {/* Signup Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <SignupForm />
          </div>
        </div>
      </div>

      {/* Right Panel - Simple Dark Background */}
      <div className="p-5 hidden lg:block">
        <div
          className="h-full w-full rounded-lg"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.87)' }}
        >
        </div>
      </div>
    </div>
  )
}