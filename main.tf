terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.0"
    }
  }
}

provider "docker" {}

module "mongo" {
  source = "./devops/terraform-modules/mongo"
  network_name = docker_network.publication_network.name
}

module "mongo_express" {
  source = "./devops/terraform-modules/mongo-express"
  network_name = docker_network.publication_network.name
}

module "server" {
  source = "./devops/terraform-modules/server"
  network_name = docker_network.publication_network.name
}

module "client" {
  source = "./devops/terraform-modules/client"
  network_name = docker_network.publication_network.name
}

module "proxy" {
  source       = "./devops/terraform-modules/proxy"
  network_name = docker_network.publication_network.name

  depends_on_server = module.server
  depends_on_client = module.client
}

resource "docker_network" "publication_network" {
  name = "publication_network"
}