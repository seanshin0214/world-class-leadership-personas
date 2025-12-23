# Cloud Architecture 2025: AWS, Azure, GCP

**Updated**: 2025-11-23 | **Focus**: Multi-cloud, Serverless, FinOps

---

## Cloud Comparison

| Service | AWS | Azure | GCP |
|---------|-----|-------|-----|
| **Compute** | EC2 | Virtual Machines | Compute Engine |
| **Serverless** | Lambda | Functions | Cloud Functions |
| **Container** | ECS/EKS | AKS | GKE |
| **Storage** | S3 | Blob Storage | Cloud Storage |
| **Database** | RDS, DynamoDB | SQL Database, Cosmos DB | Cloud SQL, Firestore |
| **Network** | VPC | Virtual Network | VPC |

---

## Well-Architected Framework

### AWS 6 Pillars

```
1. OPERATIONAL EXCELLENCE
   - IaC (Terraform, CloudFormation)
   - CI/CD pipelines
   - Monitoring & logging

2. SECURITY
   - IAM least privilege
   - Encryption at rest/in transit
   - Security groups, NACLs

3. RELIABILITY
   - Multi-AZ deployment
   - Auto Scaling
   - Disaster recovery

4. PERFORMANCE
   - Right-sizing instances
   - CDN (CloudFront)
   - Caching (ElastiCache)

5. COST OPTIMIZATION
   - Reserved Instances
   - Spot Instances
   - S3 lifecycle policies

6. SUSTAINABILITY
   - Efficient resource usage
   - Carbon-aware architecture
```

---

## Infrastructure as Code

### Terraform

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "main-vpc"
  }
}

# Application Load Balancer
resource "aws_lb" "app" {
  name               = "app-lb"
  internal           = false
  load_balancer_type = "application"
  subnets            = aws_subnet.public[*].id
  
  enable_deletion_protection = true
}

# Auto Scaling Group
resource "aws_autoscaling_group" "app" {
  desired_capacity     = 3
  max_size            = 10
  min_size            = 2
  vpc_zone_identifier = aws_subnet.private[*].id
  
  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }
}

# RDS Database
resource "aws_db_instance" "main" {
  engine               = "postgres"
  engine_version       = "15.3"
  instance_class       = "db.t3.medium"
  allocated_storage    = 100
  storage_type         = "gp3"
  
  multi_az            = true
  backup_retention_period = 7
  
  db_name  = "appdb"
  username = var.db_username
  password = var.db_password
}
```

---

## Serverless Architecture

### AWS Lambda + API Gateway

```python
# lambda_function.py
import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('users')

def lambda_handler(event, context):
    # Get user ID from path
    user_id = event['pathParameters']['id']
    
    # Query DynamoDB
    response = table.get_item(Key={'id': user_id})
    
    if 'Item' not in response:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'User not found'})
        }
    
    return {
        'statusCode': 200,
        'body': json.dumps(response['Item'])
    }
```

```yaml
# serverless.yml
service: user-api

provider:
  name: aws
  runtime: python3.11
  region: us-east-1
  
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:GetItem
            - dynamodb:PutItem
          Resource: arn:aws:dynamodb:us-east-1:*:table/users

functions:
  getUser:
    handler: lambda_function.lambda_handler
    events:
      - http:
          path: users/{id}
          method: get
```

---

## Container Orchestration

### Kubernetes on EKS

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10

---
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8080
  selector:
    app: my-app
```

---

## Cost Optimization (FinOps)

### Strategies

```markdown
1. RIGHT-SIZING
   - Monitor CPU/memory usage
   - Downsize underutilized instances
   - Savings: 20-40%

2. RESERVED INSTANCES
   - 1-year or 3-year commitment
   - Savings: 30-60% vs On-Demand

3. SPOT INSTANCES
   - For fault-tolerant workloads
   - Savings: 70-90% vs On-Demand

4. S3 LIFECYCLE POLICIES
   - Move to Glacier after 90 days
   - Delete after 365 days
   - Savings: 80% on storage

5. AUTO SCALING
   - Scale down during off-hours
   - Scale up during peak
   - Savings: 30-50%
```

### Cost Monitoring

```python
# AWS Cost Explorer API
import boto3

ce = boto3.client('ce')

response = ce.get_cost_and_usage(
    TimePeriod={
        'Start': '2025-01-01',
        'End': '2025-01-31'
    },
    Granularity='MONTHLY',
    Metrics=['UnblendedCost'],
    GroupBy=[
        {'Type': 'DIMENSION', 'Key': 'SERVICE'}
    ]
)

for result in response['ResultsByTime']:
    print(f"Period: {result['TimePeriod']}")
    for group in result['Groups']:
        service = group['Keys'][0]
        cost = group['Metrics']['UnblendedCost']['Amount']
        print(f"  {service}: ${float(cost):.2f}")
```

---

## Security Best Practices

```markdown
1. IAM
   - Least privilege principle
   - MFA for all users
   - Rotate access keys every 90 days

2. NETWORK
   - Private subnets for databases
   - Security groups (whitelist only)
   - WAF for web apps

3. DATA
   - Encryption at rest (KMS)
   - Encryption in transit (TLS 1.3)
   - Backup strategy (3-2-1 rule)

4. MONITORING
   - CloudTrail (audit logs)
   - GuardDuty (threat detection)
   - Security Hub (compliance)
```

---

## Disaster Recovery

### Strategies

```
RTO = Recovery Time Objective
RPO = Recovery Point Objective

BACKUP & RESTORE
- RTO: Hours to days
- RPO: Hours
- Cost: $
- Use: Non-critical systems

PILOT LIGHT
- RTO: 10s of minutes
- RPO: Minutes
- Cost: $$
- Use: Core systems

WARM STANDBY
- RTO: Minutes
- RPO: Seconds
- Cost: $$$
- Use: Business-critical

MULTI-REGION ACTIVE-ACTIVE
- RTO: Seconds
- RPO: Near-zero
- Cost: $$$$
- Use: Mission-critical
```

---

## References

- AWS Well-Architected Framework
- Azure Architecture Center
- Google Cloud Architecture Framework

**Related**: `kubernetes.md`, `terraform.md`, `security.md`
