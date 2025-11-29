terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

resource "docker_image" "proxy" {
  name = "nginx:stable-alpine"
}

resource "docker_container" "proxy" {
  name  = "proxy"
  image = docker_image.proxy.name

  depends_on = [
    var.depends_on_server,
    var.depends_on_client
  ]

  env = [
    "NGINX_ENVSUBST_TEMPLATE_SUFFIX=.conf",
    "NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx"
  ]

  volumes {
    host_path      = "${path.cwd}/nginx.conf"
    container_path = "/etc/nginx/nginx.conf"
  }

  ports {
    internal = 80
    external = 80
  }

  networks_advanced {
    name = var.network_name
  }
}
