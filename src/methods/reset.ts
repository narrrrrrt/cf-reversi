import { Room } from "../core/Room";
import { MethodResult } from "../core/Types";

export async function resetHandler(
  _: Room,
  params: Record<string, any>
): Promise<MethodResult> {
  _.reset();
  await _.save();

  return {
    broadcast: {
      event: "reset",
      status: _.status,
      step: _.step,
      board: _.board(),
    },
    response: {
      ok: true,
      step: _.step,
    },
  };
}