variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Short name used to prefix/tag resources"
  type        = string
  default     = "health-passport"
}

variable "environment" {
  description = "Environment name (prod, staging, dev)"
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.20.0.0/16"
}

variable "azs" {
  description = "Availability zones to spread subnets across. EKS requires >= 2."
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "single_nat_gateway" {
  description = "Use one shared NAT gateway instead of one per AZ. Saves ~$32/mo per extra AZ at the cost of cross-AZ data transfer and a single point of failure for outbound traffic."
  type        = bool
  default     = true
}

variable "eks_cluster_version" {
  description = "Kubernetes version for the EKS control plane"
  type        = string
  default     = "1.31"
}

variable "node_instance_type" {
  description = "EC2 instance type for the managed node group"
  type        = string
  default     = "t3.medium"
}

variable "node_desired_size" {
  description = "Desired node count"
  type        = number
  default     = 2
}

variable "node_min_size" {
  description = "Minimum node count"
  type        = number
  default     = 2
}

variable "node_max_size" {
  description = "Maximum node count (headroom for HPA-driven pod scaling)"
  type        = number
  default     = 4
}

variable "ecr_repository_name" {
  description = "Name of the ECR repository for the app image"
  type        = string
  default     = "health-passport-app"
}

variable "github_repo" {
  description = "GitHub repo in 'org/name' form, used to scope the OIDC trust policy for CI/CD"
  type        = string
  # e.g. "your-org/health-passport-dashboard"
}
