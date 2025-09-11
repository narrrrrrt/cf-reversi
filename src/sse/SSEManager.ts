// SSEManager.ts
export type SSEPayload = { event: string; data?: any };

export class SSEManager {
  private connections: Set<WritableStreamDefaultWriter>;
  private initPayload?: any;

  constructor(initPayload?: any) {
    this.connections = new Set();
    this.initPayload = initPayload;
  }

  // 新しい SSE 接続を登録
  addConnection(writer: WritableStreamDefaultWriter) {
    this.connections.add(writer);

    // 接続直後に初回イベントを送信（あれば）
    if (this.initPayload) {
      const encoder = new TextEncoder();
      const msg = JSON.stringify(this.initPayload) + "\n\n";
      writer.write(encoder.encode(msg)).catch(() => {
        this.removeConnection(writer);
      });
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