FROM node:lts-alpine
WORKDIR /app
COPY package.json yarn-lock.json ./
RUN yarn
COPY ./ /app
RUN curl -o /app/src/config/chain.json http://ec2-54-238-20-18.ap-northeast-1.compute.amazonaws.com:9095/public/chain.json
RUN npm run build
FROM nginx:alpine
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY docker.nginx.conf /etc/nginx/nginx.conf