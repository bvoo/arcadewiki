import { persistentBoolean } from '@nanostores/persistent';
import { atom } from 'nanostores';

export const globalFilter = atom('');

export const comparisonEnabled = persistentBoolean('comparison-enabled', false);
