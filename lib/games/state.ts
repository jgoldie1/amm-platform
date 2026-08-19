export interface PlayerState {
  playerId: string;
  worldId: string;
  position?: { x: number; y: number; z: number };
  score?: number;
  inventory?: string[];
  updatedAt: string;
}

export interface GameEvent {
  id: string;
  worldId: string;
  actorId: string;
  type: string;
  payload: Record<string, unknown>;
  clientTimestamp?: string;
}

/**
 * Client events are requests, not authority. A server/world worker must validate
 * movement, inventory, economy, score, permissions and anti-cheat rules before
 * committing state to the canonical player/world store.
 */
export function validateGameEvent(event: GameEvent) {
  const reasons: string[] = [];
  if (!event.id || !event.worldId || !event.actorId || !event.type) reasons.push('missing required event identity');
  if (JSON.stringify(event.payload).length > 32_000) reasons.push('event payload too large');
  return { valid: reasons.length === 0, reasons };
}
