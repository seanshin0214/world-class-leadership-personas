# DevOps & Infrastructure Automation 2025

**Updated**: 2025-11-24 | **Focus**: CI/CD, Docker, Kubernetes, IaC, Monitoring

---

## CI/CD Pipelines

```yaml
# GITHUB ACTIONS (CI/CD workflow)

name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    needs: test # Only run if tests pass
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: |
            myapp:latest
            myapp:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' # Only deploy from main
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.PROD_SERVER }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            docker pull myapp:${{ github.sha }}
            docker stop myapp || true
            docker rm myapp || true
            docker run -d --name myapp -p 80:3000 myapp:${{ github.sha }}

---

# JENKINS (Alternative CI/CD)

pipeline {
  agent any
  
  environment {
    DOCKER_IMAGE = "myapp"
    DOCKER_TAG = "${env.BUILD_NUMBER}"
  }
  
  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    
    stage('Test') {
      steps {
        sh 'npm ci'
        sh 'npm run lint'
        sh 'npm test'
      }
    }
    
    stage('Build') {
      steps {
        sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
      }
    }
    
    stage('Push') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'docker-hub',
          usernameVariable: 'DOCKER_USER',
          passwordVariable: 'DOCKER_PASS'
        )]) {
          sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"
          sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
        }
      }
    }
    
    stage('Deploy') {
      when {
        branch 'main'
      }
      steps {
        sh """
          kubectl set image deployment/myapp \
            myapp=${DOCKER_IMAGE}:${DOCKER_TAG}
        """
      }
    }
  }
  
  post {
    failure {
      mail to: 'team@example.com',
           subject: "Pipeline Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
           body: "Check ${env.BUILD_URL}"
    }
  }
}

---

# CI/CD BEST PRACTICES:

1. FAST FEEDBACK:
   - Total pipeline <10 min (developers wait)
   - Parallelize tests (split into chunks)
   - Cache dependencies (npm ci vs npm install)

2. FAIL FAST:
   - Run fast tests first (linting, unit tests)
   - Slow tests later (integration, e2e)
   - Stop on first failure (don't waste time)

3. ARTIFACT VERSIONING:
   - Tag images with commit SHA or build number
   - Immutable (never overwrite "latest" in prod)

4. ENVIRONMENT PARITY:
   - Dev, staging, prod same (avoid "works on my machine")
   - Use same Docker images across envs

5. ROLLBACK STRATEGY:
   - Blue-green deployment (instant rollback)
   - Canary (gradual rollout, detect issues early)
```

---

## Docker

```dockerfile
# DOCKERFILE (Multi-stage build, optimized)

# STAGE 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files first (layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build (if TypeScript, Next.js, etc.)
RUN npm run build

---

# STAGE 2: Production
FROM node:18-alpine

# Security: Non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]

---

# WHY MULTI-STAGE?

# ❌ Single-stage (bloated):
FROM node:18
WORKDIR /app
COPY . .
RUN npm install  # Includes dev dependencies (build tools, etc.)
CMD ["node", "index.js"]
# Result: 1.2 GB image

# ✅ Multi-stage (optimized):
# Only production dependencies, no build tools
# Result: 150 MB image (8× smaller!)

---

# DOCKER COMPOSE (Local development, multiple services)

version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    volumes:
      - .:/app  # Hot reload (code changes reflect immediately)
      - /app/node_modules  # Don't overwrite node_modules
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:

---

# COMMANDS:

# Build and start all services
docker-compose up --build

# Start in background (detached)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop and remove containers
docker-compose down

# Stop and remove volumes (data)
docker-compose down -v

---

# DOCKER BEST PRACTICES:

1. LAYER CACHING:
   # ❌ Invalidates cache on any code change
   COPY . .
   RUN npm install
   
   # ✅ Cache dependencies (change infrequently)
   COPY package*.json ./
   RUN npm ci
   COPY . .

2. ALPINE IMAGES:
   # node:18 = 1 GB
   # node:18-alpine = 170 MB (minimal, faster pulls)

3. .dockerignore (Exclude files from image):
   node_modules
   .git
   .env
   *.md
   .dockerignore

4. SECURITY:
   - Run as non-root user (RUN adduser)
   - Scan for vulnerabilities (docker scan, Snyk)
   - Pin versions (node:18.17.0, not node:latest)
```

---

## Kubernetes

```yaml
# DEPLOYMENT (App replicas, rolling updates)

apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 3  # 3 copies (high availability)
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        resources:
          requests:
            cpu: "100m"      # 0.1 CPU (min)
            memory: "128Mi"  # 128 MB (min)
          limits:
            cpu: "500m"      # 0.5 CPU (max)
            memory: "512Mi"  # 512 MB (max)
        livenessProbe:   # Restart if unhealthy
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:  # Don't send traffic if not ready
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---

# SERVICE (Load balancer, routes traffic to pods)

apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  selector:
    app: myapp  # Routes to pods with this label
  ports:
  - protocol: TCP
    port: 80        # External port
    targetPort: 3000  # Container port
  type: LoadBalancer  # Exposes externally (cloud provider creates load balancer)

---

# INGRESS (HTTP routing, SSL/TLS)

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - myapp.com
    secretName: myapp-tls
  rules:
  - host: myapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80

---

# CONFIGMAP (Configuration, non-sensitive)

apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_NAME: "MyApp"
  LOG_LEVEL: "info"
  config.json: |
    {
      "feature_flag": true
    }

---

# SECRET (Sensitive data, base64 encoded)

apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  url: cG9zdGdyZXM6Ly91c2VyOnBhc3NAZGIuZXhhbXBsZS5jb20vbXlkYg==
  # base64 of: postgres://user:pass@db.example.com/mydb

# Create from command line (auto-encodes):
kubectl create secret generic db-secret \
  --from-literal=url='postgres://user:pass@db.example.com/mydb'

---

# COMMANDS:

# Apply all YAML files
kubectl apply -f k8s/

# Get resources
kubectl get pods
kubectl get services
kubectl get deployments

# Describe (detailed info)
kubectl describe pod myapp-xyz123

# Logs
kubectl logs myapp-xyz123
kubectl logs -f myapp-xyz123  # Follow (tail)

# Execute command in pod
kubectl exec -it myapp-xyz123 -- /bin/sh

# Scale replicas
kubectl scale deployment myapp --replicas=5

# Rolling update (new image)
kubectl set image deployment/myapp myapp=myapp:2.0.0

# Rollback
kubectl rollout undo deployment/myapp

# Port forward (local testing)
kubectl port-forward svc/myapp-service 8080:80
# Access at localhost:8080
```

---

## Infrastructure as Code (IaC)

```hcl
# TERRAFORM (Provision cloud resources)

# AWS Example: VPC, EC2, RDS

provider "aws" {
  region = "us-east-1"
}

# VPC (Virtual Private Cloud)
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "main-vpc"
  }
}

# Subnet (Public)
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  
  tags = {
    Name = "public-subnet"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}

# Security Group (Firewall rules)
resource "aws_security_group" "web" {
  name        = "web-sg"
  description = "Allow HTTP/HTTPS traffic"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Allow from anywhere
  }
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"  # All protocols
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 Instance
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"  # Amazon Linux 2
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.public.id
  
  vpc_security_group_ids = [aws_security_group.web.id]
  
  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              yum install -y docker
              systemctl start docker
              docker run -d -p 80:3000 myapp:latest
              EOF
  
  tags = {
    Name = "web-server"
  }
}

# RDS Database
resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  engine              = "postgres"
  engine_version      = "15.3"
  instance_class      = "db.t3.micro"
  db_name             = "mydb"
  username            = "admin"
  password            = var.db_password  # From variable (don't hardcode!)
  skip_final_snapshot = true
  
  vpc_security_group_ids = [aws_security_group.db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
}

# Variables
variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# Outputs
output "instance_ip" {
  value = aws_instance.web.public_ip
}

output "db_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

---

# COMMANDS:

# Initialize (download providers)
terraform init

# Plan (preview changes, dry-run)
terraform plan

# Apply (create resources)
terraform apply

# Destroy (delete all resources)
terraform destroy

# State (view current infrastructure)
terraform state list
terraform state show aws_instance.web

---

# BEST PRACTICES:

1. REMOTE STATE:
   # Store state in S3 (not local, team collaboration)
   terraform {
     backend "s3" {
       bucket = "my-terraform-state"
       key    = "prod/terraform.tfstate"
       region = "us-east-1"
     }
   }

2. MODULES (Reusable):
   # modules/vpc/main.tf (define once, reuse)
   module "vpc" {
     source = "./modules/vpc"
     cidr_block = "10.0.0.0/16"
   }

3. WORKSPACES (Separate envs):
   terraform workspace new dev
   terraform workspace new prod
   terraform workspace select prod
```

---

## Monitoring & Logging

```yaml
# PROMETHEUS (Metrics collection)

# prometheus.yml (Scrape config)
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'myapp'
    static_configs:
      - targets: ['localhost:3000']

---

# GRAFANA (Dashboards)

# Add Prometheus as data source:
1. Configuration → Data Sources → Add → Prometheus
2. URL: http://prometheus:9090

# Create dashboard:
- Panel 1: CPU usage (PromQL query)
  rate(process_cpu_seconds_total[1m])

- Panel 2: Memory usage
  process_resident_memory_bytes

- Panel 3: HTTP requests per second
  rate(http_requests_total[1m])

- Panel 4: Error rate
  rate(http_requests_total{status=~"5.."}[1m])

---

# ALERTS (Alertmanager)

# alertmanager.yml
groups:
  - name: example
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} requests/sec"

---

# ELK STACK (Logging: Elasticsearch, Logstash, Kibana)

# docker-compose.yml
services:
  elasticsearch:
    image: elasticsearch:8.9.0
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  logstash:
    image: logstash:8.9.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

  kibana:
    image: kibana:8.9.0
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

# App logs → Logstash → Elasticsearch → Kibana (visualize)

---

# DISTRIBUTED TRACING (Jaeger, OpenTelemetry)

# Track request across microservices

import { trace } from '@opentelemetry/api';

const tracer = trace.getTracer('myapp');

app.get('/api/users', async (req, res) => {
  const span = tracer.startSpan('get-users');
  
  try {
    const users = await db.users.findAll();
    res.json(users);
  } finally {
    span.end();
  }
});

# View trace in Jaeger UI (shows latency of each service call)
```

---

## Key Takeaways

1. **Automate everything** - Manual deployments = errors (CI/CD pipelines, IaC)
2. **Immutable infrastructure** - Replace, don't modify (Docker images, not SSH and change files)
3. **Observability** - Can't fix what you can't see (metrics, logs, traces)
4. **High availability** - Multiple replicas, health checks, rollback strategy
5. **Security** - Scan images, secrets management (not hardcoded), least privilege

---

## References

- "The DevOps Handbook" - Gene Kim
- "Kubernetes Up & Running" - Kelsey Hightower
- Docker Documentation, Kubernetes Documentation

**Related**: `kubernetes-patterns.md`, `terraform-modules.md`, `monitoring-best-practices.md`
