import fs from 'node:fs';
import path from 'node:path';
import { parse as yamlParse } from 'yaml';
import type { ControllerMeta } from '@/data/controllers';

class InvalidFieldError extends Error {
  constructor(fieldName: string, expectedType: string, actualValue: unknown) {
    super(`Invalid field "${fieldName}": expected ${expectedType}, got ${JSON.stringify(actualValue)}`);
    this.name = 'InvalidFieldError';
  }
}

export function parseFrontmatter(content: string): ControllerMeta | null {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
  const match = content.match(frontmatterRegex);
  if (match == null) return null;

  const yamlContent = match[1];
  const meta = yamlParse(yamlContent) as ControllerMeta;

  if (meta == null) return null;

  // validate structure
  if (typeof meta !== 'object') throw new InvalidFieldError('frontmatter', 'object', meta);
  if (typeof meta.company !== 'string') throw new InvalidFieldError('company', 'string', meta.company);
  if (typeof meta.controller !== 'string') throw new InvalidFieldError('controller', 'string', meta.controller);
  if (typeof meta.name !== 'string') throw new InvalidFieldError('name', 'string', meta.name);
  if (typeof meta.maker !== 'string') throw new InvalidFieldError('maker', 'string', meta.maker);

  if (meta.buttonType && !['digital', 'analog'].includes(meta.buttonType)) {
    throw new InvalidFieldError('buttonType', '"digital" | "analog"', meta.buttonType);
  }

  if (meta.priceUSD != null && typeof meta.priceUSD !== 'number') {
    throw new InvalidFieldError('priceUSD', 'number', meta.priceUSD);
  }

  if (meta.link != null && typeof meta.link !== 'string') {
    throw new InvalidFieldError('link', 'string', meta.link);
  }

  if (meta.currentlySold != null && typeof meta.currentlySold !== 'boolean') {
    throw new InvalidFieldError('currentlySold', 'boolean', meta.currentlySold);
  }

  if (meta.releaseYear != null && typeof meta.releaseYear !== 'number') {
    throw new InvalidFieldError('releaseYear', 'number', meta.releaseYear);
  }

  if (meta.switchType != null) {
    if (!Array.isArray(meta.switchType)) {
      if (typeof meta.switchType === 'string') {
        meta.switchType = [meta.switchType];
      } else {
        throw new InvalidFieldError('switchType', 'array', meta.switchType);
      }
    }

    for (const [index, switchType] of meta.switchType.entries()) {
      if (typeof switchType !== 'string') {
        throw new InvalidFieldError(`switchType[${index}]`, 'string', switchType);
      }
    }
  }

  if (meta.weightGrams != null && typeof meta.weightGrams !== 'number') {
    throw new InvalidFieldError('weightGrams', 'number', meta.weightGrams);
  }

  if (meta.dimensionsMm != null) {
    if (typeof meta.dimensionsMm !== 'object' || meta.dimensionsMm === null) {
      throw new InvalidFieldError('dimensionsMm', 'object', meta.dimensionsMm);
    }

    const { width, depth, height } = meta.dimensionsMm;

    if (typeof width !== 'number') {
      throw new InvalidFieldError('dimensionsMm.width', 'number', meta.dimensionsMm.width);
    }

    if (typeof depth !== 'number') {
      throw new InvalidFieldError('dimensionsMm.depth', 'number', meta.dimensionsMm.depth);
    }

    if (typeof height !== 'number') {
      throw new InvalidFieldError('dimensionsMm.height', 'number', meta.dimensionsMm.height);
    }
  }

  return meta;
}

export function findMDXFiles(dir: string): string[] {
  const files: string[] = [];
  const dirEntry = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of dirEntry) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMDXFiles(fullPath));
    } else if (entry.name === 'index.mdx') {
      files.push(fullPath);
    }
  }

  return files;
}
