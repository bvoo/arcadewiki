import { persistentBoolean } from '@nanostores/persistent';
import { atom } from 'nanostores';
import type { GameType } from '@/content.config';

export const globalFilter = atom('');

export const comparisonEnabled = persistentBoolean('comparison-enabled', false);

export const gameTypeFilter = atom<GameType | 'all'>('all');
