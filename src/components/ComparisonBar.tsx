import { X } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { clearComparison, getComparison, removeFromComparison } from '../lib/comparison';
import { getAllControllerDocs } from '../lib/controllers.content';

export function ComparisonBar() {
  const [comparison, setComparison] = React.useState(getComparison());

  React.useEffect(() => {
    const handleStorage = () => setComparison(getComparison());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (comparison.length === 0) return null;

  const allDocs = getAllControllerDocs();
  const selectedDocs = comparison
    .map((c) => allDocs.find((d) => d.meta.company === c.company && d.meta.controller === c.controller))
    .filter(Boolean);

  const handleCompare = () => {
    if (comparison.length === 2) {
      const [c1, c2] = comparison;
      window.location.href = `/compare/${c1.company}/${c1.controller}/${c2.company}/${c2.controller}`;
    }
  };

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-border border-t bg-card p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span className="whitespace-nowrap font-semibold">Compare ({comparison.length}/2):</span>
          <div className="flex min-w-0 flex-1 gap-2">
            {selectedDocs.map((doc) =>
              doc ? (
                <div key={doc.slug} className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1">
                  <span className="truncate">{doc.meta.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      removeFromComparison(doc.meta.company, doc.meta.controller);
                      setComparison(getComparison());
                    }}
                    className="hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : null,
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearComparison();
              setComparison([]);
            }}
          >
            Clear
          </Button>
          <Button size="sm" onClick={handleCompare} disabled={comparison.length !== 2}>
            Compare
          </Button>
        </div>
      </div>
    </div>
  );
}
