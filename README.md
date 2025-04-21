# publikacio

Publikáció bíráló rendszer a Programrendszerek fejlesztése 2025 tárgy keretében

# Futtatás

## Adatbázis

Az adatbázishoz kapcsolódó fájlok a `database` mappában találhatók. Futtatás ezen a mappán belül lehetséges:

`cd database`

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
