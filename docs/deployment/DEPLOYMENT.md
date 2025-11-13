# Aurify Deployment Guide

## Overview
This document describes the deployment architecture, process, and compliance measures for the Aurify application.

## Architecture

### Hosting Stack
- **Frontend CDN**: Firebase Hosting (global CDN for static assets)
- **Backend/SSR**: Cloud Run (serverless containers in ME-Central1)
- **Region**: ME-Central1 (UAE data residency compliance)
- **Container Registry**: Artifact Registry (ME-Central1)

### Request Flow
```
User Request
    ↓
Firebase Hosting CDN (global)
    ↓
├─ Static Assets (JS/CSS/images) → Cached globally (1 year TTL)
└─ Dynamic Routes → Cloud Run (me-central1) → No CDN cache
```

## Compliance & Data Residency

### UAE PDPL Compliance
1. **Data Residency**: All dynamic/PII data served exclusively from Cloud Run in ME-Central1
2. **Cache Control**: 
   - Dynamic pages: `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`
   - Static assets: `Cache-Control: public, max-age=31536000, immutable`
3. **Logging**: BigQuery logs stored in ME-Central1 with 12-month retention
4. **Secrets**: Stored in Secret Manager (ME-Central1 region)

### Security Measures
- Container runs as non-root user (`nextjs`)
- Dedicated service account with least-privilege IAM
- Container vulnerability scanning enabled
- HSTS enforced with preload
- Secrets mounted via Secret Manager (not env vars)

## Deployment Process

### Manual Deployment

#### Prerequisites
- Google Cloud SDK installed and authenticated
- Firebase CLI installed (`npm install -g firebase-tools`)
- Docker installed (for local builds)
- Access to GCP project `aurify1225`

#### Deploy Cloud Run (from local)
```bash
cd aurify-web

# Deploy using source (Cloud Build will build the container)
gcloud run deploy aurify-ssr \
  --region=me-central1 \
  --allow-unauthenticated \
  --project=aurify1225 \
  --source . \
  --clear-base-image \
  --set-env-vars=GCP_REGION=me-central1,BQ_LOCATION=ME-CENTRAL1 \
  --set-secrets=API_KEY=MY_API_KEY_MEC1:latest \
  --memory=1Gi \
  --concurrency=80 \
  --max-instances=10
```

#### Deploy Firebase Hosting
```bash
cd ../  # repo root

# Authenticate
firebase login

# Set project
firebase use aurify1225

# Deploy hosting configuration
firebase deploy --only hosting
```

### CI/CD Automated Deployment

#### Workflows
1. **Cloud Run Deployment** (`.github/workflows/deploy-cloudrun.yml`)
   - Triggers: Push to `master` branch, changes to `aurify-web/**`
   - Steps:
     - PDPL compliance checks (BigQuery location, retention, logging sink)
     - Next.js build preflight
     - Create/verify service account
     - Deploy to Cloud Run in ME-Central1
   
2. **Firebase Hosting PR Preview** (`.github/workflows/firebase-hosting-pull-request.yml`)
   - Triggers: Pull requests to `master`/`main`
   - Creates preview channel for testing
   
3. **Firebase Hosting Live** (`.github/workflows/firebase-hosting-merge.yml`)
   - Triggers: Merge to `master`/`main`
   - Deploys to production hosting

#### Required Secrets
- `GCP_SA_KEY`: Service account JSON key with permissions for:
  - Cloud Run Admin
  - Artifact Registry Writer
  - Service Account User
  - Secret Manager Secret Accessor
  - BigQuery Data Viewer (for compliance checks)

## Verification

### Verify Cloud Run Deployment
```bash
# Check service status
gcloud run services describe aurify-ssr \
  --region=me-central1 \
  --project=aurify1225

# Test endpoints
curl -I https://aurify-ssr-671472133551.me-central1.run.app/en
curl -I https://aurify-ssr-671472133551.me-central1.run.app/ar
```

### Verify Firebase Hosting
```bash
# Check headers
curl -I https://aurify1225.web.app/en
curl -I https://aurify1225.web.app/ar

# Verify static asset caching
curl -I https://aurify1225.web.app/favicon.ico
```

### Verify Cache Headers
**Dynamic pages** should return:
```
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
X-Cache: MISS
```

**Static assets** (JS/CSS) should return:
```
Cache-Control: public, max-age=31536000, immutable
```

## Monitoring & Alerts

### Cloud Run Metrics
- Request count
- Request latency (p50, p95, p99)
- Error rate (5xx responses)
- Instance count
- Memory/CPU utilization

### Recommended Alerts
1. Error rate > 1% for 5 minutes
2. p95 latency > 2 seconds
3. Instance count approaching max-instances
4. Memory utilization > 80%

### Logs
```bash
# View Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=aurify-ssr" \
  --project=aurify1225 \
  --limit=50 \
  --format=json
```

## Rollback Procedure

### Cloud Run Rollback
```bash
# List revisions
gcloud run revisions list \
  --service=aurify-ssr \
  --region=me-central1 \
  --project=aurify1225

# Route traffic to previous revision
gcloud run services update-traffic aurify-ssr \
  --region=me-central1 \
  --project=aurify1225 \
  --to-revisions=REVISION_NAME=100
```

### Firebase Hosting Rollback
```bash
# List hosting releases
firebase hosting:releases:list --project=aurify1225

# Rollback to previous release
firebase hosting:rollback --project=aurify1225
```

## Troubleshooting

### Build Failures
1. Check Cloud Build logs in GCP Console
2. Verify Dockerfile syntax
3. Check package.json dependencies
4. Ensure `.dockerignore` is configured

### Deployment Failures
1. Check service account permissions
2. Verify secrets exist in Secret Manager
3. Check region configuration (must be me-central1)
4. Review Cloud Run quotas

### Cache Issues
1. Verify `firebase.json` headers configuration
2. Check response headers from Cloud Run
3. Clear CDN cache: `gcloud compute url-maps invalidate-cdn-cache`

## Cost Optimization

### Cloud Run
- Use `--max-instances` to control costs
- Set `--concurrency` appropriately (80-100 recommended)
- Monitor cold starts and adjust min-instances if needed

### Firebase Hosting
- Optimize static assets (compression, minification)
- Use immutable cache headers for versioned assets
- Monitor bandwidth usage

## Security Best Practices

1. **Never commit secrets** - Use Secret Manager
2. **Use least-privilege IAM** - Dedicated service accounts
3. **Enable vulnerability scanning** - Container Analysis API
4. **Keep dependencies updated** - Regular `npm audit` and updates
5. **Monitor audit logs** - Enable Cloud Audit Logs
6. **Use HTTPS only** - Enforced via HSTS headers
7. **Validate compliance** - Run PDPL checks in CI/CD

## Support

For deployment issues:
1. Check GitHub Actions workflow logs
2. Review Cloud Build logs in GCP Console
3. Check Cloud Run logs
4. Verify service account permissions

## References

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [UAE PDPL Compliance](../compliance/pdpl-readiness.md)
