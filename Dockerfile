FROM node:latest

ARG crypto_key=the_pwd_come_in_build_cmd_line
#ARG mlab_sendax_uri=mongodb://mongo:27017/sendaxdb
#ARG node_env=development

ENV CRYPTO_KEY $crypto_key
#ENV MLAB_SENDAX_URI=$mlab_sendax_uri
#ENV NODE_ENV=$node_env

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --quiet
COPY . /usr/src/app
EXPOSE 3000
CMD [ "node", "dist/server.js" ]