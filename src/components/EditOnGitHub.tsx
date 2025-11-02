import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditOnGitHubProps {
  filePath: string;
  repo?: string;
}

export function EditOnGitHub({ filePath, repo = 'bvoo/arcadewiki' }: EditOnGitHubProps) {
  const githubUrl = `https://github.com/${repo}/edit/master/${filePath}`;

  return (
    <div className="mt-8 border-border border-t pt-6">
      <Button asChild variant="outline" size="sm">
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
          <ExternalLink className="size-4" />
          Edit this page on GitHub
        </a>
      </Button>
    </div>
  );
}
