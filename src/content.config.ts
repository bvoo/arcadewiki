import { type CollectionEntry, defineCollection, z } from 'astro:content';
import { glob, type ParseDataOptions } from 'astro/loaders';

type Preprocess = <TData extends Record<string, unknown>>(
  options: ParseDataOptions<TData>,
) => Promise<ParseDataOptions<TData>>;
type Options = Parameters<typeof glob>[0] & { preprocess: Preprocess };

export function globWithPreprocess({ preprocess, ...options }: Options) {
  const loader = glob(options);
  const originalLoad = loader.load;

  loader.load = async ({ parseData, ...rest }) =>
    originalLoad({
      parseData: async (entry) => await parseData(await preprocess(entry)),
      ...rest,
    });

  return loader;
}

const dimensionsSchema = z.object({
  width: z.coerce.number().positive(),
  depth: z.coerce.number().positive(),
  height: z.coerce.number().positive(),
});

const switchTypeSchema = z.preprocess((val) => (Array.isArray(val) ? val : [val]), z.array(z.string())).default([]);

const contentSchema = z.object({
  name: z.string(),
  maker: z.string(),
  buttonType: z.enum(['digital', 'analog']),
  priceUSD: z.coerce.number().optional(),
  link: z.string().url().optional(),
  currentlySold: z.coerce.boolean(),
  releaseYear: z.coerce.number().int().min(1970).max(new Date().getFullYear()),
  switchType: switchTypeSchema,
  weightGrams: z.coerce.number().int().positive().optional(),
  dimensionsMm: dimensionsSchema.optional(),

  companySlug: z.string(),
  controllerSlug: z.string(),
});

const controllers = defineCollection({
  loader: globWithPreprocess({
    pattern: '**/*.{md,mdx}',
    base: './src/content',
    preprocess: async (entry) => {
      const [companySlug, controllerSlug] = entry.id.split('/');
      if (companySlug == null || controllerSlug == null) {
        throw new Error(`invalid entry id: ${entry.id}`);
      }

      entry.data = {
        ...entry.data,
        companySlug,
        controllerSlug,
      };

      return entry;
    },
  }),
  schema: contentSchema,
});

export const collections = { controllers };

export type ControllerEntry = CollectionEntry<'controllers'>;
export type ControllerData = ControllerEntry['data'];
