export class SSEManager {
  private connections: Set<WritableStreamDefaultWriter>;

  constructor() {
    this.connections = new Set();
  }

  // 新しい SSE 接続を登録
  addConnection(stream: WritableStreamDefaultWriter) {
    this.connections.add(stream);
  }

  // 接続を削除
  removeConnection(stream: WritableStreamDefaultWriter) {
    this.connections.delete(stream);
  }

  // 全クライアントにメッセージを配信
  broadcast(payload: any) {
    const msg = `data: ${JSON.stringify(payload)}\n\n`;

    for (const conn of this.connections) {
      conn.write(msg).catch(() => {
        // 書き込みに失敗した接続は破棄
        this.connections.delete(conn);
      });
    }
  }
}