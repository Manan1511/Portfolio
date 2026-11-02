import { useState } from 'react';
import { PokedexDialog } from './PokedexDialog';

export default function PokedexPreview() {
  const [open, setOpen] = useState(true);
  return <main className="pokedex-preview" aria-label="pokedex preview">
    {!open && <button type="button" className="pokedex-preview-reopen" onClick={() => setOpen(true)}>open pokedex</button>}
    {open && <PokedexDialog onClose={() => setOpen(false)} />}
  </main>;
}
