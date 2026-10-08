import { config } from "./config.mjs";

export function bookingRequest({ eventType, start, email, name, rescheduleUid, label }) {
  const startDate = new Date(start);
  const end = new Date(startDate.getTime() + eventType.length * 60_000);
  return {
    label,
    method: "POST",
    url: `${config.baseUrl}/api/book/event`,
    headers: { "Content-Type": "application/json" },
    body: {
      eventTypeId: eventType.id,
      start: startDate.toISOString(),
      end: end.toISOString(),
      timeZone: "UTC",
      language: "en",
      metadata: {},
      user: config.hostUsername,
      ...(rescheduleUid && { rescheduleUid }),
      responses: {
        name: name ?? email.split("@")[0],
        email,
        location: { value: "inPerson", optionValue: "" },
      },
    },
  };
}

export function cancelRequest({ uid, label }) {
  return {
    label,
    method: "POST",
    url: `${config.baseUrl}/api/cancel`,
    headers: { "Content-Type": "application/json", Cookie: `calcom.csrf_token=${config.csrfToken}` },
    body: { uid, cancellationReason: "K15 race test", csrfToken: config.csrfToken },
  };
}

// Gửi tuần tự một request (dùng cho bước chuẩn bị dữ liệu, không phải phần bắn race).
export async function send(request) {
  const started = performance.now();
  const res = await fetch(request.url, {
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(request.body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // một số lỗi trả về HTML
  }
  return { status: res.status, json, text, ms: Math.round(performance.now() - started) };
}

export async function mustBook(args) {
  const res = await send(bookingRequest(args));
  if (res.status !== 200) {
    throw new Error(`Chuẩn bị dữ liệu thất bại (HTTP ${res.status}): ${res.text.slice(0, 300)}`);
  }
  return res.json;
}
