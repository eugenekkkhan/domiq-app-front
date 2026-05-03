FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies without optional packages (avoids native rollup optional deps on different platforms)
# Use npm ci for reproducible installs. --no-optional prevents installing platform-specific native packages like @rollup/rollup-*-musl
RUN npm ci --no-optional --force --only=production=false

# Install serve globally
RUN npm i -f -g serve

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]