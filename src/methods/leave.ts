import { Room } from "../core/Room";
import { MethodResult, SSEMessage } from "../core/Types";

export async function leaveHandler(
  _: Room,
  params: Record<string, any>
): Promise<MethodResult> {
  const { token } = params as { token: string };

  if (!token) {
    return {
      response: {
        ok: false,        // 1. ok
        step: undefined,  // 2. step
        error: "Missing token", // 3. error
        role: undefined,  // 4. role
        token: undefined, // 5. token
      },
      status: 400,
    };
  }

  _.leave(token);
  await _.save();

  const broadcast: SSEMessage = {
    event: "leave",
    data: {
      status: _.status,     // 1. status
      step: _.step,         // 2. step
      // role: 省略 (leave では不要)
      black: !!_.black,     // 4. black occupancy
      white: !!_.white,     // 5. white occupancy
      board: _.boardData,   // 6. board
    },
  };

  return {
    broadcast,
    response: {
      ok: true,        // 1. ok
      step: _.step,    // 2. step
      error: undefined,// 3. error
      role: undefined, // 4. role
      token: undefined,// 5. token
    },
    status: 200,
  };
}