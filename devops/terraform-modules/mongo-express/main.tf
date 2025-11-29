terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

resource "docker_image" "mongo_express" {
  name = "mongo-express"
}

resource "docker_container" "mongo_express" {
  name  = "mongo-express"
  image = docker_image.mongo_express.name

  env = [
    "ME_CONFIG_MONGODB_ADMINUSERNAME=root",
    "ME_CONFIG_MONGODB_ADMINPASSWORD=example",
    "ME_CONFIG_MONGODB_URL=mongodb://root:example@mongo:27017/",
    "ME_CONFIG_BASICAUTH=false"
  ]

  ports {
    internal = 8081
    external = 8081
  }

  networks_advanced {
    name = var.network_name
  }
}
