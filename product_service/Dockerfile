# Use Node 20 Alpine as base
FROM node:20-alpine AS base

# Install Python + pip + build tools needed for AWS SAM CLI
RUN apk add --no-cache python3 py3-pip gcc musl-dev python3-dev linux-headers

# Install AWS SAM CLI (required for sam local start-api)
RUN pip3 install --no-cache-dir aws-sam-cli

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json tsconfig.json ./

# Install ALL dependencies (including devDependencies like typescript, ts-node, etc.)
RUN npm ci

# Copy source code
COPY src ./src
COPY bin ./bin
# If you have other folders like lib, test, etc., add them or just copy everything
COPY . .

# Build TypeScript once (tsc)
RUN npm run build

# Synthesize CDK template (creates cdk.out folder needed by sam local)
RUN npm run cdk synth

# Expose port 3000 — default for sam local start-api
EXPOSE 3000

# Start the local API exactly like your dev script
CMD ["sam", "local", "start-api", "--host", "0.0.0.0", "-t", "cdk.out/ProductServiceStack.template.json"]