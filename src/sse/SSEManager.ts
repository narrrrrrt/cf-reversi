// SSEManager.ts
export type SSEPayload = { event: string; data: any };

export class SSEManager {
  private connections: Set<WritableStreamDefaultWriter>;
  private queue: string[]; // 接続がないときに溜めるキュー

  constructor() {
    this.connections = new Set();
    this.queue = [];
  }

  // 新しい SSE 接続を登録
  addConnection(writer: WritableStreamDefaultWriter) {
    this.connections.add(writer);

    // 接続直後にキューを flush
    if (this.queue.length > 0) {
      const encoder = new TextEncoder();
      for (const msg of this.queue) {
        const bytes = encoder.encode(msg);
        writer.write(bytes).catch(() => {
          this.removeConnection(writer);
        });
      }
      this.queue = []; // flush 後はクリア
    }
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
  async broadcast(payload: any) {
    const msg = JSON.stringify(payload) + "\n\n";
    const encoder = new TextEncoder();
    const bytes = encoder.encode(msg);

    // 接続がない場合はキューに保存
    if (this.connections.size === 0) {
      this.queue.push(msg);
      return;
    }

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