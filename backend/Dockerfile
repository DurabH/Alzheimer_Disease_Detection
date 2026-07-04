FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose port (Hugging Face runs on 7860)
EXPOSE 7860
ENV PORT=7860
ENV NODE_ENV=production

# Start command
CMD ["npm", "start"]
