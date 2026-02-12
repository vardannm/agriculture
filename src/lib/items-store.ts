import { promises as fs } from 'fs';
import path from 'path';

import { Item } from './types';

const dataPath = path.join(process.cwd(), 'data', 'items.json');

async function ensureDataFile() {
  try {
    await fs.access(dataPath);
  } catch {
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    await fs.writeFile(dataPath, '[]', 'utf8');
  }
}

export async function readItems(): Promise<Item[]> {
  await ensureDataFile();
  const data = await fs.readFile(dataPath, 'utf8');
  return JSON.parse(data) as Item[];
}

export async function writeItems(items: Item[]) {
  await ensureDataFile();
  await fs.writeFile(dataPath, JSON.stringify(items, null, 2), 'utf8');
}
