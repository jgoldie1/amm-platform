import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Load standalone ES module without altering the parent Next.js project's module setting.
const source = await readFile(new URL('../lib/streetverse-character-factory.js', import.meta.url), 'utf8');
const {createCharacter, setAppearance, applyInjury, triage, treat, animationFor} =
  await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('defaults are valid and LaTeasia can start 20 pounds lighter', () => {
  const bj = createCharacter('bj-stubbs');
  assert.deepEqual(bj.appearance, {weightDeltaLb:0,heightDeltaCm:0,muscle:50});
  assert.equal(createCharacter('lateasia', {appearance:{weightDeltaLb:-20}}).appearance.weightDeltaLb, -20);
});
test('initial and subsequent appearance changes use identical bounds', () => {
  const bad = [
    {weightDeltaLb:-61}, {weightDeltaLb:61}, {weightDeltaLb:NaN},
    {heightDeltaCm:16}, {heightDeltaCm:-16}, {heightDeltaCm:Infinity},
    {muscle:-1}, {muscle:101}, {muscle:'50'},
  ];
  for (const patch of bad) {
    assert.throws(() => createCharacter('lateasia', {appearance:patch}));
    const character = createCharacter('lateasia');
    assert.throws(() => setAppearance(character, patch));
    assert.equal(character.appearance.weightDeltaLb,0, 'invalid update must not change appearance');
  }
});
test('invalid appearance patches and ids are rejected', () => {
  assert.throws(() => setAppearance(createCharacter('lateasia'), null));
  assert.throws(() => createCharacter('lateasia', {appearance:[]}));
  assert.throws(() => createCharacter(123));
  assert.throws(() => createCharacter('bad id'));
});
test('injury events are idempotent, triage and treatment recover', () => {
  const character = createCharacter('bj-stubbs');
  const event = {eventId:'fall-1',type:'fracture',location:'leg',severity:3};
  assert.equal(applyInjury(character,event), true);
  assert.equal(applyInjury(character,event), false);
  assert.equal(character.health,70);
  assert.equal(character.animation,'injured');
  assert.equal(triage(character).priority,'urgent');
  assert.equal(treat(character,'fall-1'),true);
  assert.equal(treat(character,'fall-1'),false);
  assert.equal(character.health,100);
  assert.equal(character.animation,'idle');
});
test('animation selection falls back to Idle', () => {
  const character = createCharacter('jacobie-stubbs');
  character.animation='injured';
  assert.equal(animationFor(character,['Idle']),'Idle');
  assert.equal(animationFor(character,['Limp','Idle']),'Limp');
});
