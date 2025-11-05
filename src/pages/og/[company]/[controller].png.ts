import { getCollection } from 'astro:content';
import { Resvg } from '@resvg/resvg-js';
import type { APIRoute, GetStaticPaths, InferGetStaticParamsType, InferGetStaticPropsType } from 'astro';
import React from 'react';
import satori, { type SatoriOptions } from 'satori';
import type { ControllerData } from '@/content.config';
import { USD } from '@/lib/format';

function createElement(data: ControllerData) {
  return React.createElement(
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
        data.name,
      ),
      React.createElement(
        'div',
        {
          style: {
            fontSize: '42px',
            color: '#888888',
          },
        },
        `by ${data.maker}`,
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
          data.buttonType &&
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
                data.buttonType.charAt(0).toUpperCase() + data.buttonType.slice(1),
              ),
            ),
          data.weightGrams &&
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
              React.createElement('span', { style: { color: '#ffffff' } }, `${data.weightGrams}g`),
            ),
          data.priceUSD &&
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
              React.createElement('span', { style: { color: '#ffffff' } }, USD.format(data.priceUSD)),
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
          data.releaseYear &&
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
              React.createElement('span', { style: { color: '#ffffff' } }, `${data.releaseYear}`),
            ),
          data.dimensionsMm &&
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
                `${data.dimensionsMm.width}×${data.dimensionsMm.depth}×${data.dimensionsMm.height}mm`,
              ),
            ),
          data.currentlySold !== undefined &&
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
                    color: data.currentlySold ? '#4ade80' : '#f87171',
                  },
                },
                data.currentlySold ? 'Available' : 'Discontinued',
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
  );
}

async function loadFont(family: 'Inter' | 'Roboto+Mono', weight: 400 | 700) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`;
  const css = await fetch(url).then((res) => res.text());
  const fontUrl = css.match(/url\((https:\/\/[^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error('Could not find font URL');

  const fontData = await fetch(fontUrl).then((res) => res.arrayBuffer());
  return Buffer.from(fontData);
}

async function renderPng(data: ControllerData, options: SatoriOptions): Promise<Buffer> {
  const svg = await satori(createElement(data), options);
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

export const getStaticPaths = (async () => {
  const collection = await getCollection('controllers');

  const [fontRegular, fontBold, monoRegular, monoBold] = await Promise.all([
    loadFont('Inter', 400),
    loadFont('Inter', 700),
    loadFont('Roboto+Mono', 400),
    loadFont('Roboto+Mono', 700),
  ]);

  const options = {
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
  } satisfies SatoriOptions;

  return await Promise.all(
    collection.map(async (entry) => ({
      params: { company: entry.data.companySlug, controller: entry.data.controllerSlug },
      props: { data: await renderPng(entry.data, options) },
    })),
  );
}) satisfies GetStaticPaths;

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props, Params> = async ({ props }) => {
  return new Response(new Uint8Array(props.data), {
    headers: { 'Content-Type': 'image/png' },
  });
};
