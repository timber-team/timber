FROM node as build

# ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build

# CMD [ "npm start" ]

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY  --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
