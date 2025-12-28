FROM node:22

WORKDIR /the/workdir/path
COPY package*.json ./
RUN npm install
COPY ..

EXPOSE 8080
CMD [ "npm", "run", "dev" ]
