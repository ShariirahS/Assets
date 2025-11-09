variable "project" {
  type = string
}

# TODO: Provision managed Grafana/Prometheus services.
# resource "digitalocean_monitoring_alert" "cpu" {
#   alerts { }
# }

output "monitoring_stack" {
  value       = []
  description = "Placeholder outputs for monitoring resources"
}
