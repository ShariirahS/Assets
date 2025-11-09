variable "project" {
  type = string
}

# TODO: Define VPC and firewall resources when migrating to Terraform-managed infra.
# resource "digitalocean_vpc" "main" {
#   name   = "${var.project}-vpc"
#   region = "nyc3"
# }

output "vpc_id" {
  value       = null
  description = "DigitalOcean VPC identifier"
}
