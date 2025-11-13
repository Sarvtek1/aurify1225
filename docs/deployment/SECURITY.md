# Security Configuration Guide

## Container Vulnerability Scanning

### Enable Scanning
Container vulnerability scanning is now enabled via the Container Scanning API. The API has been activated for the project.

To verify scanning status:
```bash
gcloud artifacts repositories describe cloud-run-source-deploy \
  --location=me-central1 \
  --project=aurify1225 \
  --format="value(vulnerabilityScanningConfig.enablementState)"
```

### Manual Scan
Trigger on-demand vulnerability scan:
```bash
# Scan latest image
gcloud artifacts docker images scan \
  me-central1-docker.pkg.dev/aurify1225/cloud-run-source-deploy/aurify-ssr:latest \
  --project=aurify1225
```

### View Vulnerabilities
```bash
# List vulnerabilities for latest image
gcloud artifacts docker images list-vulnerabilities \
  me-central1-docker.pkg.dev/aurify1225/cloud-run-source-deploy/aurify-ssr:latest \
  --project=aurify1225 \
  --format=json
```

### Alert on Critical Vulnerabilities
Create monitoring alert for critical vulnerabilities:
```bash
gcloud alpha monitoring policies create \
  --display-name="Critical Container Vulnerabilities" \
  --condition-display-name="Critical CVEs detected" \
  --condition-threshold-value=0 \
  --condition-threshold-comparison=COMPARISON_GT \
  --condition-filter='resource.type="artifact_registry_repository" AND metric.type="artifactregistry.googleapis.com/repository/vulnerabilities" AND metric.labels.severity="CRITICAL"' \
  --project=aurify1225
```

## Service Account Security

### Dedicated Service Account
The Cloud Run service uses a dedicated service account with minimal permissions:

**Service Account**: `aurify-run-sa@aurify1225.iam.gserviceaccount.com`

**Permissions** (least-privilege):
- `roles/logging.logWriter` - Write logs to Cloud Logging
- `roles/secretmanager.secretAccessor` - Read secrets (API keys)
- `roles/cloudtrace.agent` - Submit trace data

### Verify Service Account
```bash
# Check service account exists
gcloud iam service-accounts describe aurify-run-sa@aurify1225.iam.gserviceaccount.com \
  --project=aurify1225

# List permissions
gcloud projects get-iam-policy aurify1225 \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:aurify-run-sa@aurify1225.iam.gserviceaccount.com" \
  --format="table(bindings.role)"
```

### Rotate Service Account Keys
If using JSON keys (for CI/CD):
```bash
# List existing keys
gcloud iam service-accounts keys list \
  --iam-account=aurify-run-sa@aurify1225.iam.gserviceaccount.com \
  --project=aurify1225

# Create new key
gcloud iam service-accounts keys create ~/key.json \
  --iam-account=aurify-run-sa@aurify1225.iam.gserviceaccount.com \
  --project=aurify1225

# Update GitHub secret GCP_SA_KEY with new key content

# Delete old key
gcloud iam service-accounts keys delete KEY_ID \
  --iam-account=aurify-run-sa@aurify1225.iam.gserviceaccount.com \
  --project=aurify1225
```

## Secret Management

### Store Secrets in Secret Manager
```bash
# Create secret
echo -n "your-api-key-value" | gcloud secrets create API_KEY \
  --data-file=- \
  --replication-policy=user-managed \
  --locations=me-central1 \
  --project=aurify1225

# Grant access to service account
gcloud secrets add-iam-policy-binding API_KEY \
  --member="serviceAccount:aurify-run-sa@aurify1225.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --project=aurify1225
```

### Rotate Secrets
```bash
# Add new version
echo -n "new-api-key-value" | gcloud secrets versions add API_KEY \
  --data-file=- \
  --project=aurify1225

# Cloud Run automatically uses :latest version
# Disable old version after testing
gcloud secrets versions disable VERSION_NUMBER \
  --secret=API_KEY \
  --project=aurify1225
```

### Access Secret in Next.js
```typescript
// lib/secrets.ts
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getSecret(secretName: string): Promise<string> {
  const name = `projects/aurify1225/secrets/${secretName}/versions/latest`;
  const [version] = await client.accessSecretVersion({ name });
  return version.payload?.data?.toString() || '';
}
```

## Binary Authorization (Optional)

### Enable Binary Authorization
For production environments, require signed container images:

```bash
# Enable API
gcloud services enable binaryauthorization.googleapis.com --project=aurify1225

# Create policy requiring attestations
cat > policy.yaml << EOF
admissionWhitelistPatterns:
- namePattern: gcr.io/google-samples/*
defaultAdmissionRule:
  evaluationMode: REQUIRE_ATTESTATION
  enforcementMode: ENFORCED_BLOCK_AND_AUDIT_LOG
  requireAttestationsBy:
  - projects/aurify1225/attestors/prod-attestor
globalPolicyEvaluationMode: ENABLE
EOF

gcloud container binauthz policy import policy.yaml --project=aurify1225
```

## Network Security

### VPC Connector (Optional)
For private database access:
```bash
# Create VPC connector
gcloud compute networks vpc-access connectors create aurify-connector \
  --region=me-central1 \
  --network=default \
  --range=10.8.0.0/28 \
  --project=aurify1225

# Update Cloud Run to use connector
gcloud run services update aurify-ssr \
  --region=me-central1 \
  --vpc-connector=aurify-connector \
  --vpc-egress=private-ranges-only \
  --project=aurify1225
```

### Cloud Armor (Optional)
For DDoS protection and WAF rules:
```bash
# Create security policy
gcloud compute security-policies create aurify-policy \
  --project=aurify1225

# Add rate limiting rule
gcloud compute security-policies rules create 1000 \
  --security-policy=aurify-policy \
  --expression="true" \
  --action=rate-based-ban \
  --rate-limit-threshold-count=1000 \
  --rate-limit-threshold-interval-sec=60 \
  --ban-duration-sec=600 \
  --conform-action=allow \
  --exceed-action=deny-403 \
  --project=aurify1225
```

## HTTPS & TLS

### Cloud Run TLS
Cloud Run automatically provides TLS certificates for all services. Verify HTTPS is enforced:

```bash
# Check service URL
gcloud run services describe aurify-ssr \
  --region=me-central1 \
  --project=aurify1225 \
  --format="value(status.url)"
# Should return https:// URL
```

### Firebase Hosting TLS
Firebase Hosting automatically provisions SSL certificates. Verify with:
```bash
curl -I https://aurify1225.web.app | grep -i "strict-transport-security"
# Should show HSTS header
```

### Certificate Transparency
Cloud Run and Firebase Hosting automatically submit certificates to CT logs for transparency.

## Audit Logging

### Enable Data Access Logs
```bash
# Get current IAM policy
gcloud projects get-iam-policy aurify1225 > iam-policy.yaml

# Edit to add audit logging
cat >> iam-policy.yaml << EOF
auditConfigs:
- auditLogConfigs:
  - logType: ADMIN_READ
  - logType: DATA_READ
  - logType: DATA_WRITE
  service: run.googleapis.com
- auditLogConfigs:
  - logType: ADMIN_READ
  - logType: DATA_READ
  service: secretmanager.googleapis.com
EOF

# Apply policy
gcloud projects set-iam-policy aurify1225 iam-policy.yaml
```

### Review Audit Logs
```bash
# IAM changes
gcloud logging read "protoPayload.serviceName=\"iam.googleapis.com\"" \
  --project=aurify1225 \
  --limit=50 \
  --format=json

# Secret access
gcloud logging read "protoPayload.serviceName=\"secretmanager.googleapis.com\"" \
  --project=aurify1225 \
  --limit=50
```

## Security Scanning

### Container Analysis
Container Scanning API automatically scans all pushed images. View results:
```bash
# Get vulnerability summary
gcloud artifacts docker images describe \
  me-central1-docker.pkg.dev/aurify1225/cloud-run-source-deploy/aurify-ssr:latest \
  --show-package-vulnerability \
  --project=aurify1225
```

### Dependency Scanning
Run npm audit in CI/CD:
```yaml
# .github/workflows/security-scan.yml
name: Security Scan
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  workflow_dispatch:

jobs:
  npm-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Audit dependencies
        working-directory: ./aurify-web
        run: |
          npm audit --audit-level=moderate
          npm audit --json > audit-report.json
      - name: Upload audit report
        uses: actions/upload-artifact@v4
        with:
          name: npm-audit-report
          path: aurify-web/audit-report.json
```

## Incident Response

### Security Incident Runbook

1. **Detection**: Alert triggered or manual discovery
2. **Containment**: 
   ```bash
   # Disable compromised service account
   gcloud iam service-accounts disable aurify-run-sa@aurify1225.iam.gserviceaccount.com
   
   # Revoke Cloud Run service (emergency)
   gcloud run services update aurify-ssr \
     --no-allow-unauthenticated \
     --region=me-central1
   ```
3. **Investigation**: Review audit logs, access logs, container logs
4. **Eradication**: Deploy patched version, rotate secrets/keys
5. **Recovery**: Re-enable service with new credentials
6. **Post-mortem**: Document incident, update procedures

### Emergency Contacts
- Security Team: [email]
- GCP Support: https://console.cloud.google.com/support
- Firebase Support: https://firebase.google.com/support

## Compliance & Best Practices

### PDPL Security Requirements
- ✅ Data encrypted in transit (TLS 1.2+)
- ✅ Data encrypted at rest (Google-managed keys)
- ✅ Access controls via IAM (least-privilege)
- ✅ Audit logging enabled (12-month retention)
- ✅ Data residency enforced (ME-Central1 region lock)
- ✅ Vulnerability scanning enabled
- ✅ Regular security updates (automated via CI/CD)

### Security Checklist
- [ ] Enable Container Scanning API
- [ ] Create dedicated service account with minimal permissions
- [ ] Store secrets in Secret Manager (never in code/env vars)
- [ ] Enable audit logging for sensitive APIs
- [ ] Set up security alerts (vulnerabilities, IAM changes)
- [ ] Rotate service account keys quarterly
- [ ] Review IAM permissions monthly
- [ ] Run npm audit weekly
- [ ] Monitor security bulletins for Next.js, React, Node.js
- [ ] Test incident response procedures quarterly
- [ ] Review and update security policies annually

## References

- [Cloud Run Security](https://cloud.google.com/run/docs/securing/overview)
- [Container Scanning](https://cloud.google.com/container-analysis/docs/container-scanning-overview)
- [Secret Manager Best Practices](https://cloud.google.com/secret-manager/docs/best-practices)
- [IAM Best Practices](https://cloud.google.com/iam/docs/best-practices)
- [Binary Authorization](https://cloud.google.com/binary-authorization/docs)
