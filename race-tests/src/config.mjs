export const config = {
  baseUrl: process.env.CALCOM_URL ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL ?? "postgresql://postgres@localhost:5432/calendso",
  k6Bin: process.env.K6_BIN ?? "k6",
  hostUsername: "k15host",
  // Ngày gốc cho các slot test; mỗi (scenario, round) dùng một ngày riêng nên các vòng không ảnh hưởng nhau.
  slotEpoch: Date.UTC(2027, 0, 4, 9, 0, 0),
  // CSRF của /api/cancel là kiểu double-submit cookie: chỉ cần cookie và body trùng nhau, dài 64 ký tự.
  csrfToken: "k".repeat(64),
};
