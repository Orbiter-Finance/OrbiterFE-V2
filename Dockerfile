FROM node:lts-alpine
COPY ./ /app
WORKDIR /app
RUN yarn && npm run build

FROM nginx:alpine
RUN mkdir /app
COPY --from=0 /app/dist /app
COPY docker.nginx.conf /etc/nginx/nginx.conf