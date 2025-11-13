# Aurify Monitoring & Alerting Guide

## Overview
This document describes the monitoring setup, alert policies, and observability practices for the Aurify application.

## Monitoring Stack

### Google Cloud Monitoring
- **Service**: Cloud Run (aurify-ssr)
- **Region**: ME-Central1
- **Retention**: 30 days (metrics), 12 months (logs in BigQuery)

### Key Metrics

#### Cloud Run Performance
| Metric | Description | Target |
|--------|-------------|--------|
| Request Count | Total requests per minute | N/A (baseline) |
| Request Latency (p50) | Median response time | < 500ms |
| Request Latency (p95) | 95th percentile | < 1500ms |
| Request Latency (p99) | 99th percentile | < 2000ms |
| Error Rate (5xx) | Server errors / total requests | < 0.1% |
| Error Rate (4xx) | Client errors / total requests | < 5% |
| Instance Count | Active container instances | 0-10 |
| Memory Utilization | RAM usage per instance | < 80% |
| CPU Utilization | CPU usage per instance | < 70% |

#### Firebase Hosting
| Metric | Description | Target |
|--------|-------------|--------|
| Bandwidth | Monthly data transfer | Monitor usage |
| Cache Hit Rate | CDN cache hits / total | > 80% |
| Request Count | Requests per day | N/A (baseline) |

## Alert Policies

### Critical Alerts (Immediate Response)

#### High Error Rate
```yaml
Display Name: Cloud Run - High Error Rate (5xx)
Condition: 
  - Metric: run.googleapis.com/request_count
  - Filter: response_code_class="5xx"
  - Threshold: > 1% for 5 minutes
  - Aggregation: rate(1m)
Notification: Email, SMS
```

#### Service Down
```yaml
Display Name: Cloud Run - Service Unavailable
Condition:
  - Metric: run.googleapis.com/request_count
  - Filter: response_code="503"
  - Threshold: > 10 requests in 2 minutes
Notification: Email, SMS
```

#### High Latency
```yaml
Display Name: Cloud Run - P95 Latency High
Condition:
  - Metric: run.googleapis.com/request_latencies
  - Percentile: 95th
  - Threshold: > 2000ms for 5 minutes
Notification: Email
```

### Warning Alerts (Review Required)

#### Memory Pressure
```yaml
Display Name: Cloud Run - High Memory Usage
Condition:
  - Metric: run.googleapis.com/container/memory/utilizations
  - Threshold: > 80% for 10 minutes
Notification: Email
```

#### Approaching Instance Limit
```yaml
Display Name: Cloud Run - Instance Count High
Condition:
  - Metric: run.googleapis.com/container/instance_count
  - Threshold: > 8 instances (80% of max)
Notification: Email
```

#### Vulnerability Detected
```yaml
Display Name: Artifact Registry - Critical Vulnerability
Condition:
  - Metric: containeranalysis.googleapis.com/vulnerability/count
  - Filter: severity="CRITICAL"
  - Threshold: > 0
Notification: Email
```

## Creating Alert Policies

### Using gcloud CLI
```bash
# High error rate alert
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="Cloud Run - High Error Rate" \
  --condition-display-name="5xx errors > 1%" \
  --condition-threshold-value=0.01 \
  --condition-threshold-duration=300s \
  --condition-filter='resource.type="cloud_run_revision" AND metric.type="run.googleapis.com/request_count" AND metric.labels.response_code_class="5xx"' \
  --project=aurify1225
```

### Using Cloud Console
1. Navigate to **Monitoring > Alerting**
2. Click **Create Policy**
3. Select **Cloud Run Metric**
4. Configure conditions and notifications
5. Save policy

## Logging

### Structured Logging in Next.js
```typescript
// lib/logger.ts
export function logError(error: Error, context: Record<string, any> = {}) {
  console.error(JSON.stringify({
    severity: 'ERROR',
    message: error.message,
    stack: error.stack,
    ...context,
    timestamp: new Date().toISOString()
  }));
}

export function logInfo(message: string, context: Record<string, any> = {}) {
  console.log(JSON.stringify({
    severity: 'INFO',
    message,
    ...context,
    timestamp: new Date().toISOString()
  }));
}
```

### Querying Logs

#### Recent Errors
```bash
gcloud logging read "resource.type=cloud_run_revision \
  AND resource.labels.service_name=aurify-ssr \
  AND severity>=ERROR" \
  --project=aurify1225 \
  --limit=50 \
  --format=json
```

#### Specific User Session
```bash
gcloud logging read "resource.type=cloud_run_revision \
  AND jsonPayload.sessionId=\"SESSION_ID\"" \
  --project=aurify1225 \
  --limit=100
```

#### High Latency Requests
```bash
gcloud logging read "resource.type=cloud_run_revision \
  AND httpRequest.latency > 2s" \
  --project=aurify1225 \
  --limit=20 \
  --format="table(httpRequest.requestUrl, httpRequest.latency, timestamp)"
```

### BigQuery Log Analysis

#### Daily Error Count
```sql
SELECT
  DATE(timestamp) as date,
  severity,
  COUNT(*) as error_count
FROM `aurify1225.logs.cloudrun_logs_*`
WHERE severity >= 'ERROR'
  AND resource.type = 'cloud_run_revision'
  AND resource.labels.service_name = 'aurify-ssr'
GROUP BY date, severity
ORDER BY date DESC
LIMIT 30;
```

#### Top Error Messages
```sql
SELECT
  jsonPayload.message as error_message,
  COUNT(*) as occurrences,
  MAX(timestamp) as last_seen
FROM `aurify1225.logs.cloudrun_logs_*`
WHERE severity = 'ERROR'
  AND timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
GROUP BY error_message
ORDER BY occurrences DESC
LIMIT 20;
```

## Dashboards

### Cloud Run Dashboard
Create custom dashboard with:
1. **Request Rate**: Line chart of requests/minute
2. **Error Rate**: Stacked area chart (4xx vs 5xx)
3. **Latency Distribution**: Heatmap of p50/p95/p99
4. **Instance Count**: Line chart over time
5. **Memory/CPU**: Dual-axis chart
6. **Geographic Distribution**: Map of request origins

### Firebase Hosting Dashboard
1. **Bandwidth Usage**: Monthly trend
2. **Cache Hit Rate**: Pie chart (hits vs misses)
3. **Top URLs**: Table of most requested paths
4. **Response Codes**: Bar chart distribution

## Performance Monitoring

### Cloud Trace
Enable distributed tracing:
```typescript
// next.config.ts
module.exports = {
  experimental: {
    instrumentationHook: true
  }
}
```

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { NodeTracerProvider } = await import('@opentelemetry/sdk-trace-node');
    const { Resource } = await import('@opentelemetry/resources');
    const { SemanticResourceAttributes } = await import('@opentelemetry/semantic-conventions');
    
    const provider = new NodeTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'aurify-ssr',
      }),
    });
    
    provider.register();
  }
}
```

### Cloud Profiler
Enable continuous profiling:
```bash
# Add to Dockerfile
RUN npm install --save @google-cloud/profiler
```

```typescript
// app/layout.tsx (server-side only)
if (process.env.NODE_ENV === 'production') {
  require('@google-cloud/profiler').start({
    serviceContext: {
      service: 'aurify-ssr',
      version: process.env.K_REVISION || 'unknown',
    },
  });
}
```

## Security Monitoring

### Vulnerability Scanning
```bash
# List vulnerabilities in latest image
gcloud artifacts docker images list \
  me-central1-docker.pkg.dev/aurify1225/cloud-run-source-deploy/aurify-ssr \
  --include-tags \
  --format=json | jq '.[0].vulnerabilitySummary'

# Get detailed vulnerability report
gcloud artifacts docker images describe \
  me-central1-docker.pkg.dev/aurify1225/cloud-run-source-deploy/aurify-ssr:latest \
  --show-package-vulnerability \
  --format=json
```

### Audit Logs
```bash
# Recent IAM changes
gcloud logging read "protoPayload.serviceName=\"iam.googleapis.com\"" \
  --project=aurify1225 \
  --limit=20 \
  --format="table(timestamp, protoPayload.methodName, protoPayload.authenticationInfo.principalEmail)"

# Cloud Run configuration changes
gcloud logging read "protoPayload.serviceName=\"run.googleapis.com\" \
  AND protoPayload.methodName=~\"Update|Create|Delete\"" \
  --project=aurify1225 \
  --limit=20
```

## Compliance Monitoring

### PDPL Data Residency Check
```bash
# Verify all data is in ME-CENTRAL1
gcloud logging read "resource.labels.location!=\"me-central1\" \
  AND resource.type=\"cloud_run_revision\"" \
  --project=aurify1225 \
  --limit=1

# Should return 0 results
```

### Log Retention Audit
```sql
-- Verify logs are retained for 12 months
SELECT
  MIN(timestamp) as oldest_log,
  MAX(timestamp) as newest_log,
  TIMESTAMP_DIFF(MAX(timestamp), MIN(timestamp), DAY) as retention_days
FROM `aurify1225.logs.cloudrun_logs_*`;
```

## Incident Response

### Runbook: High Error Rate

1. **Identify**: Check alert notification
2. **Assess**: 
   ```bash
   gcloud logging read "severity>=ERROR" --limit=20 --project=aurify1225
   ```
3. **Mitigate**: 
   - Check if issue is localized (specific route/locale)
   - Consider rollback if widespread
4. **Resolve**: Deploy fix
5. **Document**: Update incident log

### Runbook: High Latency

1. **Check instance count**: May need to increase max-instances
2. **Review traces**: Identify slow database queries or API calls
3. **Check dependencies**: Verify external services are responsive
4. **Optimize**: Add caching, optimize queries, or scale resources

### Runbook: Memory Issues

1. **Check metrics**: Identify memory leak pattern
2. **Review code**: Look for unbounded arrays, circular references
3. **Enable profiler**: Capture heap snapshots
4. **Increase memory**: Temporary mitigation while fixing root cause

## Notification Channels

### Email
```bash
gcloud alpha monitoring channels create \
  --display-name="DevOps Team Email" \
  --type=email \
  --channel-labels=email_address=devops@example.com \
  --project=aurify1225
```

### Slack
```bash
gcloud alpha monitoring channels create \
  --display-name="Slack #alerts" \
  --type=slack \
  --channel-labels=url=SLACK_WEBHOOK_URL \
  --project=aurify1225
```

## Cost Monitoring

### Budget Alert
```bash
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Aurify Monthly Budget" \
  --budget-amount=500USD \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90 \
  --threshold-rule=percent=100
```

### Cost Attribution
Tag Cloud Run with labels:
```bash
gcloud run services update aurify-ssr \
  --region=me-central1 \
  --labels=app=aurify,env=production,team=engineering \
  --project=aurify1225
```

## Best Practices

1. **Use structured logging** - JSON format for easy querying
2. **Set appropriate alert thresholds** - Avoid alert fatigue
3. **Test alert policies** - Use test notifications
4. **Document runbooks** - Clear incident response procedures
5. **Review dashboards weekly** - Identify trends early
6. **Archive old logs** - Export to Cloud Storage for long-term retention
7. **Monitor costs** - Set budgets and review billing regularly
8. **Regular security scans** - Weekly vulnerability reviews
9. **Compliance audits** - Monthly PDPL compliance checks
10. **Performance baselines** - Update SLOs quarterly

## Support Resources

- [Cloud Monitoring Documentation](https://cloud.google.com/monitoring/docs)
- [Cloud Logging Documentation](https://cloud.google.com/logging/docs)
- [Cloud Run Observability](https://cloud.google.com/run/docs/logging)
- [Alert Policy Reference](https://cloud.google.com/monitoring/api/ref_v3/rest/v3/projects.alertPolicies)
