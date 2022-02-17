FROM node:17-alpine
WORKDIR /app
COPY package*.json ./
COPY . . 
RUN yarn install --frozen-lockfile
RUN yarn build
CMD [ "yarn", "start" ]
EXPOSE 3001