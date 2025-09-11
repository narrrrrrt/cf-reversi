import { Room, Seat } from "../core/Room";

export function join(_: Room, token: string, seat: Seat): Seat {
  if (seat === "black" && !_.black) {
    _.black = token;
    _.step++;
  } else if (seat === "white" && !_.white) {
    _.white = token;
    _.step++;
  } else if (seat === "observer") {
    _.observers.push(token);
    return "observer";
  } else {
    // すでに埋まっている席に join しようとした場合
    return seat;
  }

  // ★ 黒白両方揃ったら黒ターンで開始
  if (_.black && _.white) {
    _.status = "black";
    _.boardData = _.legalBoard("black");
  } else {
    _.status = "waiting";
    _.boardData = _.defaultBoard();
  }

  return seat;
}