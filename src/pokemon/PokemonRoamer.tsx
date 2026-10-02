import { memo, useRef } from 'react';
import { CharacterSprite } from '../character/CharacterSprite';
import { FireBreath } from './FireBreath';
import type { PokemonDefinition } from './definitions';
import { actorClip, actorFrame, fireGeometry, type Actor, type PokemonWorld } from './roaming';

interface Props {
  definition: PokemonDefinition; actor: Actor; world: PokemonWorld; reduced: boolean;
  onAttack: () => void; onHold: (channel: 'hover' | 'focus', value: boolean) => void;
}
export const PokemonRoamer = memo(function PokemonRoamer({ definition, actor, world, reduced, onAttack, onHold }: Props) {
  const pointerFocus = useRef(false);
  const x = Math.round(actor.position.x / 2) * 2, y = Math.round(actor.position.y / 2) * 2;
  const attack = actor.attackElapsed !== null;
  const fire = definition.id === 'charizard' ? fireGeometry({ ...actor, position: { x, y } }, definition, world, reduced) : null;
  const drawing = <span className="pokemon-facing" style={{ transform: actor.facing !== definition.nativeFacing ? 'scaleX(-1)' : undefined }}>
    <CharacterSprite definition={definition.sprite} clip={reduced && !attack ? definition.habitat === 'sky' ? 'hover' : 'idle' : actorClip(actor, definition)} frameIndex={actorFrame(actor, definition, reduced)}
      scale={2} label={definition.name} />
    {fire?.visible && <FireBreath mouth={fire.mouth} length={fire.length} elapsed={actor.attackElapsed! - 240} still={reduced} />}
  </span>;
  const style = { width: definition.sprite.width * 2, height: definition.sprite.height * 2,
    transform: `translate3d(${x}px, ${y}px, 0)` };
  return definition.id === 'charizard' ? <button type="button" className="pokemon-roamer pokemon-charizard"
    style={style} data-pokemon={definition.id} data-attacking={attack} data-facing={actor.facing}
    aria-label="Charizard: breathe fire" aria-describedby="charizard-hint" onClick={onAttack}
    onPointerEnter={event => { if (event.pointerType !== 'touch') onHold('hover', true); }} onPointerLeave={() => onHold('hover', false)}
    onPointerDown={event => { pointerFocus.current = true; onHold('focus', false); if (event.pointerType === 'touch') onHold('hover', false); }}
    onKeyDown={event => { if (event.key !== 'Tab') { pointerFocus.current = false; onHold('focus', true); } }}
    onFocus={event => onHold('focus', !pointerFocus.current && event.currentTarget.matches(':focus-visible'))}
    onBlur={() => { pointerFocus.current = false; onHold('focus', false); }}>
    {drawing}<span className="pokemon-hint" id="charizard-hint">click for fire</span>
  </button> : <div aria-hidden="true" className="pokemon-roamer pokemon-pikachu" style={style} data-pokemon={definition.id} data-facing={actor.facing}>
    {drawing}
  </div>;
});
