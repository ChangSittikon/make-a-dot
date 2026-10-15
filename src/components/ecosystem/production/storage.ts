import { ChainSource, ProductChain } from './types';
import { normalizeChain, normalizeName } from './schema';

const CHAIN_KEY = 'makeadot.production.chains.v1';
const API_KEY = 'makeadot.gemini.key';
const ROOMS_KEY = 'makeadot.production.rooms.v1';

const hasWindow = () => typeof window !== 'undefined';

interface StoredEntry {
  source: ChainSource;
  savedAt: number;
  chain: unknown;
}

function readAll(): Record<string, StoredEntry> {
  if (!hasWindow()) return {};
  try {
    return JSON.parse(window.localStorage.getItem(CHAIN_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getCachedChain(name: string): ProductChain | null {
  const e = readAll()[normalizeName(name)];
  return e ? normalizeChain(e.chain) : null;
}

export function listCachedChains(): ProductChain[] {
  return Object.values(readAll())
    .map((e) => normalizeChain(e.chain))
    .filter((c): c is ProductChain => !!c);
}

export function saveChain(chain: ProductChain, source: ChainSource) {
  if (!hasWindow()) return;
  try {
    const all = readAll();
    all[normalizeName(chain.product.product_name)] = { source, savedAt: Date.now(), chain };
    window.localStorage.setItem(CHAIN_KEY, JSON.stringify(all));
  } catch {
    /* quota / private mode — ignore */
  }
}

export const loadApiKey = (): string => (hasWindow() ? window.localStorage.getItem(API_KEY) || '' : '');
export const saveApiKey = (k: string) => {
  if (!hasWindow()) return;
  if (k.trim()) window.localStorage.setItem(API_KEY, k.trim());
  else window.localStorage.removeItem(API_KEY);
};

export interface GroupRoom {
  id: string;
  productName: string;
  modelName: string;
  mode: string;
  members: number;
  lotCost: number;
  createdAt: number;
}
export function loadRooms(): GroupRoom[] {
  if (!hasWindow()) return [];
  try {
    return JSON.parse(window.localStorage.getItem(ROOMS_KEY) || '[]');
  } catch {
    return [];
  }
}
export function saveRooms(rooms: GroupRoom[]) {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms.slice(0, 20)));
  } catch {
    /* ignore */
  }
}
