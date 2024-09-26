import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/logout/')({
  component: () => <div>Hello /logout/!</div>,
})
