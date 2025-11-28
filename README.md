# publikacio

Publikáció bíráló rendszer a Programrendszerek fejlesztése 2025 tárgy keretében.

Kiegészítve a 2025/2026. tanév első félévében a Felhő és DevOps alapok tárgy keretében.

# Funkciók

## Az alkalmazás

Az alkalmazás a MEAN stackre épül és egy publikáció bíráló rendszert valósít meg. A felhasználók három szerepkör egyikébe tartoznak, amit a regisztráció során adnak meg:

- Író: cikkeket hozhat létre. Amint egy cikk elkészült, megjelölheti azt, így elérhetővé válik a szerkesztők számára.
- Szerkesztő: láthatja a bírálásra kész cikkeket és bírálókat rendelhet hozzá.
- Bíráló: láthatja a cikkeket amikhez egy szerkesztő hozzárendelte és értékelést írhat hozzá.

## Konténerizáció

A teljes alkalmazás (adatbázis, kliens, szerver, Jenkins, Prometheus, Grafana) egy konténerben indítható a következő paranccsal:

`docker compose up`

Adatbázis: http://localhost:8081/

Angular alkalmazás: http://localhost/

Jenkins: http://localhost:8080/

Prometheus: http://localhost:9090/

Grafana: http://localhost:3000/

## Jenkins

A projekt része egy dockerben futó Jenkins image. Indítás után a következő linken érhető el: http://localhost:8080/

Egy job-ot tartalmaz, ami a kliens és szerver kódot buildeli, linteli, valamint a szerver oldalon a teszteket is futtatja.

Első indításkor egy admin felhasználó regisztrációja szükséges. A telepíthető package-k közül nem kell egyiket sem külön telepíteni, mivel a docker image már tartalmazza a szükségeseket.

## Kubernetes

Az alkalmazást Kubernetes (minikube) használatával lehet deployolni. Ez egy szkript segítségével történik:

`./kubernetes-deploy.sh`

A szkript a következő lépéseket hajtja végre:

- minikube indítása
- configmap készítése az nginx.conf és az adatbázist inicializáló init.js fájlokhoz
- Skaffold futtatása
  - server és client image-k buildelése
  - deployolás
- Az alkalmazás automatikus megnyitása böngészőben, amint az készen áll

## Terraform

Az alkalmazás Terraform használatával a következő szkripptel indítható:

`./terraform-run.sh`

A szkript meg fog állni, hogy felhasználói inputot kérjen. Ekkor a `yes` választ kell megadni.

Leállítás:

`terrafrom destroy`

Itt is szükséges a `yes` válasz megadása.

> FONTOS: a docker-compose.yml és a Terraform ugyanazokat az image neveket használja, ami futtatáskor konfliktushoz vezet. A Terraform indítása előtt ezért szükséges a docker image-k kitörlése.

## Monitorozás

### Prometheus

A Prometheus a `docker compose up` parancs futtatása után a következő linken érhető el: http://localhost:9090/

### Grafana

A Grafana a `docker compose up` parancs futtatása után a következő linken érhető el: http://localhost:3000/

# Futtatás - local development

## Adatbázis

Az adatbázishoz kapcsolódó fájlok a gyökér mappában találhatók. Futtatás:

`docker compose up`

Az adatbázis a következő linken érhető el: http://localhost:8081/

## Szerver

A `server` mappa tartalmazza a szerveroldali kódot. Futtatás ezen a mappán belül lehetséges:

`cd server`

`npm install`

`npm run build`

`npm run start`

## Kliens

Az Angular projekt a `client/publication` mappában található. Futtatás ezen a mappán belül lehetséges:

`cd client/publication`

`npm install`

`ng serve`

Ezután az alkalmazás a következő linken érhető el: http://localhost:4200/

# Adatbázis

A docker indítása után a `publication` adatbázis tartalmaz néhány kezdeti adatot.

## Kollekciók

### roles

- id
- name: a felhasználószerep neve, ez lehet `Author`, `Editor` vagy `Reviewer`

### users

- id
- email
- password
- firstName
- lastName
- role: a szerep id-ja, amibe a felhasználó tartozik

Kezdtei felhasználók (jelszó: password):

- author1@mailinator.com
- author2@mailinator.com
- editor1@mailinator.com
- editor2@mailinator.com
- reviewer1@mailinator.com
- reviewer2@mailinator.com

### articles

- id
- author: a cikk szerzőjének id-ja
- title
- content
- readyForReview: boolean, a cikk szerkeszthető amíg hamis, a szerkesztők láthatják ha igaz
- reviewers: a cikk bírálóinak id-ja egy listában
- isAccepted

### reviews

- id
- text
- article: a cikk id-ja, amihez az értékelés tartozik
- isAccepted
- reviewer: a bíráló id-ja, aki az értékelést készítette
