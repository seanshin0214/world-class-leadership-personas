# Cloud Architecture & Infrastructure 2025

**Updated**: 2025-11-24 | **Focus**: AWS, Azure, GCP, Multi-Cloud, Cost Optimization, Security

---

## Cloud Fundamentals

```markdown
CLOUD SERVICE MODELS:

IaaS (Infrastructure as a Service):
- Provider: Virtual machines, storage, networking
- You manage: OS, middleware, runtime, applications, data
- Examples: AWS EC2, Azure VMs, Google Compute Engine
- Use case: Full control, custom configurations, lift-and-shift migrations

PaaS (Platform as a Service):
- Provider: Infrastructure + OS + middleware + runtime
- You manage: Applications, data
- Examples: AWS Elastic Beanstalk, Azure App Service, Google App Engine, Heroku
- Use case: Focus on code, not infrastructure (faster development)

SaaS (Software as a Service):
- Provider: Everything (infrastructure, platform, application)
- You manage: Data, users
- Examples: Gmail, Salesforce, Office 365, Slack
- Use case: Ready-to-use applications (no installation, maintenance)

---

DEPLOYMENT MODELS:

PUBLIC CLOUD:
- Shared infrastructure (multiple customers, multi-tenant)
- Pros: Low cost, scalable, no maintenance
- Cons: Less control, security concerns (shared environment)
- Providers: AWS, Azure, GCP

PRIVATE CLOUD:
- Dedicated infrastructure (single organization)
- Pros: More control, security, compliance
- Cons: Expensive, requires management
- Use case: Government, healthcare, finance (strict regulations)

HYBRID CLOUD:
- Combination (public + private)
- Use case: Sensitive data in private, less critical in public
- Example: On-premises database, web app in AWS

MULTI-CLOUD:
- Multiple public cloud providers (AWS + Azure + GCP)
- Pros: Avoid vendor lock-in, best-of-breed services, redundancy
- Cons: Complexity, cost management, integration challenges

---

CLOUD BENEFITS:

ELASTICITY/SCALABILITY:
- Scale up/down based on demand (auto-scaling)
- Pay for what you use (not over-provisioning)

HIGH AVAILABILITY:
- Multiple availability zones, regions (redundancy)
- SLA (Service Level Agreement): 99.9%, 99.99%, 99.999% uptime

COST SAVINGS:
- No upfront capital (CapEx → OpEx)
- Pay-as-you-go (hourly, per request)

GLOBAL REACH:
- Deploy worldwide (low latency, local presence)

DISASTER RECOVERY:
- Backups, snapshots, replication across regions
```

---

## AWS Architecture

```bash
# COMPUTE

# EC2 (Elastic Compute Cloud, virtual machines)

# Launch instance
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.micro \
  --key-name my-key-pair \
  --security-group-ids sg-0123456789abcdef0 \
  --subnet-id subnet-0bb1c79de3EXAMPLE

# Instance types:
# t3.micro: 2 vCPU, 1 GB RAM (burstable, low cost, dev/test)
# m5.large: 2 vCPU, 8 GB RAM (balanced, general purpose)
# c5.xlarge: 4 vCPU, 8 GB RAM (compute-optimized, CPU-intensive)
# r5.large: 2 vCPU, 16 GB RAM (memory-optimized, databases, caching)
# p3.2xlarge: 8 vCPU, 61 GB RAM, 1 GPU (ML, AI training)

# Auto Scaling Group (scale EC2 based on demand)
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name my-asg \
  --launch-template LaunchTemplateId=lt-0123456789abcdef,Version=1 \
  --min-size 2 \
  --max-size 10 \
  --desired-capacity 2 \
  --vpc-zone-identifier "subnet-123,subnet-456"

# Scaling policy (CPU > 70% → add instance)
aws autoscaling put-scaling-policy \
  --auto-scaling-group-name my-asg \
  --policy-name scale-up \
  --policy-type TargetTrackingScaling \
  --target-tracking-configuration \
    '{"PredefinedMetricSpecification":{"PredefinedMetricType":"ASGAverageCPUUtilization"},"TargetValue":70.0}'

---

# STORAGE

# S3 (Simple Storage Service, object storage)

# Create bucket
aws s3 mb s3://my-unique-bucket-name

# Upload file
aws s3 cp myfile.txt s3://my-unique-bucket-name/

# Sync folder (upload all files)
aws s3 sync ./local-folder s3://my-unique-bucket-name/

# Storage classes:
# S3 Standard: Frequent access, $0.023/GB/month
# S3 IA (Infrequent Access): Less frequent, $0.0125/GB/month (cheaper, retrieval fee)
# S3 Glacier: Archive, $0.004/GB/month (retrieval: minutes to hours)
# S3 Glacier Deep Archive: Long-term, $0.00099/GB/month (retrieval: 12+ hours)

# Lifecycle policy (move old files to cheaper storage)
{
  "Rules": [
    {
      "Id": "MoveToIA",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 365
      }
    }
  ]
}

---

# NETWORKING

# VPC (Virtual Private Cloud, isolated network)

# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnets (public, private)
aws ec2 create-subnet --vpc-id vpc-123 --cidr-block 10.0.1.0/24 --availability-zone us-east-1a  # Public
aws ec2 create-subnet --vpc-id vpc-123 --cidr-block 10.0.2.0/24 --availability-zone us-east-1b  # Private

# Internet Gateway (allow internet access)
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-123 --internet-gateway-id igw-456

# Route table (route public subnet to internet)
aws ec2 create-route --route-table-id rtb-789 --destination-cidr-block 0.0.0.0/0 --gateway-id igw-456

# Security Group (firewall, allow HTTP, SSH)
aws ec2 create-security-group --group-name my-sg --description "Allow HTTP SSH" --vpc-id vpc-123
aws ec2 authorize-security-group-ingress --group-id sg-123 --protocol tcp --port 22 --cidr 0.0.0.0/0  # SSH
aws ec2 authorize-security-group-ingress --group-id sg-123 --protocol tcp --port 80 --cidr 0.0.0.0/0  # HTTP

# Load Balancer (distribute traffic across instances)
aws elbv2 create-load-balancer \
  --name my-alb \
  --subnets subnet-123 subnet-456 \
  --security-groups sg-789 \
  --type application

# Target Group (instances behind load balancer)
aws elbv2 create-target-group \
  --name my-targets \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-123 \
  --health-check-path /health

---

# DATABASES

# RDS (Relational Database Service, managed MySQL, PostgreSQL, etc.)

# Create database
aws rds create-db-instance \
  --db-instance-identifier mydb \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --allocated-storage 20 \
  --master-username admin \
  --master-user-password MySecurePassword123

# Multi-AZ (automatic failover, high availability)
aws rds modify-db-instance --db-instance-identifier mydb --multi-az

# Read Replica (scale reads, separate instance)
aws rds create-db-instance-read-replica \
  --db-instance-identifier mydb-replica \
  --source-db-instance-identifier mydb

# DynamoDB (NoSQL, key-value store)

# Create table
aws dynamodb create-table \
  --table-name Users \
  --attribute-definitions AttributeName=UserId,AttributeType=S \
  --key-schema AttributeName=UserId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Put item
aws dynamodb put-item \
  --table-name Users \
  --item '{"UserId": {"S": "user123"}, "Name": {"S": "John Doe"}}'

# Query
aws dynamodb query \
  --table-name Users \
  --key-condition-expression "UserId = :id" \
  --expression-attribute-values '{":id": {"S": "user123"}}'

---

# SERVERLESS

# Lambda (run code without servers, pay per execution)

# Create function
aws lambda create-function \
  --function-name my-function \
  --runtime python3.9 \
  --role arn:aws:iam::123456789012:role/lambda-execution-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://function.zip

# Invoke function
aws lambda invoke --function-name my-function output.json

# Trigger (API Gateway, S3, DynamoDB, SNS, etc.)
# Example: S3 upload → Lambda processes file

# API Gateway (RESTful API, trigger Lambda)
aws apigateway create-rest-api --name my-api

# Step Functions (orchestrate multiple Lambdas, workflow)
# Define state machine (JSON):
{
  "StartAt": "ProcessOrder",
  "States": {
    "ProcessOrder": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:process-order",
      "Next": "SendEmail"
    },
    "SendEmail": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789012:function:send-email",
      "End": true
    }
  }
}
```

---

## Azure Architecture

```bash
# COMPUTE

# Virtual Machines
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image UbuntuLTS \
  --size Standard_B1s \
  --admin-username azureuser \
  --generate-ssh-keys

# App Service (PaaS for web apps)
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name myWebApp \
  --runtime "NODE|18-lts"

# Azure Functions (serverless)
az functionapp create \
  --resource-group myResourceGroup \
  --consumption-plan-location eastus \
  --runtime node \
  --name myFunctionApp \
  --storage-account mystorageaccount

---

# STORAGE

# Blob Storage (object storage, like S3)
az storage account create \
  --name mystorageaccount \
  --resource-group myResourceGroup \
  --location eastus \
  --sku Standard_LRS

# Upload file
az storage blob upload \
  --account-name mystorageaccount \
  --container-name mycontainer \
  --name myfile.txt \
  --file ./myfile.txt

---

# DATABASES

# Azure SQL Database (managed SQL Server)
az sql server create \
  --name myserver \
  --resource-group myResourceGroup \
  --location eastus \
  --admin-user myadmin \
  --admin-password MySecurePassword123

az sql db create \
  --resource-group myResourceGroup \
  --server myserver \
  --name myDatabase \
  --service-objective S0

# Cosmos DB (NoSQL, globally distributed)
az cosmosdb create \
  --name mycosmosdb \
  --resource-group myResourceGroup \
  --kind MongoDB

---

# NETWORKING

# Virtual Network (VNet)
az network vnet create \
  --resource-group myResourceGroup \
  --name myVNet \
  --address-prefix 10.0.0.0/16 \
  --subnet-name mySubnet \
  --subnet-prefix 10.0.1.0/24

# Load Balancer
az network lb create \
  --resource-group myResourceGroup \
  --name myLoadBalancer \
  --sku Standard \
  --public-ip-address myPublicIP

# Application Gateway (Layer 7 load balancer, WAF)
az network application-gateway create \
  --name myAppGateway \
  --resource-group myResourceGroup \
  --location eastus \
  --vnet-name myVNet \
  --subnet mySubnet \
  --capacity 2 \
  --sku Standard_v2 \
  --public-ip-address myAGPublicIPAddress
```

---

## GCP Architecture

```bash
# COMPUTE

# Compute Engine (VMs)
gcloud compute instances create my-instance \
  --zone=us-central1-a \
  --machine-type=e2-micro \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud

# Cloud Run (serverless containers)
gcloud run deploy my-service \
  --image gcr.io/my-project/my-image \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Cloud Functions (serverless functions)
gcloud functions deploy my-function \
  --runtime python39 \
  --trigger-http \
  --allow-unauthenticated \
  --entry-point hello_world

---

# STORAGE

# Cloud Storage (object storage)
gsutil mb gs://my-unique-bucket-name
gsutil cp myfile.txt gs://my-unique-bucket-name/

---

# DATABASES

# Cloud SQL (managed MySQL, PostgreSQL)
gcloud sql instances create my-instance \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1

# Firestore (NoSQL, document database)
gcloud firestore databases create --region=us-east1

---

# KUBERNETES

# GKE (Google Kubernetes Engine, managed Kubernetes)
gcloud container clusters create my-cluster \
  --zone us-central1-a \
  --num-nodes 3

# Connect to cluster
gcloud container clusters get-credentials my-cluster --zone us-central1-a

# Deploy application
kubectl create deployment my-app --image=gcr.io/my-project/my-image
kubectl expose deployment my-app --type=LoadBalancer --port 80
```

---

## Architecture Patterns

```markdown
WELL-ARCHITECTED FRAMEWORK (AWS, similar for Azure/GCP):

1. OPERATIONAL EXCELLENCE:
   - IaC (Infrastructure as Code): Terraform, CloudFormation, ARM templates
   - CI/CD (Continuous Integration/Deployment): Automate deployments
   - Monitoring: CloudWatch, Azure Monitor, GCP Logging (metrics, logs, alarms)

2. SECURITY:
   - Identity & Access Management (IAM): Least privilege, MFA
   - Encryption: At rest (S3, EBS, RDS), in transit (TLS/SSL)
   - Network security: VPC, Security Groups, NACLs, WAF
   - Compliance: GDPR, HIPAA, PCI-DSS

3. RELIABILITY:
   - Multi-AZ (Availability Zones): Redundancy within region
   - Multi-Region: Disaster recovery, global presence
   - Auto-scaling: Handle traffic spikes
   - Backups: Automated, regular, tested

4. PERFORMANCE EFFICIENCY:
   - Right-sizing: Choose appropriate instance types (not over-provisioned)
   - Caching: CloudFront (CDN), ElastiCache (Redis/Memcached), Azure CDN
   - Database optimization: Read replicas, indexing, query optimization

5. COST OPTIMIZATION:
   - Reserved Instances: 1-3 year commitment (30-70% discount vs on-demand)
   - Spot Instances: Bid on unused capacity (up to 90% discount, can be terminated)
   - Savings Plans: Flexible pricing (commit to $/hour, any instance type)
   - Right-sizing: Stop over-provisioned instances
   - Lifecycle policies: Move old data to cheaper storage (S3 Glacier)

---

MICROSERVICES ARCHITECTURE:

CHARACTERISTICS:
- Small, independent services (one function per service)
- Communicate via APIs (REST, gRPC)
- Independently deployable (update one service without affecting others)
- Technology agnostic (each service different language/framework)

EXAMPLE:
- E-commerce app:
  * User Service (authentication, profiles)
  * Product Service (catalog, inventory)
  * Order Service (checkout, payments)
  * Notification Service (emails, SMS)

BENEFITS:
- Scalability (scale individual services, not entire app)
- Resilience (one service fails, others continue)
- Faster development (teams work on different services)

CHALLENGES:
- Complexity (many services to manage)
- Monitoring (distributed tracing: AWS X-Ray, Azure Application Insights, GCP Trace)
- Data consistency (distributed transactions, eventual consistency)

---

EVENT-DRIVEN ARCHITECTURE:

COMPONENTS:
- Event producers (services emit events)
- Event bus (SQS, SNS, EventBridge, Azure Event Grid, GCP Pub/Sub)
- Event consumers (services react to events)

EXAMPLE:
- User uploads image → S3 emits event → Lambda resizes image → Stores in S3 → SNS notifies user

BENEFITS:
- Decoupling (services don't call each other directly)
- Scalability (async processing, queue buffers spikes)
- Real-time (react to events immediately)

---

MULTI-TIER ARCHITECTURE (Traditional):

3-TIER:
1. Presentation (Web/Mobile UI): CloudFront, S3 (static), API Gateway
2. Application (Business logic): EC2, Lambda, ECS/EKS (containers)
3. Data (Database, storage): RDS, DynamoDB, S3

EXAMPLE:
- Web app (React) in S3 + CloudFront
- API (Node.js) in EC2 Auto Scaling Group behind ALB
- Database (PostgreSQL) in RDS Multi-AZ
```

---

## Key Takeaways

1. **Multi-cloud strategy** - Avoid vendor lock-in (use Terraform for IaC across clouds)
2. **Security first** - IAM least privilege, encryption, network segmentation
3. **Cost optimization** - Right-size, reserved instances, lifecycle policies (monitor with AWS Cost Explorer, Azure Cost Management)
4. **High availability** - Multi-AZ, auto-scaling, load balancing
5. **Serverless where possible** - Less management, pay per use (Lambda, Cloud Functions, Cloud Run)

---

## References

- AWS Well-Architected Framework
- Azure Architecture Center
- Google Cloud Architecture Framework
- "Designing Data-Intensive Applications" - Martin Kleppmann

**Related**: `terraform-multi-cloud-iac.md`, `kubernetes-production-deployment.md`, `cloud-cost-optimization-strategies.md`
