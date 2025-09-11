export interface MethodResult {
  broadcast?: any;
  response: any;
  status?: number; // ★ HTTP ステータスコード（デフォルト200）
}

export interface MoveResult {
  ok: boolean;             // 成功 or 失敗
  reason?: string;         // 失敗理由 (token mismatch / invalid move / etc)
}