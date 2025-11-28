terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

resource "docker_image" "mongo" {
  name = "mongo"
}

resource "docker_container" "mongo" {
  name  = "mongo"
  image = docker_image.mongo.name

  env = [
    "MONGO_INITDB_ROOT_USERNAME=root",
    "MONGO_INITDB_ROOT_PASSWORD=example"
  ]

  ports {
    internal = 27017
    external = 27017
  }

  volumes {
  host_path      = "${path.cwd}/setup/mongo-init-scripts"
  container_path = "/docker-entrypoint-initdb.d"
  }

  networks_advanced {
    name = var.network_name
  }
}
