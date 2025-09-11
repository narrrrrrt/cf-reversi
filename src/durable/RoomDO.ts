import { Room } from "../core/Room";
import { handleAction } from "../core/Core";
import { SSEManager } from "../sse/SSEManager";
import { createSSE } from "../sse/SSE";

export class RoomDO {
  private room: Room | null = null;
  private sse: SSEManager;

  constructor(private state: DurableObjectState, private env: any) {
    this.sse = new SSEManager();
    // ★ 起動時にアラームをセット（例: 5 秒後）
    //this.state.setAlarm(Date.now() + 5_000);
    this.state.storage.setAlarm(Date.now() + 5_000);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // --- SSE 接続 ---
    if (url.pathname.endsWith("/sse")) {
      if (!this.room) {
        this.room = await Room.load(
          this.state.id.toString(),
          this.state.storage,
          this.sse
        );
      }
      return createSSE(this.sse, request);
    }

    // --- アクション処理 (join/move/leave/reset/hb etc.) ---
    const action = url.pathname.split("/").pop() ?? "";
    const params: Record<string, any> = await this.extractParams(request);

    if (!this.room) {
      this.room = await Room.load(
        this.state.id.toString(),
        this.state.storage,
        this.sse
      );
    }

    return handleAction(this.room, action, params);
  }

  // --- アラーム処理 ---
  async alarm(): Promise<void> {
    if (!this.room) {
      this.room = await Room.load(
        this.state.id.toString(),
        this.state.storage,
        this.sse
      );
    }

    const hbTimeout = Number(this.env.HEARTBEAT_TIMEOUT ?? "30000");   // ms
    const luTimeout = Number(this.env.LASTUPDATE_TIMEOUT ?? "300000"); // ms
    const now = Date.now();

    for (const [token, rec] of this.room.activity.entries()) {
      const hbExpired = rec.hb > 0 && now - rec.hb > hbTimeout;
      const luExpired = rec.lu > 0 && now - rec.lu > luTimeout;

      // ★ OR 条件でまとめる
      if (hbExpired || luExpired) {
        this.room.leave(token);
        this.room.activity.delete(token);
      }
    }

    await this.room.save();

    // 次のアラームを再設定
    //this.state.setAlarm(Date.now() + 5_000);
    this.state.storage.setAlarm(Date.now() + 5_000);
  }

  // GET クエリ / POST JSON を params にまとめる
  private async extractParams(request: Request): Promise<Record<string, any>> {
    if (request.method === "GET") {
      const url = new URL(request.url);
      return Object.fromEntries(url.searchParams.entries());
    }
    if (request.method === "POST") {
      return await request.json();
    }
    return {};
  }
}