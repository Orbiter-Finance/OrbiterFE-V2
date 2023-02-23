FROM node:lts-alpine
WORKDIR /app
COPY package.json yarn-lock.json ./
RUN yarn
COPY ./ /app
RUN curl -o /app/src/config/chain.json http://openapi.orbiter.finance/mainnet/public/chain.json
RUN curl -o /app/src/config/maker.json http://openapi.orbiter.finance/mainnet/public/maker.json
RUN npm run build
FROM nginx:alpine
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY docker.nginx.conf /etc/nginx/nginx.conf