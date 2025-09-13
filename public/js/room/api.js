export async function join(seat) {
  const res = await fetch(`/1/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seat }),
  });
  return res.json();
}

export async function move(token, x, y) {
  const res = await fetch(`/1/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, x, y }),
  });
  return res.json();
}

export async function leave(token) {
  const res = await fetch(`/1/leave`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return res.json();
}

export async function reset() {
  const res = await fetch(`/1/reset`);
  return res.json();
}
