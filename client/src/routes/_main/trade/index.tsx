import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/trade/')({
  component: () => <div>Hello /trade/!</div>,
})
