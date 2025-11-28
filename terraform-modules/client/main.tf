terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

resource "docker_image" "client" {
  name = "client"
  build {
    context = "${path.cwd}/client/publication"
  }
}

resource "docker_container" "client" {
  name  = "client"
  image = docker_image.client.name

  ports {
    internal = 4200
    external = 4200
  }

  networks_advanced {
    name = var.network_name
  }
}
