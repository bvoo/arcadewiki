import React from 'react'
import { getComparison, clearComparison, removeFromComparison } from '../lib/comparison'
import { getAllControllerDocs } from '../lib/controllers.content'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

export function ComparisonBar() {
  const [comparison, setComparison] = React.useState(getComparison())

  React.useEffect(() => {
    const handleStorage = () => setComparison(getComparison())
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  if (comparison.length === 0) return null

  const allDocs = getAllControllerDocs()
  const selectedDocs = comparison
    .map(c => allDocs.find(d => d.meta.company === c.company && d.meta.controller === c.controller))
    .filter(Boolean)

  const handleCompare = () => {
    if (comparison.length === 2) {
      const [c1, c2] = comparison
      window.location.href = `/compare/${c1.company}/${c1.controller}/${c2.company}/${c2.controller}`
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="font-semibold whitespace-nowrap">Compare ({comparison.length}/2):</span>
          <div className="flex gap-2 flex-1 min-w-0">
            {selectedDocs.map((doc, i) => doc && (
              <div key={i} className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md">
                <span className="truncate">{doc.meta.name}</span>
                <button
                  onClick={() => {
                    removeFromComparison(comparison[i].company, comparison[i].controller)
                    setComparison(getComparison())
                  }}
                  className="hover:text-destructive"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearComparison()
              setComparison([])
            }}
          >
            Clear
          </Button>
          <Button
            size="sm"
            onClick={handleCompare}
            disabled={comparison.length !== 2}
          >
            Compare
          </Button>
        </div>
      </div>
    </div>
  )
}
