# Health Passport — Infra & CI/CD

Terraform (VPC/EKS/ECR) + Kubernetes manifests (self-hosted Postgres,
app Deployment, HPA, ALB Ingress) + GitHub Actions CI/CD.

## Setup order (each step depends on the previous one — don't skip ahead)

### 1. Provision AWS infra
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars   # fill in github_repo at minimum
terraform init
terraform apply
```
Note the outputs — you'll need `ecr_repository_url`, `github_actions_role_arn`,
`pg_backup_role_arn`, and `pg_backup_bucket` in later steps.

### 2. Point kubectl at the new cluster
```bash
$(terraform output -raw configure_kubectl)
```

### 3. Install cluster add-ons (not managed by Terraform — see note below)
```bash
# Metrics Server — required for the HPA to read CPU/memory at all
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# AWS Load Balancer Controller — required for the ALB Ingress
helm repo add eks https://aws.github.io/eks-charts && helm repo update
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=$(terraform -chdir=terraform output -raw cluster_name) \
  --set serviceAccountName=aws-load-balancer-controller \
  --set serviceAccount.create=true \
  --set serviceAccount.annotations."eks\.amazonaws\.com/role-arn"=$(terraform -chdir=terraform output -raw alb_controller_role_arn)
```

### 4. Create secrets (one-time, manual — never commit real values)
```bash
kubectl apply -f k8s/namespace.yaml

kubectl create secret generic postgres-secrets -n health-passport \
  --from-literal=POSTGRES_USER=postgres \
  --from-literal=POSTGRES_PASSWORD="$(openssl rand -base64 24)" \
  --from-literal=POSTGRES_DB=healthdb

kubectl create secret generic app-secrets -n health-passport \
  --from-literal=JWT_SECRET="$(openssl rand -base64 32)"
```

### 5. Fill in the placeholders
- `k8s/app-deployment.yaml` → `<ECR_REPOSITORY_URL>` (from Terraform output;
  CI overwrites this on every deploy anyway, but it needs a valid value
  for the very first `kubectl apply`)
- `k8s/app-ingress.yaml` → `<ACM_CERTIFICATE_ARN>` and `<YOUR_DOMAIN>`
- `k8s/postgres/backup.yaml` → `<PG_BACKUP_ROLE_ARN>` and `<PG_BACKUP_BUCKET_NAME>`
  (from Terraform outputs)

### 6. Wire up GitHub Actions
In your repo: **Settings → Secrets and variables → Actions → New repository secret**
- `AWS_ROLE_ARN` = the `github_actions_role_arn` Terraform output

Push to `main` — the workflow builds, pushes to ECR, and deploys.

### 7. Point DNS at the ALB
```bash
kubectl get ingress health-passport-ingress -n health-passport
```
Create a Route 53 (or other DNS) ALIAS/CNAME record for `<YOUR_DOMAIN>`
pointing at the `ADDRESS` shown.

---

## What's deliberately NOT in Terraform

Metrics Server and the AWS Load Balancer Controller are installed via
`kubectl`/`helm` in step 3, not as Terraform resources. This is a
common, defensible split (Terraform owns AWS-level infra; cluster-internal
add-ons are managed via Kubernetes-native tooling) — but if you want a
single `terraform apply` to do everything, both can be added via the
`helm` Terraform provider. Ask if you want that version instead.

## Cost shape (us-east-1, rough, excludes data transfer)

| Item | ~Monthly |
|---|---|
| EKS control plane | $73 (fixed, unavoidable with EKS) |
| 2× t3.medium on-demand nodes | ~$60 |
| 1 NAT Gateway (shared) | ~$32 + data |
| ALB | ~$18 + data |
| EBS gp3 (Postgres 10Gi + node roots) | ~$3 |
| ECR storage | ~$0.10/GB, negligible at this scale |
| S3 backups (30-day expiry) | pennies |
| **Total** | **~$185-200/mo** |

The two biggest levers if this needs to come down further:
- Drop the ALB Ingress for a plain `LoadBalancer` Service (saves little —
  similar cost — but simpler)
- The EKS control plane fee is the one cost Terraform can't optimize away;
  if $73/mo flat is the actual blocker, ECS Fargate or a single EC2 box
  running Docker Compose would undercut EKS significantly for a workload
  this size. Worth a second look if cost, not Kubernetes features
  specifically, is the primary constraint.

## Known trade-offs from your choices

- **Self-hosted Postgres, single replica**: node failure = downtime until
  the pod reschedules and reattaches its EBS volume. The daily backup
  CronJob (`k8s/postgres/backup.yaml`) is the only recovery path if the
  volume itself is lost — test a restore before you need one for real.
- **On-demand nodes, no Spot**: stable, no interruption handling needed,
  costs more than Spot would for the same capacity.
- **`node_min_size = 2`**: never scales to zero, so you're paying for at
  least 2 nodes even at 3am with no traffic. Cluster Autoscaler (not
  included here) could let this drop lower, but adds complexity.
