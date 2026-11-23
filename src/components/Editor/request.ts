export async function postJson(path: string, payload: unknown) {
  return fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function requestError(response: Response, fallback: string) {
  const parsed = await response.json().catch(() => null);
  return typeof parsed?.error === "string" ? parsed.error : fallback;
}
