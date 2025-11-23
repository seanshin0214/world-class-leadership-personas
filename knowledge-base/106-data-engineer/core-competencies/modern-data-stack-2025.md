# Modern Data Stack 2025: Pipelines & Lakehouse

**Updated**: 2025-11-23 | **Stack**: dbt, Databricks, Airflow, Snowflake

---

## Modern Data Stack Overview

```
DATA SOURCES
├── Applications (Postgres, MySQL)
├── SaaS (Salesforce, Stripe)
└── Events (Segment, Snowplow)
    ↓
INGESTION (Fivetran, Airbyte)
    ↓
DATA WAREHOUSE/LAKEHOUSE
├── Snowflake
├── Databricks
└── BigQuery
    ↓
TRANSFORMATION (dbt)
    ↓
BI/ML
├── Tableau, Looker
└── ML models
```

---

## dbt (Data Build Tool)

### Project Structure

```
my_project/
├── models/
│   ├── staging/
│   │   ├── stg_customers.sql
│   │   └── stg_orders.sql
│   ├── intermediate/
│   │   └── int_order_items.sql
│   └── marts/
│       ├── fct_orders.sql
│       └── dim_customers.sql
├── tests/
├── macros/
└── dbt_project.yml
```

### Model Example

```sql
-- models/staging/stg_customers.sql
with source as (
    select * from {{ source('raw', 'customers') }}
),

renamed as (
    select
        id as customer_id,
        first_name || ' ' || last_name as customer_name,
        email,
        created_at
    from source
)

select * from renamed
```

### Incremental Models

```sql
{{
    config(
        materialized='incremental',
        unique_key='order_id'
    )
}}

select
    order_id,
    customer_id,
    order_date,
    total_amount
from {{ source('raw', 'orders') }}

{% if is_incremental() %}
  where order_date > (select max(order_date) from {{ this }})
{% endif %}
```

### Tests

```yaml
# models/schema.yml
version: 2

models:
  - name: fct_orders
    columns:
      - name: order_id
        tests:
          - unique
          - not_null
      - name: total_amount
        tests:
          - dbt_utils.expression_is_true:
              expression: ">= 0"
      - name: customer_id
        tests:
          - relationships:
              to: ref('dim_customers')
              field: customer_id
```

---

## Databricks Lakehouse

### Delta Lake Architecture

```sql
-- Create Delta table
CREATE TABLE orders
USING DELTA
LOCATION '/mnt/data/orders'
AS SELECT * FROM parquet.`/raw/orders/*.parquet`;

-- Time travel
SELECT * FROM orders VERSION AS OF 10;
SELECT * FROM orders TIMESTAMP AS OF '2025-01-01';

-- ACID transactions
MERGE INTO orders target
USING updates source
ON target.order_id = source.order_id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;

-- Optimize
OPTIMIZE orders;
VACUUM orders RETAIN 168 HOURS;  -- 7 days
```

### Medallion Architecture

```
BRONZE (Raw)
├── Ingested as-is
└── Append-only
    ↓
SILVER (Cleaned)
├── Deduplicated
├── Validated
└── Conformed
    ↓
GOLD (Business-level)
├── Aggregated
├── Enriched
└── ML-ready
```

---

## Apache Airflow

### DAG Example

```python
from airflow import DAG
from airflow.providers.databricks.operators.databricks import DatabricksRunNowOperator
from airflow.providers.dbt.cloud.operators.dbt import DbtCloudRunJobOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'data-team',
    'depends_on_past': False,
    'email_on_failure': True,
    'email': ['data@company.com'],
    'retries': 2,
    'retry_delay': timedelta(minutes=5)
}

with DAG(
    'daily_etl',
    default_args=default_args,
    schedule_interval='0 2 * * *',  # 2 AM daily
    start_date=datetime(2025, 1, 1),
    catchup=False
) as dag:
    
    # Extract from sources
    extract_salesforce = DatabricksRunNowOperator(
        task_id='extract_salesforce',
        job_id=12345
    )
    
    extract_stripe = DatabricksRunNowOperator(
        task_id='extract_stripe',
        job_id=12346
    )
    
    # Transform with dbt
    dbt_run = DbtCloudRunJobOperator(
        task_id='dbt_run',
        job_id=54321,
        check_interval=60,
        timeout=3600
    )
    
    # Dependencies
    [extract_salesforce, extract_stripe] >> dbt_run
```

---

## Data Quality

### Great Expectations

```python
import great_expectations as gx

context = gx.get_context()

# Define expectations
expectation_suite = context.add_expectation_suite("orders_suite")

validator = context.get_validator(
    batch_request=batch_request,
    expectation_suite_name="orders_suite"
)

validator.expect_column_values_to_not_be_null("order_id")
validator.expect_column_values_to_be_between("total_amount", min_value=0, max_value=1000000)
validator.expect_column_values_to_be_in_set("status", ["pending", "completed", "cancelled"])

# Run validation
results = validator.validate()
```

### dbt Tests

```sql
-- tests/assert_positive_revenue.sql
select
    customer_id,
    sum(total_amount) as total_revenue
from {{ ref('fct_orders') }}
group by 1
having sum(total_amount) < 0
```

---

## Data Modeling

### Kimball Star Schema

```
FACT_ORDERS (Fact Table)
├── order_id (PK)
├── customer_id (FK)
├── product_id (FK)
├── date_id (FK)
├── quantity
└── total_amount

DIM_CUSTOMERS (Dimension)
├── customer_id (PK)
├── customer_name
├── email
└── segment

DIM_PRODUCTS (Dimension)
├── product_id (PK)
├── product_name
├── category
└── price
```

### Slowly Changing Dimensions (SCD Type 2)

```sql
CREATE TABLE dim_customers_scd2 (
    customer_key INT PRIMARY KEY,  -- Surrogate key
    customer_id INT,                -- Natural key
    customer_name VARCHAR,
    email VARCHAR,
    effective_date DATE,
    end_date DATE,
    is_current BOOLEAN
);

-- Insert new version
INSERT INTO dim_customers_scd2
SELECT
    ROW_NUMBER() OVER (ORDER BY customer_id) as customer_key,
    customer_id,
    customer_name,
    email,
    CURRENT_DATE as effective_date,
    '9999-12-31' as end_date,
    TRUE as is_current
FROM new_customers;

-- Expire old version
UPDATE dim_customers_scd2
SET end_date = CURRENT_DATE, is_current = FALSE
WHERE customer_id IN (SELECT customer_id FROM changed_customers);
```

---

## Performance Optimization

### Partitioning

```sql
-- Databricks/Spark
CREATE TABLE orders
PARTITIONED BY (order_date)
AS SELECT * FROM raw_orders;

-- Query uses partition pruning
SELECT *
FROM orders
WHERE order_date >= '2025-01-01';  -- Only scans relevant partitions
```

### Clustering

```sql
-- Snowflake
ALTER TABLE orders
CLUSTER BY (customer_id, order_date);

-- Improves query performance for:
SELECT * FROM orders WHERE customer_id = 123;
```

### Materialized Views

```sql
-- Create materialized view
CREATE MATERIALIZED VIEW daily_revenue AS
SELECT
    DATE(order_date) as date,
    SUM(total_amount) as revenue
FROM orders
GROUP BY 1;

-- Auto-refreshes on base table changes (Snowflake)
-- Manual refresh (others)
REFRESH MATERIALIZED VIEW daily_revenue;
```

---

## Streaming Data

### Kafka + Spark Structured Streaming

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("streaming_orders").getOrCreate()

# Read from Kafka
df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "orders") \
    .load()

# Transform
parsed = df.selectExpr("CAST(value AS STRING) as json") \
    .select(from_json("json", schema).alias("data")) \
    .select("data.*")

# Write to Delta
query = parsed \
    .writeStream \
    .format("delta") \
    .outputMode("append") \
    .option("checkpointLocation", "/tmp/checkpoint") \
    .start("/mnt/delta/orders")

query.awaitTermination()
```

---

## Observability

### Monitoring Stack

```
Metrics: Prometheus + Grafana
Logs: ELK (Elasticsearch, Logstash, Kibana)
Alerts: PagerDuty, Slack

KEY METRICS:
- Pipeline success rate
- Data freshness (time since last update)
- Row counts (daily, weekly trends)
- Query performance (p50, p95, p99)
- Cost per query
```

### Data Lineage

```
dbt docs generate  # Creates lineage graph

Tools:
- dbt Docs (built-in)
- DataHub (LinkedIn)
- Amundsen (Lyft)
- Atlan
```

---

## Best Practices

1. **Naming conventions**: `stg_`, `int_`, `fct_`, `dim_`
2. **Incremental models**: For large tables (>1M rows)
3. **Tests**: Every model should have tests
4. **Documentation**: Use schema.yml for descriptions
5. **Version control**: Git for all data code
6. **CI/CD**: Test on PR, deploy on merge
7. **Cost monitoring**: Set budgets, alert on spikes

---

## Tools Ecosystem

**Ingestion**: Fivetran ($), Airbyte (open-source)
**Storage**: Snowflake, Databricks, BigQuery
**Transformation**: dbt (primary), Matillion
**Orchestration**: Airflow, Prefect, Dagster
**Quality**: Great Expectations, dbt tests
**Catalog**: DataHub, Amundsen, Atlan
**BI**: Looker, Tableau, Metabase

---

## References

- dbt Documentation
- Databricks Lakehouse Architecture
- "The Data Warehouse Toolkit" - Ralph Kimball
- "Designing Data-Intensive Applications" - Martin Kleppmann

**Related**: `sql-optimization.md`, `data-modeling.md`, `spark-performance.md`
