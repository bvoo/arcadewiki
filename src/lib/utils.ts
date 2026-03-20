import { site } from 'astro:config/client';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ControllerData, GameType } from '@/content.config';

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

const GAME_TYPE_LABELS: Record<GameType, string> = {
  traditional: 'Traditional',
  platform: 'Platform',
  multi: 'Multi',
};

export function getGameTypeBadge(gameType?: GameType | null) {
  const label = gameType ? GAME_TYPE_LABELS[gameType] : GAME_TYPE_LABELS.multi;
  const variant: 'default' | 'secondary' | 'outline' =
    gameType === 'platform' ? 'default' : gameType === 'traditional' ? 'outline' : 'secondary';
  return { label, variant };
}
