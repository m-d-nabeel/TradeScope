import { AssetsComponent } from '@/components/assets'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/assets/')({
  component: AssetsComponent,
})
