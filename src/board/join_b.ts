import { Room, Seat } from "../core/Room";

export function join(_: Room, token: string, seat: Seat): Seat {
  if (seat === "black" && !_.black) {
    _.black = token;
    _.step++;

    if (_.white) {
      _.status = "black";
      _.boardData = _.legalBoard("black"); // ← 外出しメソッド呼び出し
    } else {
      _.status = "waiting";
      _.boardData = _.defaultBoard();
    }
    return "black";
  }

  if (seat === "white" && !_.white) {
    _.white = token;
    _.step++;

    if (_.black) {
      _.status = "black";
      _.boardData = _.legalBoard("black");
    } else {
      _.status = "waiting";
      _.boardData = _.defaultBoard();
    }
    return "white";
  }

  _.observers.push(token);
  return "observer";
}