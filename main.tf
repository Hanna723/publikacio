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
  source = "./terraform-modules/mongo"
  network_name = docker_network.publication_network.name
}

module "mongo_express" {
  source = "./terraform-modules/mongo-express"
  network_name = docker_network.publication_network.name
}

module "server" {
  source = "./terraform-modules/server"
  network_name = docker_network.publication_network.name
}

module "client" {
  source = "./terraform-modules/client"
  network_name = docker_network.publication_network.name
}

module "proxy" {
  source       = "./terraform-modules/proxy"
  network_name = docker_network.publication_network.name

  depends_on_server = module.server
  depends_on_client = module.client
}

resource "docker_network" "publication_network" {
  name = "publication_network"
}