# PDPL Quarterly Review Checklist — Aurify1225

**Owner:** Electrafa-FZ  
**Project:** Aurify (UAE)  
**Scope:** PDPL operational readiness — data residency, security, access, and incident response  
**Version:** v2.0  
**Last updated:** <YYYY-MM-DD>

---

## 1️⃣ Regional Compliance & Residency

| Checkpoint | Expected | Verified | Reviewer Notes |
|-------------|-----------|-----------|----------------|
| Cloud Run region | `me-central1 (Doha)` | [ ] |  |
| Firestore location | `me-central1 (Doha)` | [ ] |  |
| BigQuery datasets | `ME-CENTRAL1` (12-month retention) | [ ] |  |
| Secret Manager | `me-central1` | [ ] |  |
| No cross-border data transfers of PII | Confirmed | [ ] |  |

---

## 2️⃣ Data Handling & Classification

| Checkpoint | Expected | Verified | Reviewer Notes |
|-------------|-----------|-----------|----------------|
| PII schema documented and classified | Yes | [ ] |  |
| Logging excludes raw identifiers | Yes | [ ] |  |
| Backups/DR remain in UAE | Yes | [ ] |  |
| Pseudonymization used where possible | Yes | [ ] |  |

---

## 3️⃣ Access Control

| Checkpoint | Expected | Verified | Reviewer Notes |
|-------------|-----------|-----------|----------------|
| IAM least privilege enforced (no Editor/Owner in CI/CD) | Yes | [ ] |  |
| Service accounts scoped to project only | Yes | [ ] |  |
| Access logs retained in BigQuery (12 months) | Yes | [ ] |  |
| Quarterly access review completed | Yes | [ ] |  |

---

## 4️⃣ Secrets & Configurations

| Checkpoint | Expected | Verified | Reviewer Notes |
|-------------|-----------|-----------|----------------|
| Secrets stored only in Secret Manager | Yes | [ ] |  |
| No plaintext secrets in repo or logs | Yes | [ ] |  |
| Runtime env vars injected securely | Yes | [ ] |  |

---

## 5️⃣ Incident & Breach Response

| Checkpoint | Expected | Verified | Reviewer Notes |
|-------------|-----------|-----------|----------------|
| Incident response playbook exists | Yes | [ ] |  |
| Notification flow: Security → Legal → Data Protection Officer | Defined | [ ] |  |
| RCA process within 72h | Enforced | [ ] |  |
| Audit trail for security events in ME-CENTRAL1 | Yes | [ ] |  |

---

## 6️⃣ Vendor & Integration Review

| Checkpoint | Expected | Verified | Reviewer Notes |
|-------------|-----------|-----------|----------------|
| All vendors under DPA/DTA | Yes | [ ] |  |
| API integrations not transferring PII cross-border | Yes | [ ] |  |
| DPIA performed for high-risk integrations | Yes | [ ] |  |

---

## 7️⃣ Change Control

| Checkpoint | Expected | Verified | Reviewer Notes |
|-------------|-----------|-----------|----------------|
| Regional config changes reviewed by compliance owner | Yes | [ ] |  |
| PDPL readiness doc updated with every regional or vendor change | Yes | [ ] |  |
| Next review scheduled (Quarterly) | Date → |  |

---

**Reviewer:** ______________________  
**Date Completed:** ______________________  
**Sign-off:** ✅ / ⚠️ / ❌  

---

_This checklist is part of Aurify1225’s PDPL compliance program and should be updated every quarter or after any infrastructure or data-flow change._

