import { Room } from "../core/Room";
import { MethodResult } from "../core/Types";

export async function statusHandler(
  _: Room,
  params: Record<string, any>
): Promise<MethodResult> {
  return {
    response: {
      ok: true,
      status: _.status,
      black: !!_.black,
      white: !!_.white,
    },
    status: 200,
  } as MethodResult;
}