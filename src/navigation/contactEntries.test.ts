import { describe, expect, it } from 'vitest';

type Entry = { id: string; label: string; eyebrow: string; title: string; description: string; destination?: string };
type EntriesModule = { contactEntries: readonly Entry[] };
const modules = import.meta.glob('./contactEntries.ts');

async function loadEntries() {
  const loader = modules['./contactEntries.ts'];
  expect(loader, 'contactEntries.ts must provide the Pokédex entries').toBeDefined();
  return loader ? await loader() as EntriesModule : undefined;
}

describe('Pokédex contact entries', () => {
  it('keeps the four approved labels in their requested order and lowercase', async () => {
    const entries = await loadEntries();
    expect(entries?.contactEntries.map(entry => entry.label)).toEqual(['resume', 'linkedin', 'email', 'phone']);
    expect(entries?.contactEntries.every(entry => entry.label === entry.label.toLowerCase())).toBe(true);
    expect(entries?.contactEntries[0]?.description).toBe('open trainer profile');
  });

  it('does not invent external contact destinations', async () => {
    const entries = await loadEntries();
    expect(entries?.contactEntries.every(entry => entry.destination === undefined)).toBe(true);
  });
});
