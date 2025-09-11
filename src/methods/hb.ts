import { Room } from "../core/Room";
import { MethodResult } from "../core/Types";

export async function hbHandler(
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

  // ★ ハートビート更新
  _.updateHeartbeat(token);
  await _.save();

  return {
    response: {
      ok: true,
      step: _.step,
    },
    status: 200,
  };
}