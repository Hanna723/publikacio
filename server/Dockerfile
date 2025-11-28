# Build stage
FROM node:22 AS build

WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# Run stage
FROM node:22

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY --from=build /usr/src/app/build /app

EXPOSE 5000
CMD ["node", "src/index.js"]
