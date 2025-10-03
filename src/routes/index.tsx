import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { EditOnGitHub } from '@/components/EditOnGitHub'
import { SiteHeader } from '@/components/SiteHeader'
import { BookmarkedControllers } from '@/components/BookmarkedControllers'
import { ControllersTable } from '@/components/ControllersTable'

export const Route = createFileRoute('/')({
  component: ControllersHome,
})

function ControllersHome() {
  const [globalFilter, setGlobalFilter] = React.useState('')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="p-6">
        <DebouncedInput
          value={globalFilter}
          onChange={(v) => setGlobalFilter(String(v))}
          placeholder="Search controllers..."
          className="w-full mb-4"
          debounce={50}
        />
        <div className="grid lg:grid-cols-[1fr_384px] gap-4">
          <div className="min-w-0">
            <ControllersTable globalFilter={globalFilter} />
          </div>
          <div className="hidden lg:block">
            <BookmarkedControllers />
          </div>
        </div>
        <div className="lg:hidden mt-4">
          <BookmarkedControllers />
        </div>
        <EditOnGitHub filePath="src/routes/index.tsx" />
      </div>
    </div>
  )
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 400,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState(initialValue)
  React.useEffect(() => setValue(initialValue), [initialValue])
  React.useEffect(() => {
    const t = setTimeout(() => onChange(value), debounce)
    return () => clearTimeout(t)
  }, [value, debounce, onChange])
  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}
