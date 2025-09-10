import { Room } from "../core/Room";

/**
 * reset
 * Room.reset() の本体を外出ししたもの
 * @param _ Room インスタンス
 */
export function reset(_: Room): void {
  _.black = null;
  _.white = null;
  _.observers = [];

  _.status = "waiting";
  _.step = 0;

  _.boardData = _.defaultBoard(); // 初期配置
}