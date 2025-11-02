import type { ControllerDoc } from './controllers.content';
import { getAllControllerDocs } from './controllers.content';

export interface SimilarController {
  doc: ControllerDoc;
  score: number;
  reasons: string[];
}

export function getSimilarControllers(currentDoc: ControllerDoc, limit = 3): SimilarController[] {
  const all = getAllControllerDocs();
  const current = currentDoc.meta;

  const scored = all
    .filter((doc) => doc.slug !== currentDoc.slug)
    .map((doc) => {
      let score = 0;
      const reasons: string[] = [];
      const meta = doc.meta;

      if (meta.maker === current.maker) {
        score += 10;
        reasons.push('Same maker (+10)');
      }

      if (meta.buttonType === current.buttonType) {
        score += 5;
        reasons.push('Same button type (+5)');
      }

      if (current.priceUSD && meta.priceUSD) {
        const priceDiff = Math.abs(meta.priceUSD - current.priceUSD) / current.priceUSD;
        if (priceDiff < 0.2) {
          score += 3;
          reasons.push('Similar price (+3)');
        }
      }

      const currentSwitches = Array.isArray(current.switchType)
        ? current.switchType
        : current.switchType
          ? [current.switchType]
          : [];
      const metaSwitches = Array.isArray(meta.switchType) ? meta.switchType : meta.switchType ? [meta.switchType] : [];

      const hasCommonSwitch = currentSwitches.some((s) => metaSwitches.includes(s));
      if (hasCommonSwitch) {
        score += 4;
        reasons.push('Matching switches (+4)');
      }

      if (Math.abs(meta.releaseYear - current.releaseYear) <= 2) {
        score += 2;
        reasons.push('Similar release year (+2)');
      }

      return { doc, score, reasons };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
}
