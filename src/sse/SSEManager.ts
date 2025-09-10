// SSEManager.ts
export type SSEPayload = { event: string; data: any };

export class SSEManager {
  private connections: Set<WritableStreamDefaultWriter>;

  constructor() {
    this.connections = new Set();
  }

  // 新しい SSE 接続を登録
  addConnection(writer: WritableStreamDefaultWriter) {
    this.connections.add(writer);
  }

  // 接続を削除（★ close してから削除：元に戻した＋改善）
  removeConnection(writer: WritableStreamDefaultWriter) {
    try {
      writer.close(); // ストリームを正しく閉じる
    } catch {
      // すでに閉じている場合などは無視
    }
    this.connections.delete(writer);
  }

  // 全クライアントにメッセージを配信（JSON & 末尾は \n\n）
  async broadcast(payload: SSEPayload) {
    const encoder = new TextEncoder();
    //const msg = `event: ${payload.event}\ndata: ${JSON.stringify(payload.data)}\n\n`;
    const bytes = encoder.encode(payload);

    const toRemove: WritableStreamDefaultWriter[] = [];
    for (const w of this.connections) {
      try {
        await w.write(bytes); // Uint8Array で書くのが安定
      } catch {
        // 書き込み不能な接続は削除対象に
        toRemove.push(w);
      }
    }
    // まとめてクリーンアップ
    for (const w of toRemove) this.removeConnection(w);
  }
}