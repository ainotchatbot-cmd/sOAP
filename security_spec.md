# Firestore Security Rules TDD Specification

## 1. Data Invariants
- `users/{userId}/history/{entryId}` and `users/{userId}/orders/{orderId}` can ONLY be read, created, updated, or deleted by the authenticated owner whose `request.auth.uid == userId` and `request.auth.token.email_verified == true`.
- Client payloads on `users/{userId}/history/{entryId}` MUST declare `uid == request.auth.uid`, valid `itemType`, bounded strings, and server-verified timestamp `viewedAt == request.time`.
- `atelier_orders/{orderId}` is write-once by customers at checkout (`allow create` only when `status == 'queued'`, `completedSteps.size() == 0`, `createdAt == request.time`, `updatedAt == request.time`, bounded `items` array `<= 30`, valid email/lengths, and `customerUid == request.auth.uid` if signed in). Reading (`get`/`list`) customer PII & order contents is strictly restricted to bootstrapped verified admin (`ipedmaak@gmail.com`) or the authenticated owner (`resource.data.customerUid == request.auth.uid`). Production stage (`status`) and maker step checklist (`completedSteps`) updates are strictly restricted to verified admins (`isAdmin()`).
- `mailing_list/{subscriberId}` is strictly append-only (`allow create`) with strict email regex, bounded `topics` array (`<= 6`), boolean `adCookiesAccepted`, and server timestamp `createdAt == request.time`. Public clients cannot `get`, `list`, `update`, or `delete` mailing list PII.
- `site_metrics/counters` is publicly readable (`allow get`) and strictly bounded on updates (`totalSold >= existing().totalSold && totalSold <= existing().totalSold + 50`) by verified signed-in users only, or initial seeding if absent.

## 2. Adversarial Test Payloads (Dirty Dozen Summary)
1. Unauthenticated read on `/users/uid1/history/h1` -> PERMISSION_DENIED
2. Cross-user read on `/users/uid2/orders/o1` by `uid1` -> PERMISSION_DENIED
3. Unverified email user writing `/users/uid1/history/h1` -> PERMISSION_DENIED
4. Shadow/ghost field injection `{ ..., isAdmin: true }` on history -> PERMISSION_DENIED
5. Spoofed `uid` mismatch `{ uid: "other", ... }` on history -> PERMISSION_DENIED
6. Forged client timestamp (`viewedAt` != `request.time`) -> PERMISSION_DENIED
7. Unbounded string poisoning (`title` > 160 chars or doc ID > 128 chars) -> PERMISSION_DENIED
8. Reading `/mailing_list` list query as signed-in customer -> PERMISSION_DENIED (PII protection)
9. Reading `/atelier_orders` list query as signed-in non-admin customer without matching `customerUid` -> PERMISSION_DENIED (PII protection)
10. Creating `/atelier_orders/GB-1000` with spoofed `status: 'shipped'` or forged `customerUid` -> PERMISSION_DENIED
11. Updating `/atelier_orders/GB-1000` `totalThb` or `status` as non-admin user -> PERMISSION_DENIED
12. Counter tampering decreasing `totalSold` or jumping > 50 -> PERMISSION_DENIED
