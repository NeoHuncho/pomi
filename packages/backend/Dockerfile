FROM node:22-alpine

WORKDIR /app

# Copy workspace files
COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .

# Copy packages
COPY packages/shared /app/packages/shared
COPY packages/backend /app/packages/backend

# Install dependencies at workspace level
RUN npm install

# Install NestJS CLI
RUN npm install -g @nestjs/cli

# Build shared package first
WORKDIR /app/packages/shared
RUN npm install
RUN npm run build

# Build and run backend
WORKDIR /app/packages/backend
RUN npm install
RUN npm run build

CMD ["node", "dist/src/main.js"]

EXPOSE 3001