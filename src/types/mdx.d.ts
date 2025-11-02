declare module '*.mdx' {
  import type * as React from 'react';
  const ReactComponent: React.FC<Record<string, never>>;
  // Some MDX setups export frontmatter as a single object named `frontmatter`,
  // others re-export keys as named exports. We accommodate both.
  // biome-ignore lint/suspicious/noExplicitAny: MDX frontmatter has dynamic structure
  export const frontmatter: any;
  const MDXComponent: typeof ReactComponent;
  export default MDXComponent;
}
