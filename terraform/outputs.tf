output "cluster_name" {
  value = module.eks.cluster_name
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "ecr_repository_url" {
  value = aws_ecr_repository.app.repository_url
}

output "github_actions_role_arn" {
  description = "Set this as the AWS_ROLE_ARN in your GitHub repo (Settings > Secrets and variables > Actions)"
  value       = aws_iam_role.github_actions.arn
}

output "region" {
  value = var.aws_region
}

output "alb_controller_role_arn" {
  description = "Set this as the eks.amazonaws.com/role-arn annotation on the aws-load-balancer-controller service account"
  value       = module.alb_controller_irsa.iam_role_arn
}

output "configure_kubectl" {
  value = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}
