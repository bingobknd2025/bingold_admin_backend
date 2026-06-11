# Work Update Report — BingoPay Build
**Date:** 10 June 2026
**Project:** bingold_admin (Bingold Admin Backend)
**Baseline:** last commit `3dd5038` (08 Jun 2026)
**Author:** Aditya

---

## 1. Objective
Build **BingoPay** — a merchant payment ecosystem — inside the existing Bingold Admin backend, **on top of the BinGold mobile API** (identity, wallet, KYC, balance, buy/sell, withdraw). No parallel wallet/ledger/balance database; BinGold remains the system of record. BingoPay adds the missing **vendor (merchant) point of view** and the **QR payment flow**.

**Guiding principle:** *BinGold = the bank, BingoPay = Paytm.*

---

## 2. Architecture Delivered
```
                 BINGOLD  (system of record)
   identity · wallet · KYC · balance · buy/sell · withdraw · history
                           ↑  SSO / REST API
                           ↓
                 BINGOPAY  (this build — orchestration layer)
   merchant onboarding · QR · payments · conversion · settlements · audit
```
- Customers are **BinGold users via SSO** — not duplicated; only a thin local mapping + audit are stored.
- Vendors are BinGold users + a local `vendor_profiles` record.
- All money/balances stay in BinGold; BingoPay stores only merchant + orchestration data.

---

## 3. Scope of Changes (since last commit)
- **8 new database tables/models**
- **13 service modules**, **10 controllers**, **9 route files**, **1 middleware**
- **51 new API endpoints** (fully documented in Swagger)
- **3 modified core files** (model registry, app routing, permission seeding)
- Live integration verified against `api-mobile-stage.gldbst.com`

---

## 4. Database Changes

### New tables (8)
| Table | Purpose |
|---|---|
| `bingopay_users` | Thin mapping of a BingoPay user → BinGold identity (customer/vendor) |
| `vendor_profiles` | Merchant business profile, KYC status, settle/accepted coins |
| `payment_qr_codes` | Merchant payment QR (separate from agent QR) |
| `payment_transactions` | Customer→merchant payment records (merchant payment log) |
| `merchant_settlements` | Vendor payout batches |
| `kyc_applications` | Sumsub KYC applications + webhook audit |
| `sso_sync_logs` | Audit trail of every BinGold interaction (secrets redacted) |
| `vendor_kyc_documents` | Offline (manual) KYC document uploads |

### Schema additions to existing tables
- `pda_roles.scope` — `admin` / `bingopay` (existing roles default to `admin`)
- `vendor_profiles.settle_coin`, `accepted_coins`, `kyc_mode`
- `payment_transactions.pay_coin`, `pay_amount`, `conversion_rate`

> **Important migration note:** the live DB is a production dump and drifts from the model definitions. `sync({ alter: true })` crashes on it (malformed FKs / missing index columns). `setup-db` was reworked to **sync only the new BingoPay tables** and apply existing-table changes via **guarded `addColumn`** — existing tables are never altered. Verified clean.

---

## 5. API Surface (51 endpoints)

### Customer — `/api/bingold/bingopay` (api-key; BinGold token for wallet)
- **Auth/SSO:** user-exists, register, login, verify-otp, resend-otp
- **Wallet (proxy):** balance, profile, ledger (transaction history), withdraw

### Merchant / Vendor self-service — `/api/bingold/bingopay/merchant` (BinGold token)
- apply, me, settings (settle/accepted coins)
- QR: create, list, toggle
- **Offline KYC:** submit (file upload), documents
- dashboard, payments, withdraw

### Payments — `/api/bingold/bingopay/pay`
- resolve (scan QR → merchant), quote (multi-coin conversion), confirm (execute)

### Admin — `/api/bingold/admin/bingopay` (admin JWT + RBAC permission)
- **Users:** list, view, change-status, check-bingold
- **Vendors:** create, list, view, update, approve, reject, change-status, initiate-kyc (Sumsub), **offline KYC: submit / documents / review-document**
- **QR:** create, list, view, change-status
- **Payments:** list, view, stats
- **Settlements:** create, list, view, update-status

### Webhook
- `POST /api/bingold/webhooks/sumsub` (HMAC-verified; no api-key/JWT)

---

## 6. Integrations

### BinGold mobile API
- Configurable client (`bingold-api.service.js`): base URL/prefix/auth header via env.
- Wraps: user_exists, signup, login, verify/resend OTP, profile, balance, transaction history, withdraw_request, **buy_token_price_conversion**.
- **Multi-coin payments:** customers can pay in USDT/BNB/ETH/BTC; converted to the merchant's settle coin using BinGold's live price feed (USD-based cross rate). **Conversion verified value-conserving.** BIGOD price = `tokenPrice` (USD), confirmed with product.

### Sumsub (online KYC)
- Signed API client + HMAC webhook verification.
- Credentials validated live; fixed base URL (`test-api` → `api.sumsub.com`) and an empty-body bug on access-token creation.

### Audit & user sync (every interaction is recorded)
- `sso_sync_logs` captures all BinGold calls (auth + wallet), secrets redacted.
- `user-sync.service` upserts the `bingopay_users` mapping consistently across all services.

---

## 7. RBAC
- **21 new permissions** seeded (vendor.*, payment.*, payment_qr.*, settlement.*, bingopay_user.*).
- **2 new back-office roles:** Finance Admin, Vendor Manager.
- Super Admin auto-granted all new permissions (103 total).

---

## 8. KYC — Two Modes Delivered
1. **Online (Sumsub):** `initiate-kyc` → applicant + WebSDK token; webhook auto-updates status.
2. **Offline (manual):** vendor or admin uploads documents (Certificate of Incorporation, GST, PAN, Director ID, Address Proof, Bank Statement, Selfie) → admin reviews per-document → vendor approve/reject. Re-uploads replace (no duplicates); approved vendors are never accidentally downgraded. All logic unit-tested.

---

## 9. Documentation
- Full **Swagger/OpenAPI** for all 51 endpoints: tags (10 groups), summaries, request bodies, file-upload (multipart) schemas.
- Added `apiKeyAuth` (x-api-key) + `bearerAuth` security schemes.
- Fixed `/api-docs` being blocked by the api-key middleware — now publicly viewable; live API calls still require auth via the Authorize button.

---

## 10. Verification Done
- All modules load; full Express app boots cleanly.
- Live `user_exists`, conversion-rate, and Sumsub access-token calls succeed against staging.
- Offline KYC flow unit-tested (validation, replace-on-reupload, no-downgrade guard, review).
- `setup-db` migration runs clean (8 tables + 6 columns created).
- `/api-docs` reachable (200) without key; protected APIs still return 401 without key.

---

## 11. Known Blocker / Pending (BinGold-side)
- **Wallet→wallet transfer API does not exist in BinGold.** This is the single capability required to settle QR payments. The payment flow is fully built around a **pluggable transfer adapter** — set env `BINGOLD_TRANSFER_PATH` once BinGold ships the endpoint and payments go live with **no code change**. Until then, `pay/confirm` records the payment as `processing` with `transferPending: true`.

---

## 12. Deployment Notes
1. Run `npm run setup-db` (creates BingoPay tables + columns + permissions/roles; safe on the prod-dump DB).
2. Env to set:
   - `BINGOLD_API_BASE_URL` (default staging), `BINGOLD_API_PREFIX`, `BINGOLD_AUTH_HEADER/SCHEME`
   - `SUMSUB_BASE_URL=https://api.sumsub.com`, `SUMSUB_APP_TOKEN`, `SUMSUB_SECRET_KEY`, `SUMSUB_WEBHOOK_SECRET`
   - (later) `BINGOLD_TRANSFER_PATH` to enable QR settlement
3. Restart the server.

---

## 13. File Inventory (new)
- **Models:** 8 · **Services:** 13 · **Controllers:** 10 · **Routes:** 9 · **Middleware:** 1
- **Modified:** `app.js`, `models/index.js`, `role.model.js`, `admin.routes.js`, `initPermissions.js`, `swagger.js`, `swagger_output.json`

---

### Summary
Phase 1–2 of BingoPay is complete: full vendor/merchant management, online + offline KYC, QR generation, multi-coin payment orchestration with live conversion, settlements, RBAC, end-to-end BinGold + Sumsub integration, complete audit trail, and full API documentation. The system is production-ready except for the one BinGold-side transfer API, for which the integration point is already built and waiting.
