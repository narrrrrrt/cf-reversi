// ロビーの初期化
window.onload = async () => {
  const roomIds = ["1", "2", "3", "4"];

  // 初期状態を取得
  for (const id of roomIds) {
    await updateRoomStatus(id);
  }

  // SSE を開始
  startSSE();
};

// 指定ルームの /status を取得してボタンを更新
async function updateRoomStatus(roomId) {
  try {
    const res = await fetch(`/${roomId}/status`);
    const data = await res.json();

    setButtonState(`room${roomId}-black`, data.black);
    setButtonState(`room${roomId}-white`, data.white);
  } catch (err) {
    console.error(`Failed to fetch status for room ${roomId}`, err);
  }
}

// ボタンの状態を切り替え
function setButtonState(buttonId, isActive) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  if (isActive) {
    btn.classList.add("disabled");
  } else {
    btn.classList.remove("disabled");
  }
}

// SSE 接続
function startSSE() {
  const es = new EventSource("/sse");

  es.addEventListener("join", (event) => {
    logMessage("join", event.data);
    handleSSEUpdate(event);
  });

  es.addEventListener("leave", (event) => {
    logMessage("leave", event.data);
    handleSSEUpdate(event);
  });

  es.onerror = (err) => {
    console.error("SSE error:", err);
  };
}

// SSE のデータから UI を更新
function handleSSEUpdate(event) {
  try {
    const data = JSON.parse(event.data);

    // data 内に roomId, black, white が含まれている想定
    const roomId = data.roomId;
    if (!roomId) return;

    setButtonState(`room${roomId}-black`, data.black);
    setButtonState(`room${roomId}-white`, data.white);
  } catch (err) {
    console.error("Failed to handle SSE update", err);
  }
}

// ログ表示
function logMessage(event, message) {
  const logDiv = document.getElementById("log");
  const p = document.createElement("p");
  p.textContent = `[${event}] ${message}`;
  logDiv.appendChild(p);
}