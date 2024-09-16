import { createLazyFileRoute } from '@tanstack/react-router'
import { UserProfile } from '../components/user-profile'

export const Route = createLazyFileRoute('/profile')({
  component: UserProfile,
})
