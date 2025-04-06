# publikacio
Publikáció bíráló rendszer a Programrendszerek fejlesztése 2025 tárgy keretében

# Futtatás

## MongoDB

`docker compose up -d`

Az adatbázis az alábbi linken érhető el: http://localhost:8081/

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