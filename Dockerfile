FROM node:18-alpine

# install global packages
RUN npm install -g serve

# install local packages
WORKDIR /app/
COPY package.json /app/
COPY package-lock.json /app/
RUN npm install --legacy-peer-deps; npm audit fix --legacy-peer-deps; true;

# copy repo and build
COPY . /app/
RUN npm run build

# provide webserver
ENTRYPOINT serve -s build
EXPOSE 3000
