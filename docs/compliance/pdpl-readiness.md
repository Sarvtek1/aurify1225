# PDPL Readiness — Aurify1225

**Owner:** SARVtek  
**Project:** Aurify1225 (SaaS for Amazon sellers, UAE)  
**Last updated:** 2025-11-09  
**Compliance scope:** UAE Personal Data Protection Law (PDPL)

---

## 1) Architecture & Regions (Authoritative Statement)

- **Primary compute for dynamic requests / SSR:** **Google Cloud Run – `me-central1` (Doha, UAE)**  
- **Primary data stores:**  
  - **Cloud Firestore (Native):** `me-central1` (Doha, UAE)  
  - **BigQuery dataset(s):** `ME-CENTRAL1` (Doha, UAE) with **12-month log retention** for analytics and security logs  
- **Static asset delivery (presentation layer only):** **Firebase Hosting global CDN**  
  - **No PII** is stored in or processed by Firebase Hosting  
  - Hosting serves **only static assets** (HTML/JS/CSS/images) and rewrites all **dynamic/SSR traffic** to Cloud Run in `me-central1`

> **Residency Assertion:** All processing and storage of personal data (PII) occur **inside the UAE** within the `me-central1` (Doha) region. **No PII leaves the UAE.**

---

## 2) High-level Diagram

Client (Browser)
|
v
Firebase Hosting (Global CDN) --(static assets only; no PII)-->
|
v (all dynamic/SSR routes via rewrite)
Cloud Run (aurify-ssr) — region: me-central1 (Doha)
|
+--> Firestore (me-central1) — PII at rest
|
+--> BigQuery (ME-CENTRAL1) — analytics & 12-month logs (non-PII or minimized PII per policy)

---

## 3) Routing Behavior

- `/**` → **Rewrite** to **Cloud Run `aurify-ssr` in `me-central1`** (SSR + APIs)  
- Static files under `/public` are served by Hosting’s CDN  
- **No dynamic processing** happens at the edge/CDN

---

## 4) Data Handling & Residency

- **PII classification:** Customer identity/contact data, account identifiers, and marketplace metrics tied to identifiable sellers  
- **PII processing location:** Exclusively `me-central1` (Doha) — Cloud Run, Firestore, BigQuery  
- **Cross-border transfers:** None for PII. Integrations lacking UAE residency guarantees are PII-blocked or receive anonymized/aggregated data only  
- **Logging/Telemetry:** BigQuery `ME-CENTRAL1` with 12-month default table expiration  
- **Backups/DR:** Kept within UAE regions (when supported). No cross-region backups containing PII  

---

## 5) Services & Regions (Traceability Table)

| Service          | Purpose                              | Region / Location       | Contains PII |
|------------------|--------------------------------------|-------------------------|--------------|
| Cloud Run        | SSR + APIs (dynamic processing)      | **me-central1 (Doha)**  | **Yes**      |
| Firestore        | Transactional store, alerts          | **me-central1 (Doha)**  | **Yes**      |
| BigQuery         | Analytics & security logs (12 mo)    | **ME-CENTRAL1 (Doha)**  | Partial / Minimized |
| Firebase Hosting | Static files (presentation only)     | Global CDN (no PII)     | **No**       |

---

## 6) Access Control & Secrets

- **IAM:** Least-privilege roles for CI/CD; no editor/owner permissions for deploy bots  
- **Secrets:** Managed via Google Secret Manager in `me-central1`; injected into Cloud Run at runtime; never stored in the repository or Hosting configuration  

---

## 7) Vendor & API Integrations

- Third-party APIs **must not** receive PII unless:  
  1. Residency is guaranteed in UAE (`me-central1`), **or**  
  2. A DPIA / Data Transfer Assessment (DTA) is completed **before** any transfer  

---

## 8) Retention, Deletion & Subject Rights

- **Retention:** Business data per policy; logs retained **12 months** in BigQuery  
- **Deletion:** Verified user-triggered deletion flows; hard deletes or cryptographic erasure within UAE regions  
- **Access/Export:** Data subject access requests (SARs) fulfilled solely from UAE-hosted stores  

---

## 9) Incident Response & Audit

- **Incident response (IR) playbook:** Notify security & legal teams within SLA; contain, eradicate, recover; perform RCA within 72 hours  
- **Audit trail:** Administrative actions and access events logged in BigQuery `ME-CENTRAL1`  

---

## 10) Compliance Assertions (Checklist)

- [x] Cloud Run service **`aurify-ssr`** deployed in **`me-central1`**  
- [x] Firestore database location: **`me-central1` (Native)**  
- [x] BigQuery dataset location: **`ME-CENTRAL1` (12-month expiration)**  
- [x] Firebase Hosting serves **static assets only**; dynamic routes rewrite to `me-central1`  
- [x] **No PII** stored or processed by Hosting/CDN  
- [x] Secrets stored securely in **`me-central1`** Secret Manager  
- [x] No cross-border PII transfers without prior DPIA/DTA approval  

---

## 11) Change Control

Any change affecting regions, data flows, or processors requires:  
1. Update to this document  
2. Review by compliance owner  
3. Re-run of PDPL governance checklist  
_Last reviewed:_ 2025-11-09  
_Compliance owner:_ SARVtek  
_Change control ref:_ PDPL-2025.11.09-01
