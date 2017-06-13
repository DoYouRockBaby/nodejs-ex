FROM node:latest

MAINTAINER Léo Le Sommer

ENV NODE_ENV=development 
ENV PORT=3000

COPY . /var/www
WORKDIR /var/www

RUN npm install

EXPOSE $PORT

ENTRYPOINT ["npm", "start"]