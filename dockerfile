# BUILD
FROM node:16 as build
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build

# PRODUCTION
FROM node:16 as production
WORKDIR /app
COPY package*.json ./
RUN npm i --only=production
COPY --from=build /app/lib /app/lib
EXPOSE 5000
CMD npm run start
