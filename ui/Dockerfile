FROM node:latest as dev

WORKDIR /app

COPY . .

RUN npm i

FROM node:latest as build

WORKDIR /app

COPY --from=dev /app /app

RUN npm run build

# CMD [ "npm start" ]

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY  --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]