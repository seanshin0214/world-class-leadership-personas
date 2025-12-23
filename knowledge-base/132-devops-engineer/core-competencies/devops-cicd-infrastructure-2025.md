# DevOps, CI/CD & Infrastructure 2025

**Updated**: 2025-11-24 | **Focus**: CI/CD Pipelines, Docker, Kubernetes, Infrastructure as Code, Monitoring

---

## CI/CD Fundamentals

```yaml
# CONTINUOUS INTEGRATION/CONTINUOUS DEPLOYMENT

CI (Continuous Integration):
- Developers commit code frequently (multiple times per day)
- Automated build & test on each commit
- Fast feedback (catch bugs early, before merge to main)
- Tools: Jenkins, GitLab CI, GitHub Actions, CircleCI, Travis CI

CD (Continuous Deployment/Delivery):
- Delivery: Automated to staging (manual approval to production)
- Deployment: Fully automated to production (no manual step)
- Deploy small changes frequently (less risk than big releases)

---

# GITHUB ACTIONS CI/CD PIPELINE

.github/workflows/ci-cd.yml:
```

```yaml
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
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Run coverage
      run: npm run coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        token: ${{ secrets.CODECOV_TOKEN }}
  
  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
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
        tags: myuser/myapp:${{ github.sha }},myuser/myapp:latest
        cache-from: type=registry,ref=myuser/myapp:latest
        cache-to: type=inline
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Deploy to ECS
      run: |
        aws ecs update-service \
          --cluster my-cluster \
          --service my-service \
          --force-new-deployment
```

```bash
# GITLAB CI/CD PIPELINE

# .gitlab-ci.yml

stages:
  - test
  - build
  - deploy

variables:
  DOCKER_IMAGE: registry.gitlab.com/$CI_PROJECT_PATH:$CI_COMMIT_SHA

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm run lint
    - npm test
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $DOCKER_IMAGE .
    - docker push $DOCKER_IMAGE
  only:
    - main
    - develop

deploy_staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - |
      curl -X POST https://api.render.com/deploy/srv-xxxxx?key=$RENDER_API_KEY
  environment:
    name: staging
    url: https://staging.myapp.com
  only:
    - develop

deploy_production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - |
      curl -X POST https://api.render.com/deploy/srv-yyyyy?key=$RENDER_API_KEY
  environment:
    name: production
    url: https://myapp.com
  when: manual  # Manual approval for production
  only:
    - main
```

---

## Docker

```dockerfile
# DOCKERFILE (Multi-stage build, optimized)

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (leverage Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application (if needed, e.g., TypeScript compilation)
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Create non-root user (security)
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy only necessary files from builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/index.js"]
```

```bash
# DOCKER COMMANDS

# Build image
docker build -t myapp:latest .

# Tag image
docker tag myapp:latest myuser/myapp:v1.0.0

# Push to Docker Hub
docker push myuser/myapp:v1.0.0

# Run container
docker run -d \
  --name myapp \
  -p 3000:3000 \
  -e DATABASE_URL=postgres://user:pass@db:5432/mydb \
  --restart unless-stopped \
  myapp:latest

# View logs
docker logs myapp
docker logs -f myapp  # Follow logs

# Execute command in running container
docker exec -it myapp sh

# Stop and remove container
docker stop myapp
docker rm myapp

# Remove image
docker rmi myapp:latest

# Prune unused resources (clean up)
docker system prune -a --volumes

---

# DOCKER COMPOSE (Multi-container applications)

# docker-compose.yml

version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:password@db:5432/mydb
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - app-network
  
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - app-network
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped
    networks:
      - app-network
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres-data:
  redis-data:

networks:
  app-network:
    driver: bridge

# Commands:
# docker-compose up -d        # Start all services (detached)
# docker-compose down         # Stop and remove all services
# docker-compose logs -f app  # View logs for specific service
# docker-compose ps           # List running services
# docker-compose exec app sh  # Execute command in service
```

---

## Kubernetes

```yaml
# KUBERNETES DEPLOYMENT

# deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: production
  labels:
    app: myapp
spec:
  replicas: 3
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
        image: myuser/myapp:v1.0.0
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: myapp-secrets
              key: database-url
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
      imagePullSecrets:
      - name: dockerhub-secret

---
# SERVICE (Expose deployment)

apiVersion: v1
kind: Service
metadata:
  name: myapp-service
  namespace: production
spec:
  selector:
    app: myapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP

---
# INGRESS (External access, HTTPS)

apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  namespace: production
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
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
# CONFIGMAP (Non-sensitive configuration)

apiVersion: v1
kind: ConfigMap
metadata:
  name: myapp-config
  namespace: production
data:
  LOG_LEVEL: "info"
  MAX_CONNECTIONS: "100"

---
# SECRET (Sensitive data, base64 encoded)

apiVersion: v1
kind: Secret
metadata:
  name: myapp-secrets
  namespace: production
type: Opaque
data:
  database-url: cG9zdGdyZXM6Ly91c2VyOnBhc3NAaG9zdDo1NDMyL2RiCg==  # Base64

---
# HORIZONTAL POD AUTOSCALER (Auto-scale based on CPU)

apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: myapp-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: myapp
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

```bash
# KUBECTL COMMANDS

# Apply manifests
kubectl apply -f deployment.yaml
kubectl apply -f .  # Apply all files in directory

# Get resources
kubectl get pods -n production
kubectl get services -n production
kubectl get deployments -n production
kubectl get ingress -n production

# Describe resource (detailed info)
kubectl describe pod myapp-xxxxx -n production

# View logs
kubectl logs myapp-xxxxx -n production
kubectl logs -f myapp-xxxxx -n production  # Follow logs
kubectl logs myapp-xxxxx -n production --previous  # Previous container logs (if crashed)

# Execute command in pod
kubectl exec -it myapp-xxxxx -n production -- sh

# Port forward (access pod locally)
kubectl port-forward pod/myapp-xxxxx 3000:3000 -n production

# Scale deployment
kubectl scale deployment myapp --replicas=5 -n production

# Rolling update (new image)
kubectl set image deployment/myapp myapp=myuser/myapp:v1.1.0 -n production

# Rollback deployment
kubectl rollout undo deployment/myapp -n production
kubectl rollout status deployment/myapp -n production

# Delete resources
kubectl delete pod myapp-xxxxx -n production
kubectl delete deployment myapp -n production
kubectl delete -f deployment.yaml

# Create secret from literal
kubectl create secret generic myapp-secrets \
  --from-literal=database-url=postgres://user:pass@host:5432/db \
  -n production

# Base64 encode/decode (for secrets)
echo -n 'my-secret-value' | base64
echo 'bXktc2VjcmV0LXZhbHVl' | base64 --decode
```

---

## Infrastructure as Code

```hcl
# TERRAFORM (AWS ECS + RDS + Load Balancer)

# main.tf

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "main-vpc"
  }
}

# Subnets
resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "public-subnet-1"
  }
}

resource "aws_subnet" "public_2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true
  
  tags = {
    Name = "public-subnet-2"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  
  tags = {
    Name = "main-igw"
  }
}

# Route table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id
  
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }
  
  tags = {
    Name = "public-route-table"
  }
}

# Security Group (Load Balancer)
resource "aws_security_group" "alb" {
  name        = "alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "main-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [aws_subnet.public_1.id, aws_subnet.public_2.id]
  
  tags = {
    Name = "main-alb"
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "main-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "myapp"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  
  container_definitions = jsonencode([
    {
      name      = "myapp"
      image     = "myuser/myapp:latest"
      essential = true
      
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        }
      ]
      
      secrets = [
        {
          name      = "DATABASE_URL"
          valueFrom = aws_secretsmanager_secret.db_url.arn
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/myapp"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# ECS Service
resource "aws_ecs_service" "app" {
  name            = "myapp-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 2
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = [aws_subnet.public_1.id, aws_subnet.public_2.id]
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "myapp"
    container_port   = 3000
  }
}

# RDS Database
resource "aws_db_instance" "main" {
  identifier             = "myapp-db"
  engine                 = "postgres"
  engine_version         = "15.3"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_type           = "gp3"
  db_name                = "mydb"
  username               = "postgres"
  password               = var.db_password
  skip_final_snapshot    = true
  publicly_accessible    = false
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"
  
  tags = {
    Name = "myapp-db"
  }
}

# Variables
variable "aws_region" {
  default = "us-east-1"
}

variable "db_password" {
  type      = string
  sensitive = true
}

# Outputs
output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "rds_endpoint" {
  value = aws_db_instance.main.endpoint
}
```

```bash
# TERRAFORM COMMANDS

# Initialize (download providers)
terraform init

# Format code
terraform fmt

# Validate configuration
terraform validate

# Plan (preview changes)
terraform plan

# Apply (create resources)
terraform apply
terraform apply -auto-approve  # Skip confirmation

# Destroy (delete resources)
terraform destroy

# Show state
terraform show

# List resources
terraform state list

# Import existing resource
terraform import aws_instance.example i-1234567890abcdef0

# Output values
terraform output
terraform output alb_dns_name
```

---

## Monitoring & Logging

```yaml
# PROMETHEUS + GRAFANA (Kubernetes)

# prometheus-values.yaml (Helm chart)

server:
  persistentVolume:
    enabled: true
    size: 50Gi
  
  retention: "30d"
  
  global:
    scrape_interval: 15s
    evaluation_interval: 15s

alertmanager:
  enabled: true
  
  config:
    global:
      smtp_smarthost: 'smtp.gmail.com:587'
      smtp_from: 'alerts@myapp.com'
      smtp_auth_username: 'alerts@myapp.com'
      smtp_auth_password: 'password'
    
    route:
      receiver: 'email'
      group_by: ['alertname', 'cluster']
      group_wait: 10s
      group_interval: 10s
      repeat_interval: 12h
    
    receivers:
    - name: 'email'
      email_configs:
      - to: 'team@myapp.com'
        send_resolved: true

grafana:
  enabled: true
  adminPassword: 'admin'
  
  datasources:
    datasources.yaml:
      apiVersion: 1
      datasources:
      - name: Prometheus
        type: prometheus
        url: http://prometheus-server
        access: proxy
        isDefault: true

# Install Prometheus + Grafana
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack -f prometheus-values.yaml
```

```python
# APPLICATION METRICS (Python, Prometheus client)

from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time

# Define metrics
request_count = Counter('app_requests_total', 'Total requests', ['method', 'endpoint', 'status'])
request_duration = Histogram('app_request_duration_seconds', 'Request duration', ['method', 'endpoint'])
active_users = Gauge('app_active_users', 'Active users')

# Flask example
from flask import Flask, request
app = Flask(__name__)

@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    duration = time.time() - request.start_time
    request_duration.labels(method=request.method, endpoint=request.endpoint).observe(duration)
    request_count.labels(method=request.method, endpoint=request.endpoint, status=response.status_code).inc()
    return response

@app.route('/metrics')
def metrics():
    from prometheus_client import generate_latest
    return generate_latest()

@app.route('/')
def index():
    active_users.set(get_active_user_count())
    return "Hello World!"

if __name__ == '__main__':
    start_http_server(8000)  # Metrics endpoint on :8000/metrics
    app.run(host='0.0.0.0', port=5000)
```

---

## Key Takeaways

1. **Automate everything** - CI/CD pipelines (no manual deployments, reduce human error)
2. **Immutable infrastructure** - Containers, IaC (don't modify running servers, replace)
3. **Monitor proactively** - Metrics, logs, alerts (know issues before users report)
4. **Security in pipelines** - Secrets management, vulnerability scanning, least privilege IAM
5. **Small, frequent deployments** - Less risk (easy to rollback, isolate issues)

---

## References

- "The DevOps Handbook" - Gene Kim
- "Kubernetes in Action" - Marko Lukša
- "Terraform: Up & Running" - Yevgeniy Brikman

**Related**: `kubernetes-production-best-practices.md`, `terraform-aws-infrastructure.md`, `ci-cd-pipeline-optimization.md`
