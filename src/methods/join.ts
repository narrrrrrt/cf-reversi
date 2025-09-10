import { Room, Seat } from "../core/Room";
import { MethodResult } from "../core/Types";

// ★ ここで1行だけ関数として用意
function generateToken(): string {
  return Math.random().toString(36).slice(2, 10); // 8文字の英数字
}

export async function joinHandler(
  _: Room,
  params: Record<string, any>
): Promise<MethodResult> {
  const { seat } = params as { seat: Seat };

  // ★ 生成関数をそのまま join に渡す
  const role: Seat = _.join(generateToken(), seat);
  await _.save();

  return {
    broadcast: {
      event: "join",
      status: _.status,
      step: _.step,
      board: _.board(),
      black: !!_.black,
      white: !!_.white,
    },
    response: {
      ok: true,
      role,
      // join で実際に割り当てられた token を返す
      token: _[role === "black" ? "black" : role === "white" ? "white" : "observers"].toString(),
      step: _.step,
    },
  };
}