export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);

    // --- アセット優先 ---
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    // --- 部屋ID抽出 ---
    const [, roomIdRaw] = url.pathname.split("/");

    // ★ 許可リスト（文字列）
    const allowed = ["1", "2", "3", "4"];

    // チェック: 文字列が完全一致しているか
    if (!allowed.includes(roomIdRaw)) {
      return new Response("Room not allowed", { status: 403 });
    }

    // --- DO にフォワード ---
    // roomIdRaw は "1"〜"4" の文字列に限定されている
    const id = env.RoomDO.idFromName(roomIdRaw);
    const stub = env.RoomDO.get(id);

    return stub.fetch(new Request(`http://do${url.pathname}${url.search}`, request));
  },
};

export { RoomDO } from "./durable/RoomDO";