import { site } from 'astro:config/client';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ControllerData } from '@/content.config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const baseUrl = (site?.replace(/\/+$/, '') ?? 'https://arcade.wiki').trim();

export function getButtonTypeBadge(buttonType?: ControllerData['buttonType'] | null) {
  const normalized = (buttonType ?? '').toString().toLowerCase();
  const label = normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : '';
  const variant: 'default' | 'secondary' = normalized === 'analog' ? 'default' : 'secondary';
  return { label, variant };
}
