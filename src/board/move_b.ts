import { Room } from "../core/Room";

/**
 * move
 * Room.move() の本体を外出ししたもの
 * @param _ Room インスタンス
 * @param x X座標 (0-7)
 * @param y Y座標 (0-7)
 * @param token プレイヤートークン
 * @returns 成功したら true、無効手なら false
 */
export function move(_: Room, x: number, y: number, token: string): boolean {
  const size = 8;
  const me = (_.black === token) ? "B" : (_.white === token) ? "W" : null;
  if (!me) return false; // プレイヤーじゃなければ無効

  const opp = me === "B" ? "W" : "B";
  const board = _.boardData.map(r => r.split("")); // 2次元配列に変換

  // --- パス判定（中央4マスをタップした場合）---
  const isCenter = (x === 3 || x === 4) && (y === 3 || y === 4);
  if (isCenter) {
    const hasLegal = _.boardData.some(row => row.includes("*"));
    if (!hasLegal) {
      // パス成立
      _.status = me === "B" ? "white" : "black"; // ターン交代
      _.step++;
      _.boardData = _.legalBoard(_.status as "black" | "white");
      return true;
    } else {
      return false; // 合法手があるのに中央タップ → 無効
    }
  }

  // --- 通常の着手処理 ---
  if (board[y][x] !== "*") {
    return false; // 合法手じゃない
  }

  // 石を置く
  board[y][x] = me;

  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  // 裏返し処理
  for (const [dx, dy] of directions) {
    const toFlip: [number, number][] = [];
    let nx = x + dx;
    let ny = y + dy;

    while (nx >= 0 && nx < size && ny >= 0 && ny < size) {
      if (board[ny][nx] === opp) {
        toFlip.push([nx, ny]);
        nx += dx;
        ny += dy;
        continue;
      }
      if (board[ny][nx] === me && toFlip.length > 0) {
        for (const [fx, fy] of toFlip) {
          board[fy][fx] = me; // 裏返す
        }
      }
      break;
    }
  }

  // 盤面を更新
  _.boardData = board.map(r => r.join(""));

  // 手番を切り替えてステップを進める
  _.status = me === "B" ? "white" : "black";
  _.step++;

  // 新しい合法手をマーク
  _.boardData = _.legalBoard(_.status as "black" | "white");

  return true;
}