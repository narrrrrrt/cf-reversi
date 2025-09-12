import { Room, Seat } from "../core/Room";
import { MethodResult, SSEMessage } from "../core/Types";

// ★ 1行関数で token 生成
function generateToken(): string {
  return Math.random().toString(36).slice(2, 10); // 8文字英数字
}

export async function joinHandler(
  _: Room,
  params: Record<string, any>
): Promise<MethodResult> {
  const { seat } = params as { seat: Seat };

  // token を生成
  const token = generateToken();

  // ★ Room.join に渡して role を確定
  const role: Seat = _.join(token, seat);
  await _.save();

  // broadcast は SSEMessage 型に統一
  const broadcast: SSEMessage = {
    event: "join",
    data: {
      status: _.status,       // 1. status
      step: _.step,           // 2. step
      role,                   // 3. role（join 時のみ）
      black: !!_.black,       // 4. black occupancy
      white: !!_.white,       // 5. white occupancy
      board: _.boardData,     // 6. board
    },
  };

  return {
    broadcast,
    response: {
      ok: true,    // 1. ok
      step: _.step, // 2. step
      error: undefined, // 3. error（成功時は空）
      role,       // 4. role
      token,      // 5. token（join で払い出した）
    },
  };
}