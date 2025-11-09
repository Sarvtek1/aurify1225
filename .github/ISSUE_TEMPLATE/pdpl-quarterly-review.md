name: "PDPL Quarterly Review"
description: "Run the quarterly PDPL compliance and residency checklist"
title: "[PDPL] Quarterly Compliance Review — <Quarter YYYY>"
labels: ["compliance", "security", "PDPL"]
assignees: ["@info"]
body:
  - type: markdown
    attributes:
      value: |
        ## 🧾 PDPL Quarterly Review Checklist (Aurify1225)

        **Owner:** Electrafa-FZ  
        **Project:** Aurify (UAE)  
        **Scope:** Data residency, PII handling, access & vendor audits  
        **Last updated:** <YYYY-MM-DD>

  - type: textarea
    id: regional
    attributes:
      label: 1️⃣ Regional Compliance
      description: Verify Cloud Run, Firestore, and BigQuery all remain in `me-central1`.
      placeholder: |
        - [ ] Cloud Run: me-central1  
        - [ ] Firestore: me-central1  
        - [ ] BigQuery: ME-CENTRAL1  
        - [ ] Secret Manager: me-central1  
        - [ ] No cross-border PII

  - type: textarea
    id: access
    attributes:
      label: 2️⃣ Access Control
      description: Confirm least-privilege IAM and access reviews.
      placeholder: |
        - [ ] No Editor/Owner roles  
        - [ ] Quarterly IAM review done  
        - [ ] Audit logs stored in BigQuery

  - type: textarea
    id: incident
    attributes:
      label: 3️⃣ Incident Response
      description: Confirm breach playbook and RCA readiness.
      placeholder: |
        - [ ] IR playbook verified  
        - [ ] Notification flow updated  
        - [ ] RCA process validated

  - type: textarea
    id: vendors
    attributes:
      label: 4️⃣ Vendor & Integrations
      description: Verify DPAs and UAE residency guarantees.
      placeholder: |
        - [ ] All vendors under DPA/DTA  
        - [ ] DPIA required for new integrations  
        - [ ] No PII cross-border

  - type: textarea
    id: summary
    attributes:
      label: ✅ Summary & Sign-off
      placeholder: |
        Reviewer:  
        Date:  
        Result: ✅ / ⚠️ / ❌  
