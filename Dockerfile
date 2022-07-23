FROM node:lts-alpine
# WORKDIR /app
WORKDIR /usr/app
COPY package*.json .
RUN npm install
# COPY src/ .
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
