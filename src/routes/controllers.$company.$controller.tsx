import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { getControllerDoc } from '../lib/controllers.content'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { EditOnGitHub } from '@/components/EditOnGitHub'
import { SiteHeader } from '@/components/SiteHeader'
import { SimilarControllers } from '@/components/SimilarControllers'
import { getSimilarControllers } from '../lib/similarControllers'
import { isBookmarked, toggleBookmark } from '../lib/bookmarks'
import { InfoCard } from '@/components/InfoCard'

export const Route = createFileRoute('/controllers/$company/$controller')({
  component: ControllerContentPage,
})

function ControllerContentPage() {
  const { company, controller } = Route.useParams()
  const doc = getControllerDoc(company, controller)

  if (!doc) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6">
        <h1 className="text-xl font-bold">Controller not found</h1>
        <p className="text-muted-foreground">No controller at {company}/{controller}.</p>
      </div>
    )
  }

  const { meta, Component } = doc

  const switchItems = Array.isArray(meta.switchType)
    ? meta.switchType
    : meta.switchType
      ? [meta.switchType]
      : []

  const similarControllers = getSimilarControllers(doc, 3)
  const [bookmarked, setBookmarked] = React.useState(() => isBookmarked(company, controller))

  const handleBookmarkToggle = () => {
    const newState = toggleBookmark(company, controller)
    setBookmarked(newState)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader 
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: meta.maker, href: '/' },
          { label: meta.name },
        ]}
        actions={
          <Button asChild variant="ghost" size="sm">
            <a href="/">
              <ArrowLeft className="size-4 mr-2" />
              Back to List
            </a>
          </Button>
        }
      />
      <div className="p-6">
      <div>
        <h1 className="text-2xl font-bold">{meta.name}</h1>
        <p className="text-muted-foreground">{meta.maker}</p>
      </div>
      <div className="h-4" />
      <div className="lg:flow-root">
        <InfoCard
          meta={meta}
          bookmarked={bookmarked}
          onBookmarkToggle={handleBookmarkToggle}
          switchItems={switchItems}
        />
        <div className="h-4 lg:h-0" />
        <article className="prose prose-invert max-w-none">
          <Component />
        </article>
        <SimilarControllers controllers={similarControllers} />
        <EditOnGitHub filePath={`src/content/${company}/${controller}/index.mdx`} />
      </div>
      </div>
    </div>
  )
}
