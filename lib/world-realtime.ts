import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

export type Vec3 = { x: number; y: number; z: number };
export type Movement = {
  userId: string;
  displayName: string;
  position: Vec3;
  rotation: Vec3;
  animation: string;
  seq: number;
  sentAt: number;
};

export class WorldRealtime {
  private channel: RealtimeChannel | null = null;

  constructor(private client: SupabaseClient, private instanceId: string) {}

  async connect(
    userId: string,
    displayName: string,
    onMove: (movement: Movement) => void,
    onPresence: (state: unknown) => void
  ) {
    this.channel = this.client.channel(`world:${this.instanceId}`, {
      config: {
        private: true,
        presence: { key: userId },
        broadcast: { self: false }
      }
    });

    this.channel
      .on('broadcast', { event: 'move' }, payload => onMove(payload.payload as Movement))
      .on('presence', { event: 'sync' }, () => onPresence(this.channel?.presenceState() ?? {}));

    return this.channel.subscribe(async status => {
      if (status === 'SUBSCRIBED') {
        await this.channel?.track({ userId, displayName, joinedAt: new Date().toISOString() });
      }
    });
  }

  async sendMove(movement: Movement) {
    if (!this.channel) return;
    await this.channel.send({ type: 'broadcast', event: 'move', payload: movement });
  }

  async sendEvent(event: string, payload: unknown) {
    if (!this.channel) return;
    await this.channel.send({ type: 'broadcast', event, payload });
  }

  async disconnect() {
    if (this.channel) await this.client.removeChannel(this.channel);
    this.channel = null;
  }
}
