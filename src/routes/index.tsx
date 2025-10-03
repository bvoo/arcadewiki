import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EditOnGitHub } from '@/components/EditOnGitHub'
import { SiteHeader } from '@/components/SiteHeader'
import { BookmarkedControllers } from '@/components/BookmarkedControllers'
import { ControllersTable } from '@/components/ControllersTable'
import { ComparisonBar } from '@/components/ComparisonBar'

export const Route = createFileRoute('/')({
  component: ControllersHome,
})

function ControllersHome() {
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [comparisonEnabled, setComparisonEnabled] = React.useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem('comparison-enabled')
    return stored === 'true'
  })

  const toggleComparison = () => {
    const newValue = !comparisonEnabled
    setComparisonEnabled(newValue)
    localStorage.setItem('comparison-enabled', String(newValue))
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="p-6">
        <div className="flex gap-4 mb-4">
          <DebouncedInput
            value={globalFilter}
            onChange={(v) => setGlobalFilter(String(v))}
            placeholder="Search controllers..."
            className="flex-1"
            debounce={50}
          />
          <Button
            variant={comparisonEnabled ? 'default' : 'outline'}
            onClick={toggleComparison}
          >
            {comparisonEnabled ? 'Disable' : 'Enable'} Comparison
          </Button>
        </div>
        <BookmarkedControllers enableComparison={comparisonEnabled} />
        <div className="h-4" />
        <ControllersTable globalFilter={globalFilter} enableComparison={comparisonEnabled} />
        <EditOnGitHub filePath="src/routes/index.tsx" />
      </div>
      <ComparisonBar />
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
