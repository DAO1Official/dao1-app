FROM node:14.16.0-buster as build-app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json yarn.lock .env.development .env.production ./
RUN yarn
COPY src ./src
COPY public ./public
RUN yarn build

FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-app /app/build /usr/share/nginx/html
EXPOSE 80
