import { SSEManager } from "./SSEManager";

/**
 * 新しい SSE 接続を生成して Response を返す
 * - TransformStream でストリームを作成
 * - SSEManager に登録
 * - 切断時にクリーンアップ
 */
export function createSSE(manager: SSEManager, request: Request): Response {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // 接続を SSEManager に登録
  manager.addConnection(writer);
  
  writer.write(`event: open\ndata: ${JSON.stringify({ message: "SSE connected" })}\n\n`);

  // クライアントが切断したときのクリーンアップ
  request.signal.addEventListener("abort", () => {
    manager.removeConnection(writer);
  });

  // SSE のレスポンスを返す
  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}