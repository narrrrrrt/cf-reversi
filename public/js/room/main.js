import { join, move, leave, reset } from "./api.js";

document.getElementById("resetBtn").addEventListener("click", async () => {
  const result = await reset();
  document.getElementById("responseArea").innerText =
    "Response: " + JSON.stringify(result);
});
