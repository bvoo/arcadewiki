import satori from 'satori'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import React from 'react'
import { Resvg } from '@resvg/resvg-js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function loadFont(family: 'Inter' | 'Roboto+Mono', weight: 400 | 700) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`
  const css = await fetch(url).then(res => res.text())
  const fontUrl = css.match(/url\((https:\/\/[^)]+)\)/)?.[1]
  if (!fontUrl) throw new Error('Could not find font URL')
  
  const fontData = await fetch(fontUrl).then(res => res.arrayBuffer())
  return Buffer.from(fontData)
}

function parseFrontmatter(content: string) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
  const match = content.match(frontmatterRegex)
  if (!match) return null
  
  try {
    const yamlContent = match[1]
    const meta: any = {}
    
    const lines = yamlContent.split('\n')
    let currentKey = ''
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      
      if (line.startsWith('  ') && currentKey) {
        if (line.trim().startsWith('-')) {
          if (!Array.isArray(meta[currentKey])) {
            meta[currentKey] = []
          }
          meta[currentKey].push(line.trim().substring(1).trim())
        } else if (line.includes(':')) {
          const [subKey, subValue] = line.trim().split(':').map(s => s.trim())
          if (!meta[currentKey]) {
            meta[currentKey] = {}
          }
          meta[currentKey][subKey] = isNaN(Number(subValue)) ? subValue : Number(subValue)
        }
      } else if (line.includes(':')) {
        const colonIndex = line.indexOf(':')
        const key = line.substring(0, colonIndex).trim()
        let value = line.substring(colonIndex + 1).trim()
        
        currentKey = key
        
        if (value) {
          if (value === 'true') value = true as any
          else if (value === 'false') value = false as any
          else if (!isNaN(Number(value)) && value !== '') value = Number(value) as any
          
          meta[key] = value
        }
      }
    }
    
    return meta
  } catch (e) {
    console.error('Failed to parse frontmatter:', e)
    return null
  }
}

function findMDXFiles(dir: string): string[] {
  const files: string[] = []
  const items = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      files.push(...findMDXFiles(fullPath))
    } else if (item.name === 'index.mdx') {
      files.push(fullPath)
    }
  }
  
  return files
}

async function generateOGImages() {
  const contentDir = path.join(__dirname, '..', 'src', 'content')
  const mdxFiles = findMDXFiles(contentDir)
  const outputDir = path.join(__dirname, '..', 'public', 'og')
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  console.log('Loading fonts...')
  const [fontRegular, fontBold, monoRegular, monoBold] = await Promise.all([
    loadFont('Inter', 400),
    loadFont('Inter', 700),
    loadFont('Roboto+Mono', 400),
    loadFont('Roboto+Mono', 700),
  ])
  console.log('Fonts loaded!')

  let generated = 0

  for (const filePath of mdxFiles) {
    const content = fs.readFileSync(filePath, 'utf-8')
    const meta = parseFrontmatter(content)
    
    if (!meta) {
      console.log(`Skipping ${filePath} - no frontmatter found`)
      continue
    }
    
    if (!meta.company || !meta.controller) {
      console.log(`Skipping ${filePath} - missing required fields (company: ${meta.company || 'missing'}, controller: ${meta.controller || 'missing'})`)
      continue
    }
    const companyDir = path.join(outputDir, meta.company)
    
    if (!fs.existsSync(companyDir)) {
      fs.mkdirSync(companyDir, { recursive: true })
    }

    const svg = await satori(
      React.createElement(
        'div',
        {
          style: {
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0a0a0a',
            padding: '60px 80px',
            fontFamily: 'sans-serif',
          },
        },
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            },
          },
          React.createElement('div', {
            style: {
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#ffffff',
              lineHeight: 1.1,
            },
          }, meta.name),
          React.createElement('div', {
            style: {
              fontSize: '42px',
              color: '#888888',
            },
          }, `by ${meta.maker}`)
        ),
        React.createElement(
          'div',
          {
            style: {
              display: 'flex',
              gap: '60px',
              width: '100%',
            },
          },
          React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                flex: 1,
              },
            },
            ...[
              meta.buttonType && React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '20px',
                    fontSize: '32px',
                    fontFamily: 'monospace',
                  },
                },
                React.createElement('span', { style: { color: '#666666' } }, 'Buttons:'),
                React.createElement('span', { style: { color: '#ffffff' } }, 
                  meta.buttonType.charAt(0).toUpperCase() + meta.buttonType.slice(1)
                )
              ),
              meta.weightGrams && React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '20px',
                    fontSize: '32px',
                    fontFamily: 'monospace',
                  },
                },
                React.createElement('span', { style: { color: '#666666' } }, 'Weight:'),
                React.createElement('span', { style: { color: '#ffffff' } }, `${meta.weightGrams}g`)
              ),
              meta.priceUSD && React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '20px',
                    fontSize: '32px',
                    fontFamily: 'monospace',
                  },
                },
                React.createElement('span', { style: { color: '#666666' } }, 'Price:'),
                React.createElement('span', { style: { color: '#ffffff' } }, `$${meta.priceUSD}`)
              ),
            ].filter(Boolean)
          ),
          React.createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                flex: 1,
              },
            },
            ...[
              meta.releaseYear && React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '20px',
                    fontSize: '32px',
                    fontFamily: 'monospace',
                  },
                },
                React.createElement('span', { style: { color: '#666666' } }, 'Released:'),
                React.createElement('span', { style: { color: '#ffffff' } }, `${meta.releaseYear}`)
              ),
              meta.dimensionsMm && React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '20px',
                    fontSize: '32px',
                    fontFamily: 'monospace',
                  },
                },
                React.createElement('span', { style: { color: '#666666' } }, 'Size:'),
                React.createElement('span', { style: { color: '#ffffff' } }, 
                  `${meta.dimensionsMm.width}×${meta.dimensionsMm.depth}×${meta.dimensionsMm.height}mm`
                )
              ),
              meta.currentlySold !== undefined && React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    gap: '20px',
                    fontSize: '32px',
                    fontFamily: 'monospace',
                  },
                },
                React.createElement('span', { style: { color: '#666666' } }, 'Status:'),
                React.createElement('span', { 
                  style: { 
                    color: meta.currentlySold ? '#4ade80' : '#f87171' 
                  } 
                }, meta.currentlySold ? 'Available' : 'Discontinued')
              ),
            ].filter(Boolean)
          )
        ),
        React.createElement('div', {
          style: {
            width: '100%',
            marginTop: '40px',
            borderBottom: '4px solid #333333',
            paddingTop: '12px',
            paddingBottom: '12px',
            fontSize: '36px',
            color: '#666666',
            fontFamily: 'monospace',
          },
        }, 'arcade.wiki')
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'sans-serif',
            data: fontRegular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'sans-serif',
            data: fontBold,
            weight: 700,
            style: 'normal',
          },
          {
            name: 'monospace',
            data: monoRegular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'monospace',
            data: monoBold,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    )

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 1200,
      },
    })
    const pngData = resvg.render()
    const pngBuffer = pngData.asPng()

    const outputPath = path.join(companyDir, `${meta.controller}.png`)
    fs.writeFileSync(outputPath, pngBuffer)
    generated++
    console.log(`Generated: ${meta.company}/${meta.controller}.png`)
  }

  console.log(`\nGenerated ${generated} OG images`)
}

generateOGImages().catch(console.error)
