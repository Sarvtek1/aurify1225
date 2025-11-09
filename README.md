🚀 Aurify1225 — Cloud Run + Firebase Hosting Deployment Checklist
Project Info

Project ID: aurify1225

Region: me-central1

Framework: Next.js (SSR)

Architecture: Firebase Hosting → Cloud Run (SSR) → GCP APIs

Service: aurify-ssr

Hosting URL: https://aurify1225.web.app

Cloud Run URL: https://aurify-ssr-j2xhwhwdza-ww.a.run.app

✅ Deployment Summary
Component	Status	Notes
Cloud Run (aurify-ssr)	✅ Deployed	Next.js SSR container live
Firebase Hosting	✅ Connected	Rewrites route to Cloud Run
GitHub Actions CI	✅ Stable	Deploy verified on master push
PDPL Compliance Guard	✅ Valid YAML	Non-fatal service check
IAM Roles	✅ Correct	GCP SA fully authorized
Secrets (API_KEY)	✅ Configured	Stored in Secret Manager
Artifact Registry	✅ Exists	cloud-run-source-deploy
Region Residency	✅ Compliant	All resources in me-central1
Logs / SSR Validation	✅ Pass	Hosting → Cloud Run confirmed
🧱 Verified Configurations
Firebase (firebase.json)
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/**",
        "run": {
          "serviceId": "aurify-ssr",
          "region": "me-central1"
        }
      }
    ]
  }
}

Cloud Run Environment
GCP_REGION=me-central1
BQ_LOCATION=ME-CENTRAL1
API_KEY=MY_API_KEY:latest

Service Account Roles

Bound to github-firebase-deployer@aurify1225.iam.gserviceaccount.com:

roles/run.admin
roles/iam.serviceAccountUser
roles/artifactregistry.writer
roles/secretmanager.secretAccessor
roles/cloudbuild.builds.editor

⚙️ Deployment Commands (Manual Reference)
Deploy Cloud Run (SSR app)
cd aurify-web

gcloud run deploy aurify-ssr \
  --region=me-central1 \
  --allow-unauthenticated \
  --project=aurify1225 \
  --source . \
  --set-env-vars=GCP_REGION=me-central1 \
  --set-env-vars=BQ_LOCATION=ME-CENTRAL1 \
  --set-secrets=API_KEY=MY_API_KEY:latest

Deploy Firebase Hosting
firebase deploy --only hosting --project aurify1225

🔍 Verification Commands
Check Service URL
gcloud run services describe aurify-ssr \
  --region=me-central1 \
  --project=aurify1225 \
  --format="value(status.url)"

View Recent Cloud Run Logs
gcloud logging read \
  'resource.type="cloud_run_revision" AND resource.labels.service_name="aurify-ssr"' \
  --project=aurify1225 \
  --freshness=10m \
  --format='table(timestamp, httpRequest.requestUrl, httpRequest.status)'


Expected Output:

TIMESTAMP                  REQUEST_URL                                     STATUS
2025-11-09T21:17:41Z       https://aurify-ssr-...run.app/?t=...           200

🌐 Request Flow (Confirmed)
User → https://aurify1225.web.app → Firebase Hosting Rewrite → Cloud Run (aurify-ssr)
        ↑ Static Assets CDN Cache          ↓
          Served from Next.js SSR          Logs via Cloud Run console


Headers on response:

X-Powered-By: Next.js
X-Nextjs-Cache: HIT
X-Nextjs-Prerender: 1
Cache-Control: s-maxage=31536000

🧩 Next Recommended Steps

Adjust Cache Policy

For dynamic pages, prefer:

export const revalidate = 300; // 5 min ISR
// or:
res.setHeader('Cache-Control', 'no-store');


Avoid long s-maxage on user-specific pages.

Monitoring

Enable:

Cloud Run metrics (latency, cold_start)

Uptime checks

Error Reporting

Documentation

Update:

/docs/compliance/pdpl-readiness.md

/docs/deployment/aurify-ssr.md

Security

Rotate service account keys periodically.

Restrict github-firebase-deployer to CI use only.

✅ Final Verification Snapshot
Check	Result	Verified
SSR Served via Cloud Run	✅ Yes	Logs show direct hits
Firebase Rewrite Working	✅ Yes	Hosting → Cloud Run confirmed
Secrets Loaded	✅ Yes	API_KEY resolved at runtime
Region Residency	✅ Yes	All services in me-central1
PDPL / Compliance	✅ Yes	Doha-region safe configuration
CI Deploys	✅ Yes	Green GitHub Actions
Manual Deploy	✅ Works	Tested via gcloud CLI
