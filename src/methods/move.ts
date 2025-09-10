import { Room } from "../core/Room";
import { MethodResult } from "../core/Types";

export async function moveHandler(
  _: Room,
  params: Record<string, any>
): Promise<MethodResult> {
  const { x, y, token } = params as { x: number; y: number; token: string };

  // ★ トークンが無ければエラー
  if (!token) {
    return {
      response: { ok: false, error: "Missing token" },
      status: 400,
    };
  }

  const ok = _.move(x, y, token); // ← board/move_b.ts 側でバリデーションする
  await _.save();

  if (!ok) {
    return {
      response: { ok: false, error: "Invalid move" },
      status: 400,
    };
  }

  return {
    broadcast: {
      event: "move",
      status: _.status,
      step: _.step,
      board: _.board(),
      token,
    },
    response: {
      ok: true,
      step: _.step,
    },
    status: 200,
  };
}