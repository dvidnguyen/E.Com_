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
            {/* Animated Gift Box */}
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 animate-pulse">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>

            {/* Join Us Text */}
            <div className="text-white/80 text-right">
              <div className="text-sm font-medium">Join us today!</div>
              <div className="text-xs">Get exclusive offers</div>
            </div>

            {/* Floating Stars */}
            <div className="flex space-x-1">
              <div className="text-yellow-400 animate-spin text-xs">⭐</div>
              <div className="text-blue-400 animate-spin text-xs delay-300">💎</div>
              <div className="text-green-400 animate-spin text-xs delay-600">🎁</div>
            </div>
          </div>

          {/* Top Right Badge */}
          <div className="absolute top-6 right-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium animate-pulse">
              New Member Benefits
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}