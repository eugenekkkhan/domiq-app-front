FROM node:22-alpine

WORKDIR /domiq-app-front

COPY package.json .

RUN npm install --force

COPY . .

RUN npm run build

CMD [ "npm", "run", "preview", "--", "--host", "0.0.0.0"]