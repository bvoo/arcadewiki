import { type CollectionEntry, getCollection } from 'astro:content';

export interface SimilarController {
  entry: CollectionEntry<'controllers'>;
  score: number;
  reasons: string[];
}

export async function getSimilarControllers(
  entry: CollectionEntry<'controllers'>,
  limit = 3,
): Promise<SimilarController[]> {
  const others = await getCollection('controllers', (other) => entry.id !== other.id);

  const scored = others
    .map((other) => {
      let score = 0;
      const reasons: string[] = [];

      if (other.data.companySlug === entry.data.companySlug) {
        score += 10;
        reasons.push('Same maker (+10)');
      }

      if (other.data.buttonType === entry.data.buttonType) {
        score += 5;
        reasons.push('Same button type (+5)');
      }

      if (entry.data.priceUSD && other.data.priceUSD) {
        const priceDiff = Math.abs(other.data.priceUSD - entry.data.priceUSD) / entry.data.priceUSD;
        if (priceDiff < 0.2) {
          score += 3;
          reasons.push('Similar price (+3)');
        }
      }

      const hasCommonSwitch = entry.data.switchType.some((s) => other.data.switchType.includes(s));
      if (hasCommonSwitch) {
        score += 4;
        reasons.push('Matching switches (+4)');
      }

      if (Math.abs(other.data.releaseYear - entry.data.releaseYear) <= 2) {
        score += 2;
        reasons.push('Similar release year (+2)');
      }

      return { entry: other, score, reasons } satisfies SimilarController;
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}
