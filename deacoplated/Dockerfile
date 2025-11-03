# Single Docker image with all handlers + common code
FROM public.ecr.aws/lambda/nodejs:20

# Use /var/task as lambda expects
WORKDIR /var/task
ENV NODE_ENV=production

# Install dependencies (ensure package-lock.json exists for npm ci)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy full source (handlers + common implementation)
COPY src/ ./src/

# The runtime will invoke the exported handler from src/index.handler
CMD ["src/index.handler"]