import DashboardHome from '@/components/dashboard'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/dashboard/dashboard')({
  component: DashboardHome,
  beforeLoad: ({ context }) => {
    const { auth } = context
    console.log('beforeLoad auth state:', auth)
    if (!auth.isAuthenticated) {
      console.log('Redirecting to login...')
      return redirect({
        to: '/login',
        from: '/dashboard',
      })
    }
    console.log('User authenticated, proceeding to profile')
  },
})
