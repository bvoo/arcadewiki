declare module '*.mdx' {
  import * as React from 'react'
  const ReactComponent: React.FC<any>
  // Some MDX setups export frontmatter as a single object named `frontmatter`,
  // others re-export keys as named exports. We accommodate both.
  export const frontmatter: any
  const MDXComponent: typeof ReactComponent
  export default MDXComponent
}
