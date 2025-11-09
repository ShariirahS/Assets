variable "project" {
  type = string
}

variable "network_out" {
  description = "Network module outputs"
}

# TODO: Add droplet, load balancer, and database resources.
# resource "digitalocean_droplet" "app" {
#   name   = "${var.project}-app"
#   region = "nyc3"
#   size   = "s-2vcpu-4gb"
#   image  = "ubuntu-22-04-x64"
# }

output "droplet_ip" {
  value       = null
  description = "Primary droplet IP"
}
