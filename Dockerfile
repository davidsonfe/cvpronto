FROM node:18
WORKDIR /davidsonfelix
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start", "--port", "3000", "--host", "0.0.0.0"]