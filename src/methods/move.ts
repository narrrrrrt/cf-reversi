import { Room } from "../core/Room";
import { MethodResult } from "../core/Types";
import { move } from "../board/move_b";

export async function moveHandler(
  _: Room,
  params: Record<string, any>
): Promise<MethodResult> {
  const { x, y, token } = params as { x: number; y: number; token: string };

  // 初期の応答オブジェクト
  const response: any = { ok: false };
  let statusCode = 200;
  let broadcast: any = null;

  if (!token) {
    response.error = "Missing token";
    statusCode = 400;
  } else {
    const result = move(_, x, y, token);

    if (!result.ok) {
      // 理由ごとにエラー内容を設定
      switch (result.reason) {
        case "token_mismatch":
          response.error = "Not a player"; // 200 のまま
          break;
        case "illegal_pass":
          response.error = "Illegal pass";
          statusCode = 400;
          break;
        case "invalid_move":
          response.error = "Invalid move";
          statusCode = 400;
          break;
        default:
          response.error = "Unknown error";
          statusCode = 400;
      }
    } else {
      // 成功
      await _.save();
      response.ok = true;
      response.step = _.step;

      broadcast = {
        event: "move",
        status: _.status,
        step: _.step,
        board: _.board(),
        token,
      };
    }
  }

  // return は最後に一箇所
  return {
    broadcast,
    response,
    status: statusCode,
  };
}