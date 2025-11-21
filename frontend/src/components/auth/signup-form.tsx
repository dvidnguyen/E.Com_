import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Facebook, Github, Mail, User, Lock } from "lucide-react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-2", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-600">
            Fill in the form below to create your account
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Field>
            <FieldLabel htmlFor="name" className="text-gray-600 text-sm font-normal">
              Full Name
            </FieldLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-10 py-3 border-0 border-b border-gray-300 rounded-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black focus:border-b-2"
                required
              />
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="email" className="text-gray-600 text-sm font-normal">
              Email
            </FieldLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                className="pl-10 py-2 border-0 border-b border-gray-300 rounded-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black focus:border-b-2"
                required
              />
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="password" className="text-gray-600 text-sm font-normal">
              Password
            </FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10 py-2 border-0 border-b border-gray-300 rounded-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black focus:border-b-2"
                required
              />
            </div>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password" className="text-gray-600 text-sm font-normal">
              Confirm Password
            </FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                className="pl-10 py-2 border-0 border-b border-gray-300 rounded-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black focus:border-b-2"
                required
              />
            </div>
          </Field>

          <Button
            type="submit"
            className="w-full py-2 text-white font-medium rounded-lg"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.87)' }}
          >
            Create Account
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Facebook className="h-4 w-4 text-blue-600" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Github className="h-4 w-4 text-gray-900" />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="#" className="text-blue-800 font-bold hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </FieldGroup>
    </form>
  )
}
