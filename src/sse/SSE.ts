// SSE.ts
import { SSEManager } from "./SSEManager";

export function createSSE(manager: SSEManager, request: Request): Response {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // 接続登録
  manager.addConnection(writer);

  // 接続直後に JSON イベントを1発
  // （クライアントは addEventListener("open", ...) / JSON.parse(e.data) で統一）
  writer.write(
    encoder.encode(`event: open\ndata: ${JSON.stringify({ message: "SSE connected" })}\n\n`)
  );

  // 切断時クリーンアップ（closeはSSEManager側で実施）
  request.signal.addEventListener("abort", () => {
    manager.removeConnection(writer);
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}