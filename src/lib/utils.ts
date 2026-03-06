import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Navigation utility functions
export function getCollectionPath(lang: 'en' | 'it', collection: string): string {
  if (lang === 'en') {
    return `/en/collections/${collection}`;
  } else {
    const collectionMap: Record<string, string> = {
      'pendant': 'pendente',
      'ring': 'anelli',
      'bracelet': 'bracciali',
      'earring': 'orecchini'
    };
    return `/it/collezioni/${collectionMap[collection] || collection}`;
  }
}

export function getCollectionsOverviewPath(lang: 'en' | 'it'): string {
  return lang === 'en' ? '/en/collections' : '/it/collezioni';
}

export function getHomePath(lang: 'en' | 'it'): string {
  return `/${lang}`;
}