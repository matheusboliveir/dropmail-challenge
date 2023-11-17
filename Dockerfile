FROM node:20.9.0 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:1.21
COPY --from=node /app/dist/dropmail-challenge /usr/share/nginx/html

EXPOSE 80
