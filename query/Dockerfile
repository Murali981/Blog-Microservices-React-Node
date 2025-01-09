FROM node:alpine 
# In the above command we are specifying the base image

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./
# In the above command we are saying that we are copying everything from our POSTS directory(This particularly means the index.js file)

CMD ["npm", "start"]