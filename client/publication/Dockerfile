# Build stage
FROM node:22 AS build

WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# Run stage
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/publication/browser /usr/share/nginx/html
EXPOSE 80
