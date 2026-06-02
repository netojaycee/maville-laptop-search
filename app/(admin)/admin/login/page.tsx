'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Required'),
})

type FormData = z.infer<typeof schema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError('')
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080B11]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-2xl border border-[#1E2530] bg-[#0F1318] p-8"
      >
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-white">
            Maville<span className="text-[#00D4FF]">Technologies</span>
          </h1>
          <p className="mt-1 text-sm text-[#8B97A8]">Admin login</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register('email')}
              type="email"
              placeholder="admin@example.com"
              className="border-[#1E2530] bg-[#161B23] text-white placeholder:text-[#8B97A8]"
            />
            {errors.email && <p className="mt-1 text-xs text-[#FF6B35]">{errors.email.message}</p>}
          </div>
          <div>
            <Input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="border-[#1E2530] bg-[#161B23] text-white placeholder:text-[#8B97A8]"
            />
            {errors.password && <p className="mt-1 text-xs text-[#FF6B35]">{errors.password.message}</p>}
          </div>

          {error && (
            <p className="rounded-lg bg-[#FF6B35]/10 px-3 py-2 text-sm text-[#FF6B35]">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#00D4FF] text-black font-semibold hover:bg-[#00bfe6] disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
