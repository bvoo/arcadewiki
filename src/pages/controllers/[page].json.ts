import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths, InferGetStaticParamsType, InferGetStaticPropsType } from 'astro';

export const getStaticPaths = (async ({ paginate }) => {
  const collection = await getCollection('controllers');

  return paginate(
    collection.sort((a, b) => a.id.localeCompare(b.id)).map((entry) => entry.data),
    { pageSize: 50 },
  );
}) satisfies GetStaticPaths;

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute<Props, Params> = async ({ props }) => {
  return new Response(JSON.stringify(props.page), {
    headers: { 'Content-Type': 'application/json' },
  });
};
