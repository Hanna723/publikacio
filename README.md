# publikacio
Publikáció bíráló rendszer a Programrendszerek fejlesztése 2025 tárgy keretében

# Futtatás

## Adatbázis

Az adatbázishoz kapcsolódó fájlok a `database` mappában találhatók. Futtatás ezen a mappán belül lehetséges:

`cd database`

`docker compose up -d`

Az adatbázis a következő linken érhető el: http://localhost:8081/

## Szerver

A `server` mappa tartalmazza a szerveroldali kódot. Futtatás ezen a mappán belül lehetséges:

`cd server`

`npm install`

`npm run build`

`npm run start`

## Kliens

Az Angular projekt a `client/publication` mappában található. Futtatás ezen a mappán belül lehetséges:

`cd client/publication/`

`npm install`

`ng serve`

Ezután az alkalmazás a következő linken érhető el: http://localhost:4200/

# Adatbázis

A docker indítása után a `publication` adatbázis tartalmaz néhány kezdeti adatot.

## Kollekciók

### role

- id
- name: a felhasználószerep neve, ez lehet `Author`, `Editor` vagy `Reviewer`

### user

- id
- email
- password
- firstName
- lastName
- role: a szerep id-ja, amibe a felhasználó tartozik

Kezdtei felhasználók (jelszó nélkül):
- author@mailinator.com
- editor@mailinator.com
- reviewer@mailinator.com

### article

- id
- author: a cikk szerzőjének id-ja
- title
- content
- reviewers: a cikk bírálóinak id-ja egy listában
- isAccepted

### review

- id
- text
- article: a cikk id-ja, amihez az értékelés tartozik
- reviewer: a bíráló id-ja, aki az értékelést készítette