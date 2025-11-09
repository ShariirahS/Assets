variable "project" {
  type        = string
  description = "Project name for tagging resources"
  default     = "assets"
}

variable "digitalocean_token" {
  type        = string
  description = "DigitalOcean API token"
  sensitive   = true
}

variable "cloudflare_api_token" {
  type        = string
  description = "Cloudflare API token"
  sensitive   = true
}
