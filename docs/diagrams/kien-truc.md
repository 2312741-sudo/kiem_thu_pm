# Sơ đồ kiến trúc và luồng dữ liệu – Cal.com v6.2.0

GitHub và VS Code (có extension Mermaid) hiển thị trực tiếp các sơ đồ dưới đây.

## 1. Sơ đồ container (mức C4-container)

```mermaid
flowchart LR
    booker([Người đặt lịch<br/>Booker])
    host([Chủ lịch<br/>Host / Organizer])
    k6[[k6 + harness K15<br/>race-tests/]]

    subgraph calcom["Cal.com monorepo (Yarn + Turbo)"]
        direction TB
        web["apps/web<br/>Next.js 16 (App Router + Pages API)<br/>UI Booker, trang quản trị"]
        api1["apps/api/v1<br/>REST API (Next.js)"]
        api2["apps/api/v2<br/>REST API (NestJS)"]
        trpc["packages/trpc<br/>tRPC routers<br/>(slots, bookings, viewer…)"]
        features["packages/features<br/>Nghiệp vụ: bookings, availability,<br/>slots, handleSeats, schedules…"]
        prismapkg["packages/prisma<br/>Prisma schema + extensions<br/>(booking-idempotency-key)"]
        appstore["packages/app-store<br/>Tích hợp lịch, video, thanh toán"]
        emails["packages/emails<br/>Email/SMS thông báo"]
    end

    db[(PostgreSQL 16<br/>Booking, Attendee, BookingSeat,<br/>EventType, Schedule, Availability…)]
    ext[(Dịch vụ ngoài<br/>Google/Outlook Calendar,<br/>Daily, Stripe, SMTP)]

    booker -- "HTTP: /[user]/[event]<br/>POST /api/book/event" --> web
    host -- "HTTP: quản lý event type,<br/>xác nhận/hủy booking" --> web
    k6 -- "POST /api/book/event<br/>POST /api/cancel<br/>(N request đồng thời)" --> web
    k6 -. "SQL kiểm invariant" .-> db
    web --> trpc
    web --> features
    api1 --> features
    api2 --> features
    trpc --> features
    features --> prismapkg
    features --> appstore
    features --> emails
    prismapkg --> db
    appstore --> ext
    emails --> ext
```

## 2. Các module liên quan trực tiếp tới kiểm thử

```mermaid
flowchart TB
    route["apps/web/pages/api/book/event.ts<br/>(route đặt/đổi lịch)"]
    cancelRoute["apps/web/app/api/cancel/route.ts<br/>(route hủy, CSRF double-submit)"]
    svc["RegularBookingService.createBooking()<br/>packages/features/bookings/lib/service/"]
    limits["checkBookingAndDurationLimits<br/>→ CheckBookingLimitsService (đếm booking)"]
    avail["ensureAvailableUsers<br/>→ getUsersAvailability / busy times"]
    orig["getOriginalRescheduledBooking<br/>(kiểm booking gốc khi đổi lịch)"]
    seats["handleSeats → createNewSeat<br/>→ addSeatToBooking (SELECT … FOR UPDATE)"]
    create["handleNewBooking/createBooking.ts<br/>prisma.$transaction: hủy booking gốc + tạo booking mới"]
    ext["Prisma extension booking-idempotency-key<br/>idempotencyKey = uuidv5(start.end.userId)<br/>chỉ khi status = ACCEPTED"]
    cancel["handleCancelBooking"]
    db[("Bảng Booking<br/>UNIQUE(uid), UNIQUE(idempotencyKey)")]

    route --> svc
    svc --> orig
    svc --> limits
    svc --> avail
    svc --> seats
    svc --> create
    create --> ext --> db
    seats --> db
    cancelRoute --> cancel --> db
    limits -. "đọc" .-> db
    avail -. "đọc" .-> db
    orig -. "đọc" .-> db
```

## 3. Luồng dữ liệu: đặt lịch và cửa sổ race (TOCTOU)

```mermaid
sequenceDiagram
    autonumber
    participant A as Request A
    participant B as Request B
    participant S as RegularBookingService
    participant DB as PostgreSQL

    A->>S: POST /api/book/event (09:00–09:30)
    B->>S: POST /api/book/event (09:15–09:45)
    S->>DB: [A] đếm booking theo bookingLimits (đọc)
    S->>DB: [B] đếm booking theo bookingLimits (đọc)
    S->>DB: [A] lấy busy times của host → trống
    S->>DB: [B] lấy busy times của host → trống
    Note over S,DB: Cửa sổ race: cả hai đã "thấy" lịch trống,<br/>không có khóa nào được giữ giữa bước đọc và bước ghi
    S->>DB: [A] INSERT Booking (idempotencyKey = f(09:00, 09:30, host))
    S->>DB: [B] INSERT Booking (idempotencyKey = f(09:15, 09:45, host))
    Note over DB: Hai key khác nhau → UNIQUE không chặn<br/>→ host bị đặt chồng 2 cuộc hẹn (lỗi D1)
    DB-->>A: 200 OK
    DB-->>B: 200 OK
```

## 4. Năm nghiệp vụ trọng tâm

| # | Nghiệp vụ | Điểm vào | Dữ liệu ghi |
|---|---|---|---|
| 1 | Đặt lịch event 1-1 | `POST /api/book/event` | `Booking` (ACCEPTED), `Attendee` |
| 2 | Đặt ghế cho event seated | `POST /api/book/event` → `handleSeats` | `Booking` (1 booking/slot), `Attendee`, `BookingSeat` |
| 3 | Đặt lịch cần xác nhận | `POST /api/book/event` (event `requiresConfirmation`) | `Booking` (PENDING) |
| 4 | Đổi lịch | `POST /api/book/event` có `rescheduleUid` | Cập nhật booking gốc → CANCELLED + `rescheduled=true`; tạo booking mới có `fromReschedule` |
| 5 | Hủy lịch | `POST /api/cancel` | `Booking.status` → CANCELLED, `idempotencyKey` → NULL |
