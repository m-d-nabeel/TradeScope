import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/market/')({
  component: () => <div>Hello /market/!</div>,
})
