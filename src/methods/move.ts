import { Room } from "../core/Room";
import { MethodResult, ResponsePayload, SSEMessage } from "../core/Types";
import { move } from "../board/move_b";

export async function moveHandler(
  _: Room,
  params: Record<string, any>
): Promise<MethodResult> {
  const { x, y, token } = params as { x: number; y: number; token: string };

  const response: ResponsePayload = {
    ok: false,        // 1. ok
    step: undefined,  // 2. step
    error: undefined, // 3. error
    role: undefined,  // 4. role
    token: undefined, // 5. token
  };

  // ★ デフォルトは 400
  let statusCode = 400;
  let broadcast: SSEMessage | undefined = undefined;

  if (!token) {
    response.error = "Missing token";
  } else {
    const result = move(_, x, y, token);

    if (!result.ok) {
      switch (result.reason) {
        case "token_mismatch":
          response.error = "Not a player";
          break;
        case "illegal_pass":
          response.error = "Illegal pass";
          break;
        case "invalid_move":
          response.error = "Invalid move";
          break;
        default:
          response.error = "Unknown error";
      }
    } else {
      // ★ 成功時だけ 200
      await _.save();
      response.ok = true;
      response.step = _.step;
      statusCode = 200;

      broadcast = {
        event: "move",
        data: {
          status: _.status,     // 1. status
          step: _.step,         // 2. step
          // role: 不要
          black: !!_.black,     // 4. black occupancy
          white: !!_.white,     // 5. white occupancy
          board: _.boardData,   // 6. board
        },
      };
    }
  }

  return {
    ...(broadcast ? { broadcast } : {}),
    response,
    status: statusCode,
  };
}