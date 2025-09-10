export interface MethodResult {
  broadcast?: any;
  response: any;
  status?: number; // ★ HTTP ステータスコード（デフォルト200）
}