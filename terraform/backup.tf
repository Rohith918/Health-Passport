# Minimal backup story for the self-hosted Postgres StatefulSet: a small
# S3 bucket (lifecycle-expired after 30 days, so storage cost stays near
# zero) plus an IRSA role the in-cluster CronJob (k8s/postgres/backup.yaml)
# assumes to run pg_dump and upload the result.

resource "aws_s3_bucket" "pg_backups" {
  bucket = "${var.project_name}-pg-backups-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_lifecycle_configuration" "pg_backups" {
  bucket = aws_s3_bucket.pg_backups.id
  rule {
    id     = "expire-old-backups"
    status = "Enabled"
    expiration {
      days = 30
    }
  }
}

resource "aws_s3_bucket_public_access_block" "pg_backups" {
  bucket                  = aws_s3_bucket.pg_backups.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "aws_caller_identity" "current" {}

module "pg_backup_irsa" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.39"

  role_name = "${var.project_name}-pg-backup"

  role_policy_arns = {
    s3 = aws_iam_policy.pg_backup_s3.arn
  }

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["health-passport:postgres-backup"]
    }
  }
}

resource "aws_iam_policy" "pg_backup_s3" {
  name = "${var.project_name}-pg-backup-s3"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:PutObject"]
        Resource = "${aws_s3_bucket.pg_backups.arn}/*"
      }
    ]
  })
}

output "pg_backup_bucket" {
  value = aws_s3_bucket.pg_backups.bucket
}

output "pg_backup_role_arn" {
  value = module.pg_backup_irsa.iam_role_arn
}
