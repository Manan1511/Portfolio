import { createContext } from 'react';

// Hero previews and standalone rendering stay active; EntryGate pauses the
// prepared scene until the visitor explicitly enters.
export const EntrySceneActiveContext = createContext(true);
