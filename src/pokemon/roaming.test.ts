import { expect, it } from 'vitest';
import { pokemon } from './definitions';
import { advanceActor, beginAttack, createActor, habitatBounds, reconcileActor, fireGeometry, groundFootprint, type PokemonWorld } from './roaming';

const world: PokemonWorld = { width: 390, height: 844, skyBottom: 312, floor: 590,
  obstacles: [{ left: 90, top: 340, right: 330, bottom: 590 }, { left: 230, top: 794, right: 374, bottom: 836 }] };
const rng = () => .3;

it('keeps both mirrored foot registrations inside the ground collider', () => {
  const definition = pokemon.squirtle, position = { x: 900, y: 700 };
  const bounds = groundFootprint(definition, position);
  for (const feetX of [definition.sprite.anchors.feet.x, definition.sprite.width - definition.sprite.anchors.feet.x]) {
    expect(bounds.left).toBeLessThanOrEqual(position.x + feetX * 2 - definition.sprite.width / 2);
    expect(bounds.right).toBeGreaterThanOrEqual(position.x + feetX * 2 + definition.sprite.width / 2);
  }
});

it('rejects walking paths through trunk bases while leaving sky travel unaffected', () => {
  const viewport: PokemonWorld = { width: 1440, height: 900, floor: 660, skyBottom: 320,
    obstacles: [], groundObstacles: [{ left: 1110, top: 772, right: 1130, bottom: 788 }] };
  let actor = { ...createActor(pokemon.squirtle, viewport, rng), position: { x: 970, y: 700 }, duration: 0 };
  let sample = 0;
  for (let i = 0; i < 1600; i++) {
    actor = advanceActor(actor, pokemon.squirtle, viewport, 50,
      { paused: false, reduced: false, held: false }, () => ++sample % 2 ? .9 : .6);
    const feet = groundFootprint(pokemon.squirtle, actor.position), trunk = viewport.groundObstacles![0];
    expect(feet.left < trunk.right && feet.right > trunk.left && feet.top < trunk.bottom && feet.bottom > trunk.top).toBe(false);
  }
  expect(createActor(pokemon.charizard, { ...viewport, groundObstacles: [{ left: 0, top: 0, right: 1440, bottom: 400 }] }, rng))
    .toEqual(createActor(pokemon.charizard, { ...viewport, groundObstacles: [] }, rng));
});

it('moves a blocked spawn or resized actor to a nearby safe place outside a trunk', () => {
  const viewport: PokemonWorld = { ...world, width: 1440, height: 900, floor: 660, obstacles: [] };
  const original = createActor(pokemon.bulbasaur, viewport, rng);
  const feet = groundFootprint(pokemon.bulbasaur, original.position);
  const trunk = { left: (feet.left + feet.right) / 2 - 6, right: (feet.left + feet.right) / 2 + 6,
    top: feet.top - 2, bottom: feet.bottom + 2 };
  const updated = { ...viewport, groundObstacles: [trunk] };
  for (const actor of [createActor(pokemon.bulbasaur, updated, rng), reconcileActor(original, pokemon.bulbasaur, updated)]) {
    const footprint = groundFootprint(pokemon.bulbasaur, actor.position);
    expect(footprint.left < trunk.right && footprint.right > trunk.left && footprint.top < trunk.bottom && footprint.bottom > trunk.top).toBe(false);
    expect(Math.hypot(actor.position.x - original.position.x, actor.position.y - original.position.y)).toBeLessThan(80);
  }
});

it('holds every species at its assigned idle position until its longer rest expires', () => {
  const viewport = { ...world, width: 1440, obstacles: [] };
  for (const species of Object.values(pokemon)) {
    const original = createActor(species, viewport, () => 0);
    const waiting = advanceActor(original, species, viewport, original.duration - 1,
      { paused: false, reduced: false, held: false }, () => .9);
    expect(waiting.mode).toBe('rest');
    expect(waiting.position).toEqual(original.position);
    const departing = advanceActor(waiting, species, viewport, 1,
      { paused: false, reduced: false, held: false }, () => .9);
    expect(departing.mode).toBe('move');
  }
});

it.each([1024, 1440, 1920])('keeps the new walkers in separate side grass areas at %ipx', width => {
  const viewport = { ...world, width };
  const left = habitatBounds(pokemon.bulbasaur, viewport), right = habitatBounds(pokemon.squirtle, viewport);
  expect(left.maxX + pokemon.bulbasaur.sprite.width * 2).toBeLessThan(right.minX);
});

it('spawns desktop additions apart and lets a corrected furniture-adjacent spawn leave its rest', () => {
  const desktop = { ...world, width: 1440 };
  const bulbasaur = createActor(pokemon.bulbasaur, desktop, rng);
  const squirtle = createActor(pokemon.squirtle, desktop, rng);
  expect(Math.hypot(bulbasaur.position.x - squirtle.position.x, bulbasaur.position.y - squirtle.position.y)).toBeGreaterThan(400);
  const obstructed = { ...desktop, floor: 560, obstacles: [{ left: 100, top: 310, right: 340, bottom: 554 }] };
  let actor = createActor(pokemon.bulbasaur, obstructed, rng);
  const start = actor.position;
  for (let i = 0; i < 120; i++) actor = advanceActor(actor, pokemon.bulbasaur, obstructed, 50,
    { paused: false, reduced: false, held: false }, () => .9);
  expect(actor.position).not.toEqual(start);
});

it('does not resolve attack anchors using a longer ambient wing cycle', () => {
  const definition = pokemon.charizard;
  const actor = { ...createActor(definition, world, rng), animationElapsed: 600 };
  expect(() => fireGeometry(actor, definition, world, false)).not.toThrow();
  expect(fireGeometry(actor, definition, world, false).visible).toBe(false);
});

it.each([320, 390, 768, 1440])('keeps whole sprites inside safe areas and avoids obstacles at %ipx', width => {
  const viewport = { ...world, width, obstacles: [{ left: 90, top: 340, right: 300, bottom: 590 },
    { left: width - 160, top: 794, right: width - 16, bottom: 836 }] };
  for (const definition of Object.values(pokemon)) {
    let actor = createActor(definition, viewport, rng);
    const bounds = habitatBounds(definition, viewport);
    for (let i = 0; i < 2400; i++) {
      actor = advanceActor(actor, definition, viewport, 50, { paused: false, reduced: false, held: false }, () => (i % 97) / 97);
      expect(actor.position.x).toBeGreaterThanOrEqual(bounds.minX);
      expect(actor.position.x).toBeLessThanOrEqual(bounds.maxX);
      expect(actor.position.y).toBeGreaterThanOrEqual(bounds.minY);
      expect(actor.position.y).toBeLessThanOrEqual(bounds.maxY);
      for (const obstacle of viewport.obstacles) {
        const overlaps = actor.position.x < obstacle.right && actor.position.x + definition.sprite.width * 2 > obstacle.left
          && actor.position.y < obstacle.bottom && actor.position.y + definition.sprite.height * 2 > obstacle.top;
        expect(overlaps).toBe(false);
      }
    }
  }
});

it.each([320, 390, 768, 1440])('contains mirrored fire on both sides at %ipx', width => {
  const viewport = { ...world, width };
  for (const x of [16, width - 296]) {
    const original = createActor(pokemon.charizard, viewport, rng);
    const actor = { ...beginAttack({ ...original, position: { x, y: 16 } }, pokemon.charizard, viewport), attackElapsed: 400 };
    const fire = fireGeometry(actor, pokemon.charizard, viewport, false);
    expect(fire.visible).toBe(true);
    expect(fire.worldLeft).toBeGreaterThanOrEqual(16);
    expect(fire.worldLeft + fire.length).toBeLessThanOrEqual(width - 16);
  }
});

it('eases into a trip, faces its direction and freezes ambient time on pause', () => {
  const definition = pokemon.pikachu;
  let actor = createActor(definition, world, rng);
  for (let i = 0; i < 140 && actor.mode !== 'move'; i++) actor = advanceActor(actor, definition, world, 50,
    { paused: false, reduced: false, held: false }, () => .9);
  expect(actor.mode).toBe('move');
  const start = actor.position;
  const first = advanceActor(actor, definition, world, 50, { paused: false, reduced: false, held: false }, rng);
  expect(Math.hypot(first.position.x - start.x, first.position.y - start.y)).toBeLessThan(1);
  expect(first.facing).toBe(first.target.x >= start.x ? 1 : -1);
  expect(advanceActor(first, definition, world, 500, { paused: true, reduced: false, held: false }, rng)).toBe(first);
  const held = advanceActor(first, definition, world, 500, { paused: false, reduced: false, held: true }, rng);
  expect(held.position).toEqual(first.position);
  expect(held.animationElapsed).toBeGreaterThan(first.animationElapsed);
});

it('locks repeated attacks, keeps position, contains fire and resumes after 1200ms', () => {
  const definition = pokemon.charizard;
  const original = createActor(definition, world, rng);
  let actor = beginAttack(original, definition, world);
  expect(beginAttack(actor, definition, world)).toBe(actor);
  actor = advanceActor(actor, definition, world, 400, { paused: true, reduced: false, held: true }, rng);
  expect(actor.position).toEqual(original.position);
  const fire = fireGeometry(actor, definition, world, false);
  expect(fire.visible).toBe(true);
  expect(fire.worldLeft).toBeGreaterThanOrEqual(16);
  expect(fire.worldLeft + fire.length).toBeLessThanOrEqual(world.width - 16);
  actor = advanceActor(actor, definition, world, 800, { paused: true, reduced: false, held: true }, rng);
  expect(actor.attackElapsed).toBeNull();
  expect(actor.position).toEqual(original.position);
});

it('supports static manual attacks under reduced motion without advancing ambient time', () => {
  const definition = pokemon.charizard;
  let actor = createActor(definition, world, rng);
  expect(advanceActor(actor, definition, world, 1000, { paused: false, reduced: true, held: false }, rng)).toBe(actor);
  actor = beginAttack(actor, definition, world);
  expect(fireGeometry(actor, definition, world, true).visible).toBe(true);
  actor = advanceActor(actor, definition, world, 300, { paused: false, reduced: true, held: false }, rng);
  expect(actor.attackElapsed).toBeNull();
});

it('clamps only necessary coordinates on resize and resets the route', () => {
  const definition = pokemon.charizard;
  const large = { ...world, width: 1440 };
  const actor = createActor(definition, large, () => .9);
  const resized = reconcileActor(actor, definition, { ...world, width: 320 });
  expect(resized.position.x).toBeLessThanOrEqual(24);
  expect(resized.position.y).toBe(actor.position.y);
  expect(resized.mode).toBe('rest');
});
