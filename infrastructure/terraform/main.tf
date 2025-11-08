terraform {
  required_version = "~> 1.8"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  backend "remote" {
    # Configure Terraform Cloud backend when organization/workspace exist.
    # hostname     = "app.terraform.io"
    # organization = "assets"

    # workspaces {
    #   name = "assets-production"
    # }
  }
}

provider "digitalocean" {
  token = var.digitalocean_token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

module "network" {
  source = "./modules/network"
  project = var.project
}

module "compute" {
  source = "./modules/compute"
  project     = var.project
  network_out = module.network
}

module "monitoring" {
  source = "./modules/monitoring"
  project = var.project
}
