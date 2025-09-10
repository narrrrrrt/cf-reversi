import { Room } from "../core/Room";
import { MethodResult } from "../core/Types";

export async function leaveHandler(
  _: Room,
  params: Record<string, any>
): Promise<MethodResult> {
  const { token } = params as { token: string };

  if (!token) {
    return {
      response: { ok: false, error: "Missing token" },
      status: 400,
    };
  }

  _.leave(token);
  await _.save();

  return {
    broadcast: {
      event: "leave",
      status: _.status,
      step: _.step,
      board: _.board(),
      black: !!_.black,   // ★ 黒が埋まっているか
      white: !!_.white,   // ★ 白が埋まっているか
    },
    response: {
      ok: true,
      step: _.step,
    },
    status: 200,
  };
}