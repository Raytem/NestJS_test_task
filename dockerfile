FROM node:20
WORKDIR /usr/app
EXPOSE 80

COPY . .

RUN npm install
CMD npm run migration:run && npm start