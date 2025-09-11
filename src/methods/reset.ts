import { Room } from "../core/Room";
import { MethodResult, SSEMessage, ResponsePayload } from "../core/Types";

export async function resetHandler(
  _: Room,
  params: Record<string, any>
): Promise<MethodResult> {
  _.reset();
  await _.save();

  const broadcast: SSEMessage = {
    event: "reset",
    data: {
      status: _.status,     // 1. status
      step: _.step,         // 2. step
      // role: 不要
      black: !!_.black,     // 4. black occupancy
      white: !!_.white,     // 5. white occupancy
      board: _.boardData,   // 6. board
    },
  };

  const response: ResponsePayload = {
    ok: true,        // 1. ok
    step: _.step,    // 2. step
    error: undefined,// 3. error
    role: undefined, // 4. role
    token: undefined,// 5. token
  };

  return {
    broadcast,
    response,
    status: 200,
  };
}