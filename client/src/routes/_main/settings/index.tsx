import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/settings/')({
  component: () => <div>Hello /settings/!</div>,
})
