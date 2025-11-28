terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

resource "docker_image" "server" {
  name         = "server"
  build {
    context = "${path.cwd}/server"
  }
}

resource "docker_container" "server" {
  name  = "server"
  image = docker_image.server.name

  env = [
    "MONGO_URL=mongodb://publicationAdmin:example@mongo:27017/publication"
  ]

  ports {
    internal = 5000
    external = 5000
  }

  networks_advanced {
    name = var.network_name
  }
}
