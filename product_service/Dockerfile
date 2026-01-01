# Use Node 20 slim (Debian-based) – no PEP 668 issues, reliable pip installs
FROM node:20-slim

# Install Python3, pip, and build essentials
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create a virtual environment to avoid system conflicts (best practice)
RUN python3 -m venv /opt/venv

# Use the venv for pip installs
ENV PATH="/opt/venv/bin:$PATH"

# Install AWS SAM CLI inside the virtual environment
RUN pip install --no-cache-dir aws-sam-cli==1.147.1

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json tsconfig.json ./

# Install Node dependencies
RUN npm ci

# Install esbuild for local Lambda bundling (avoids Docker bundling during synth)
RUN npm install --global esbuild@0.21.5

# Copy source code
COPY . .

# Build TypeScript and synthesize CDK template
RUN npm run build

# Synthesize CDK template (esbuild handles bundling locally)
RUN npx cdk synth

# Expose port 3000
EXPOSE 3000

# Hot reload for development
CMD ["npm", "run", "dev:container"]