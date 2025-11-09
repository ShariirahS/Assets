# Terraform Stack

This directory hosts the infrastructure-as-code blueprint described in `docs/devops-deployment.md`.

## Usage

1. Install Terraform >= 1.8.
2. Authenticate with the DigitalOcean and Cloudflare providers.
3. Copy `terraform.tfvars.example` to `terraform.tfvars` and supply secrets.
4. Run `terraform init` followed by `terraform plan`.

> The module resources are placeholders until the cloud resources are provisioned. Uncomment the resource blocks once ready.
