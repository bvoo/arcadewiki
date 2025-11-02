import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import React from 'react';
import satori from 'satori';
import { findMDXFiles, parseFrontmatter } from 'scripts/utils';
import type { ControllerMeta } from '@/data/controllers';
import { USD } from '@/lib/format';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadFont(family: 'Inter' | 'Roboto+Mono', weight: 400 | 700) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`;
  const css = await fetch(url).then((res) => res.text());
  const fontUrl = css.match(/url\((https:\/\/[^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error('Could not find font URL');

  const fontData = await fetch(fontUrl).then((res) => res.arrayBuffer());
  return Buffer.from(fontData);
}

async function generateOGImages() {
  const contentDir = path.join(__dirname, '..', 'src', 'content');
  const mdxFiles = findMDXFiles(contentDir);
  const outputDir = path.join(__dirname, '..', 'public', 'og');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Loading fonts...');
  const [fontRegular, fontBold, monoRegular, monoBold] = await Promise.all([
    loadFont('Inter', 400),
    loadFont('Inter', 700),
    loadFont('Roboto+Mono', 400),
    loadFont('Roboto+Mono', 700),
  ]);
  console.log('Fonts loaded!');

  let generated = 0;

  for (const filePath of mdxFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let meta: ControllerMeta | null = null;

    try {
      meta = parseFrontmatter(content);

      if (meta == null) {
        console.log(`Skipping ${filePath} - no frontmatter found`);
        continue;
      }
    } catch (error) {
      console.error(`Error parsing frontmatter for ${filePath}:\n\t${(error as Error).message}`);
      continue;
    }

    const companyDir = path.join(outputDir, meta.company);

    if (!fs.existsSync(companyDir)) {
      fs.mkdirSync(companyDir, { recursive: true });
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
          React.createElement(
            'div',
            {
              style: {
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: 1.1,
              },
            },
            meta.name,
          ),
          React.createElement(
            'div',
            {
              style: {
                fontSize: '42px',
                color: '#888888',
              },
            },
            `by ${meta.maker}`,
          ),
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
              meta.buttonType &&
                React.createElement(
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
                  React.createElement(
                    'span',
                    { style: { color: '#ffffff' } },
                    meta.buttonType.charAt(0).toUpperCase() + meta.buttonType.slice(1),
                  ),
                ),
              meta.weightGrams &&
                React.createElement(
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
                  React.createElement('span', { style: { color: '#ffffff' } }, `${meta.weightGrams}g`),
                ),
              meta.priceUSD &&
                React.createElement(
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
                  React.createElement('span', { style: { color: '#ffffff' } }, USD.format(meta.priceUSD)),
                ),
            ].filter(Boolean),
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
              meta.releaseYear &&
                React.createElement(
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
                  React.createElement('span', { style: { color: '#ffffff' } }, `${meta.releaseYear}`),
                ),
              meta.dimensionsMm &&
                React.createElement(
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
                  React.createElement(
                    'span',
                    { style: { color: '#ffffff' } },
                    `${meta.dimensionsMm.width}×${meta.dimensionsMm.depth}×${meta.dimensionsMm.height}mm`,
                  ),
                ),
              meta.currentlySold !== undefined &&
                React.createElement(
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
                  React.createElement(
                    'span',
                    {
                      style: {
                        color: meta.currentlySold ? '#4ade80' : '#f87171',
                      },
                    },
                    meta.currentlySold ? 'Available' : 'Discontinued',
                  ),
                ),
            ].filter(Boolean),
          ),
        ),
        React.createElement(
          'div',
          {
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
          },
          'arcade.wiki',
        ),
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
      },
    );

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 1200,
      },
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    const outputPath = path.join(companyDir, `${meta.controller}.png`);
    fs.writeFileSync(outputPath, pngBuffer);
    generated++;
    console.log(`Generated: ${meta.company}/${meta.controller}.png`);
  }

  console.log(`\nGenerated ${generated} OG images`);
}

generateOGImages().catch(console.error);
