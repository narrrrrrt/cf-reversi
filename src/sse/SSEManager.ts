// SSEManager.ts
export type SSEPayload = string | Uint8Array;

export class SSEManager {
  private connections: Set<WritableStreamDefaultWriter>;

  constructor() {
    this.connections = new Set();
  }

  addConnection(writer: WritableStreamDefaultWriter) {
    this.connections.add(writer);
  }

  removeConnection(writer: WritableStreamDefaultWriter) {
    try { writer.close(); } catch {}
    this.connections.delete(writer);
  }

  // 受け取った payload を"そのまま"送る（整形なし）
  async broadcast(payload: SSEPayload) {
    const encoder = new TextEncoder();
    const bytes = typeof payload === "string" ? encoder.encode(payload) : payload;

    const toRemove: WritableStreamDefaultWriter[] = [];
    for (const w of this.connections) {
      try {
        await w.write(bytes);
      } catch {
        toRemove.push(w);
      }
    }
    for (const w of toRemove) this.removeConnection(w);
  }
}