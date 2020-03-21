FROM node:lts-alpine

WORKDIR /app

RUN apk update && \
    npm install -g npm

CMD ["/bin/sh"]