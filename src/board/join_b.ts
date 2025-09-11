import { Room, Seat } from "../core/Room";

export function join(_: Room, token: string, seat: Seat): Seat {
  if (seat === "black" && !_.black) {
    _.black = token;
    _.step++;

    // ★ 黒白両方揃ったら合法手を生成
    if (_.black && _.white) {
      _.status = "black"; // 先手は黒
      _.boardData = _.legalBoard("black");
    } else {
      _.status = "waiting";
      _.boardData = _.defaultBoard();
    }
    return "black";
  }

  if (seat === "white" && !_.white) {
    _.white = token;
    _.step++;

    // ★ 黒白両方揃ったら合法手を生成
    if (_.black && _.white) {
      _.status = "black"; // 先手は黒
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