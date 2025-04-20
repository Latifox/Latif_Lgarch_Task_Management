FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Run the app in development mode
EXPOSE 3000
CMD ["npm", "start"]

# Production environment
FROM nginx:stable-alpine

# Copy build files from build stage
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 