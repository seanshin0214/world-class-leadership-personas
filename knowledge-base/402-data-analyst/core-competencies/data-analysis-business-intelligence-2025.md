# Data Analysis & Business Intelligence 2025

**Updated**: 2025-11-24 | **Focus**: Excel, SQL, Tableau, Business Metrics

---

## Excel for Data Analysis

```excel
# ESSENTIAL FORMULAS

# VLOOKUP (Find value in table)
=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])

Example: Find employee salary
=VLOOKUP(A2, EmployeeTable, 3, FALSE)
# A2 = Employee ID to find
# EmployeeTable = Named range with employee data
# 3 = Column number (Salary is 3rd column)
# FALSE = Exact match

# XLOOKUP (Better than VLOOKUP, Excel 365)
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])

Example:
=XLOOKUP(A2, Employees[ID], Employees[Salary], "Not Found")

---

# INDEX-MATCH (More flexible than VLOOKUP)
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))

Example: Find salary by employee name
=INDEX(Employees[Salary], MATCH(A2, Employees[Name], 0))
# Advantage: Can look left (VLOOKUP can't)

---

# SUMIF / SUMIFS (Conditional sum)
=SUMIF(range, criteria, [sum_range])
=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)

Example: Total sales for "Electronics" category
=SUMIF(Categories, "Electronics", Sales)

Example: Total sales for "Electronics" in "West" region
=SUMIFS(Sales, Categories, "Electronics", Regions, "West")

---

# COUNTIF / COUNTIFS (Conditional count)
=COUNTIF(range, criteria)

Example: Count orders over $1000
=COUNTIF(OrderValues, ">1000")

Example: Count "Electronics" orders in "West" region
=COUNTIFS(Categories, "Electronics", Regions, "West")

---

# AVERAGEIF / AVERAGEIFS (Conditional average)
=AVERAGEIF(range, criteria, [average_range])

Example: Average price for "Electronics"
=AVERAGEIF(Categories, "Electronics", Prices)

---

# IF / IFS (Conditional logic)
=IF(logical_test, value_if_true, value_if_false)

Example: Discount based on quantity
=IF(B2>=100, "10%", IF(B2>=50, "5%", "0%"))

# IFS (Cleaner for multiple conditions, Excel 2016+)
=IFS(B2>=100, "10%", B2>=50, "5%", TRUE, "0%")

---

# TEXT FUNCTIONS

# CONCATENATE / TEXTJOIN
=CONCATENATE(A2, " ", B2)  # Older
=A2 & " " & B2             # Shortcut
=TEXTJOIN(" ", TRUE, A2:C2) # Join with delimiter, ignore blanks

Example: Full name
=A2 & " " & B2  # "John" + " " + "Doe" = "John Doe"

# LEFT, RIGHT, MID (Extract text)
=LEFT(text, num_chars)
=RIGHT(text, num_chars)
=MID(text, start_num, num_chars)

Example: Extract area code from phone number
=LEFT(A2, 3)  # "555-1234" → "555"

# TRIM (Remove extra spaces)
=TRIM(text)

# UPPER, LOWER, PROPER (Change case)
=UPPER("hello") → "HELLO"
=LOWER("HELLO") → "hello"
=PROPER("john doe") → "John Doe"

---

# DATE FUNCTIONS

# TODAY, NOW
=TODAY()  # Current date
=NOW()    # Current date & time

# YEAR, MONTH, DAY
=YEAR(A2)   # Extract year from date
=MONTH(A2)  # Extract month (1-12)
=DAY(A2)    # Extract day (1-31)

# DATEDIF (Date difference)
=DATEDIF(start_date, end_date, "unit")
# Units: "Y" (years), "M" (months), "D" (days)

Example: Age calculation
=DATEDIF(A2, TODAY(), "Y")  # Years old

# EOMONTH (End of month)
=EOMONTH(start_date, months)

Example: Last day of current month
=EOMONTH(TODAY(), 0)

---

# PIVOT TABLE FUNCTIONS (Use in formulas)

# GETPIVOTDATA (Extract value from pivot table)
=GETPIVOTDATA("Sales", PivotTable, "Region", "West", "Product", "Laptop")
# Returns sales for Laptops in West region

---

ADVANCED TECHNIQUES:

# ARRAY FORMULAS (Excel 365)
# Spill: Formula returns multiple values automatically

Example: Unique values
=UNIQUE(A2:A100)  # Returns unique list

Example: Filter
=FILTER(A2:D100, C2:C100="Electronics")  # Returns rows where category = Electronics

Example: Sort
=SORT(A2:D100, 3, -1)  # Sort by column 3 descending

# XLOOKUP + FILTER (Dynamic lookup)
=XLOOKUP(A2, FILTER(Employees[ID], Employees[Active]="Yes"), 
              FILTER(Employees[Salary], Employees[Active]="Yes"))
# Only look up active employees

---

# CONDITIONAL FORMATTING (Visual insights)

1. Highlight cells > $10,000:
   - Select range → Conditional Formatting → Highlight Cells Rules → Greater Than
   
2. Data bars (visual bar chart in cells):
   - Select range → Conditional Formatting → Data Bars
   
3. Color scales (gradient based on value):
   - Select range → Conditional Formatting → Color Scales
   
4. Icon sets (arrows, traffic lights):
   - Select range → Conditional Formatting → Icon Sets
   
5. Custom formula:
   - Highlight duplicate rows: =$A2=$A3
   - Highlight if multiple conditions: =AND($B2>1000, $C2="West")

---

# PIVOT TABLES (Quick analysis)

1. Select data range → Insert → Pivot Table
2. Drag fields:
   - Rows: Categories
   - Columns: Regions
   - Values: SUM of Sales
3. Filters: Date range
4. Slicers (visual filters): Insert → Slicer → Select fields

CALCULATED FIELDS (Custom metrics):
- Click Pivot Table → Analyze → Fields, Items & Sets → Calculated Field
- Example: Profit Margin = 'Profit' / 'Revenue'

---

# DATA VALIDATION (Ensure data quality)

1. Select cells → Data → Data Validation
2. Allow: List (dropdown)
   - Source: =Categories  # Named range
   - Or: "Option1,Option2,Option3"
3. Allow: Whole Number
   - Between: 0 and 100
4. Custom formula:
   - =COUNTIF($A$2:$A$100, A2)=1  # No duplicates
```

---

## SQL for Business Analytics

```sql
-- BUSINESS METRICS QUERIES

-- 1. REVENUE ANALYSIS

-- Total revenue by month
SELECT 
    DATE_TRUNC('month', order_date) as month,
    SUM(total_amount) as monthly_revenue,
    COUNT(DISTINCT order_id) as order_count,
    SUM(total_amount) / COUNT(DISTINCT order_id) as avg_order_value
FROM orders
WHERE order_date >= '2025-01-01'
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;

-- Revenue by product category
SELECT 
    c.category_name,
    SUM(oi.quantity * oi.unit_price) as revenue,
    SUM(oi.quantity * (oi.unit_price - p.cost)) as profit,
    SUM(oi.quantity * (oi.unit_price - p.cost)) / 
        NULLIF(SUM(oi.quantity * oi.unit_price), 0) * 100 as profit_margin_pct
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
JOIN categories c ON p.category_id = c.category_id
GROUP BY c.category_name
ORDER BY revenue DESC;

---

-- 2. CUSTOMER ANALYSIS

-- Customer Lifetime Value (CLV)
SELECT 
    customer_id,
    customer_name,
    COUNT(order_id) as total_orders,
    SUM(total_amount) as lifetime_value,
    AVG(total_amount) as avg_order_value,
    MIN(order_date) as first_order_date,
    MAX(order_date) as last_order_date,
    MAX(order_date) - MIN(order_date) as customer_tenure_days
FROM orders o
JOIN customers c USING (customer_id)
GROUP BY customer_id, customer_name
ORDER BY lifetime_value DESC
LIMIT 100;  -- Top 100 customers

-- Customer Segmentation (RFM: Recency, Frequency, Monetary)
WITH rfm AS (
    SELECT 
        customer_id,
        MAX(order_date) as last_order_date,
        CURRENT_DATE - MAX(order_date) as recency_days,
        COUNT(order_id) as frequency,
        SUM(total_amount) as monetary
    FROM orders
    GROUP BY customer_id
)
SELECT 
    customer_id,
    recency_days,
    frequency,
    monetary,
    CASE 
        WHEN recency_days <= 30 AND frequency >= 5 AND monetary >= 1000 THEN 'Champions'
        WHEN recency_days <= 30 AND frequency >= 3 THEN 'Loyal Customers'
        WHEN recency_days <= 60 AND frequency >= 2 THEN 'Potential Loyalists'
        WHEN recency_days > 180 THEN 'At Risk'
        ELSE 'Needs Attention'
    END as customer_segment
FROM rfm
ORDER BY monetary DESC;

---

-- 3. COHORT ANALYSIS (Retention)

-- Monthly cohort retention
WITH cohorts AS (
    SELECT 
        customer_id,
        DATE_TRUNC('month', MIN(order_date)) as cohort_month
    FROM orders
    GROUP BY customer_id
),
cohort_activity AS (
    SELECT 
        c.cohort_month,
        DATE_TRUNC('month', o.order_date) as activity_month,
        COUNT(DISTINCT o.customer_id) as active_customers
    FROM cohorts c
    JOIN orders o ON c.customer_id = o.customer_id
    GROUP BY c.cohort_month, DATE_TRUNC('month', o.order_date)
)
SELECT 
    cohort_month,
    activity_month,
    active_customers,
    EXTRACT(MONTH FROM AGE(activity_month, cohort_month)) as months_since_first_order
FROM cohort_activity
ORDER BY cohort_month, activity_month;

---

-- 4. PRODUCT PERFORMANCE

-- Best/worst sellers
SELECT 
    p.product_name,
    SUM(oi.quantity) as units_sold,
    SUM(oi.quantity * oi.unit_price) as revenue,
    COUNT(DISTINCT o.order_id) as orders_with_product,
    AVG(oi.quantity) as avg_quantity_per_order
FROM products p
JOIN order_items oi ON p.product_id = oi.product_id
JOIN orders o ON oi.order_id = o.order_id
WHERE o.order_date >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY p.product_name
ORDER BY revenue DESC;

-- Product affinity (frequently bought together)
SELECT 
    p1.product_name as product_1,
    p2.product_name as product_2,
    COUNT(*) as times_bought_together
FROM order_items oi1
JOIN order_items oi2 ON oi1.order_id = oi2.order_id 
    AND oi1.product_id < oi2.product_id  -- Avoid duplicates
JOIN products p1 ON oi1.product_id = p1.product_id
JOIN products p2 ON oi2.product_id = p2.product_id
GROUP BY p1.product_name, p2.product_name
HAVING COUNT(*) >= 10
ORDER BY times_bought_together DESC
LIMIT 20;

---

-- 5. FUNNEL ANALYSIS (Conversion rates)

WITH funnel AS (
    SELECT 
        COUNT(DISTINCT session_id) as visitors,
        COUNT(DISTINCT CASE WHEN event_type = 'view_product' THEN session_id END) as product_views,
        COUNT(DISTINCT CASE WHEN event_type = 'add_to_cart' THEN session_id END) as add_to_cart,
        COUNT(DISTINCT CASE WHEN event_type = 'checkout' THEN session_id END) as checkouts,
        COUNT(DISTINCT CASE WHEN event_type = 'purchase' THEN session_id END) as purchases
    FROM events
    WHERE event_date = CURRENT_DATE
)
SELECT 
    visitors,
    product_views,
    add_to_cart,
    checkouts,
    purchases,
    ROUND(product_views::NUMERIC / visitors * 100, 2) as view_rate,
    ROUND(add_to_cart::NUMERIC / product_views * 100, 2) as add_cart_rate,
    ROUND(checkouts::NUMERIC / add_to_cart * 100, 2) as checkout_rate,
    ROUND(purchases::NUMERIC / checkouts * 100, 2) as purchase_rate,
    ROUND(purchases::NUMERIC / visitors * 100, 2) as overall_conversion_rate
FROM funnel;
```

---

## Tableau for Visualization

```markdown
DASHBOARD DESIGN PRINCIPLES:

1. PURPOSE:
   - Who is the audience? (Executive, analyst, operations)
   - What decisions will they make? (Strategic, tactical)
   - What actions should they take? (Approve, investigate, optimize)

2. LAYOUT:
   - F-pattern (users read top-left first, then scan down)
   - Most important KPI: Top-left
   - Supporting details: Below and right
   - White space (don't cram, let data breathe)

3. CHARTS:
   - Line chart: Trends over time
   - Bar chart: Compare categories
   - Scatter plot: Correlation
   - Heatmap: Patterns in large dataset
   - Avoid: Pie charts (hard to compare), 3D (distorts data)

4. COLOR:
   - Use sparingly (1-2 accent colors)
   - Colorblind-friendly (avoid red-green)
   - Consistent meaning (red = bad, green = good)
   - Highlight important data (rest in gray)

5. INTERACTIVITY:
   - Filters (date range, category)
   - Actions (click chart to filter others)
   - Tooltips (show details on hover)
   - Parameters (user inputs: "Show top N")

---

COMMON CALCULATIONS (Calculated Fields):

# Profit Margin
([Revenue] - [Cost]) / [Revenue]

# Year-over-Year Growth
(SUM([Sales]) - LOOKUP(SUM([Sales]), -12)) / LOOKUP(SUM([Sales]), -12)
# -12 = 12 months ago

# Running Total
RUNNING_SUM(SUM([Sales]))

# Rank
RANK(SUM([Sales]), 'desc')

# Percentile
PERCENTILE([Sales], 0.75)  # 75th percentile

# If/Then Logic
IF [Sales] > 10000 THEN "High"
ELSEIF [Sales] > 5000 THEN "Medium"
ELSE "Low"
END

# Date Calculations
DATEDIFF('day', [Order Date], [Ship Date])  # Days to ship
DATEADD('month', 3, [Order Date])  # 3 months later

---

LEVEL OF DETAIL (LOD) EXPRESSIONS:

# FIXED (Ignore filters)
{FIXED [Customer ID]: SUM([Sales])}  # Total sales per customer

# INCLUDE (Add dimension)
{INCLUDE [Product]: AVG([Discount])}  # Avg discount including product

# EXCLUDE (Remove dimension)
{EXCLUDE [Region]: SUM([Sales])}  # Total sales excluding region

Use case: Calculate % of total
SUM([Sales]) / {FIXED: SUM([Sales])}

---

DASHBOARD EXAMPLES:

1. EXECUTIVE DASHBOARD:
   - KPIs: Revenue, Profit, Orders (vs last month/year)
   - Revenue trend (line chart, last 12 months)
   - Top 5 products (bar chart)
   - Sales by region (map)
   - Filters: Date range, region

2. SALES PERFORMANCE:
   - Sales by rep (bar chart, color by quota attainment)
   - Win rate (pie chart or single number)
   - Pipeline value by stage (funnel chart)
   - Deals closed this month (table)
   - Filters: Rep, team, product line

3. CUSTOMER ANALYTICS:
   - Customer count (total, new, churned)
   - CLV distribution (histogram)
   - Retention cohort (heatmap)
   - Top customers (table with sparklines)
   - Filters: Segment, acquisition channel

4. PRODUCT ANALYTICS:
   - Units sold (bar chart by product)
   - Revenue & profit (dual-axis line chart)
   - Product affinity (network diagram)
   - Inventory levels (heatmap)
   - Filters: Category, date range

---

BEST PRACTICES:

✅ DO:
- Keep it simple (5-7 charts max per dashboard)
- Use consistent date ranges (all charts same period)
- Add context (comparison to prior period, target)
- Test on mobile (responsive design)
- Document data sources (last updated, definitions)

❌ DON'T:
- Use 3D charts (distorts perception)
- Overuse color (rainbow effect confusing)
- Mix chart types unnecessarily
- Show all data (aggregate, filter, summarize)
- Forget to label axes, add titles
```

---

## Key Performance Indicators (KPIs)

```markdown
E-COMMERCE:

REVENUE METRICS:
- Total Revenue
- Average Order Value (AOV) = Revenue / # Orders
- Revenue Per Visitor (RPV) = Revenue / # Visitors

CONVERSION METRICS:
- Conversion Rate = Orders / Visitors × 100%
- Add-to-Cart Rate = Add to Cart / Product Views × 100%
- Cart Abandonment Rate = (Carts - Orders) / Carts × 100%

CUSTOMER METRICS:
- Customer Acquisition Cost (CAC) = Marketing Spend / New Customers
- Customer Lifetime Value (CLV) = Avg Order Value × Purchase Frequency × Customer Lifespan
- CLV:CAC Ratio (should be >3:1)
- Repeat Purchase Rate = Repeat Customers / Total Customers × 100%
- Churn Rate = Lost Customers / Total Customers × 100%

---

SAAS (Software as a Service):

GROWTH:
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR) = MRR × 12
- New MRR (new customers)
- Expansion MRR (upgrades, upsells)
- Churn MRR (lost revenue)
- Net New MRR = New + Expansion - Churn

RETENTION:
- Customer Churn Rate = Lost Customers / Total Customers
- Revenue Churn Rate = Lost MRR / Total MRR
- Net Revenue Retention (NRR) = (Starting MRR + Expansion - Churn) / Starting MRR × 100%
  * >100% = Good (expansion > churn)

UNIT ECONOMICS:
- CAC Payback Period = CAC / (ARPU × Gross Margin)
  * <12 months = Good
- LTV:CAC Ratio = CLV / CAC
  * >3:1 = Healthy

---

MARKETING:

TRAFFIC:
- Website Visits
- Unique Visitors
- Page Views
- Bounce Rate = Single-Page Sessions / Total Sessions

ENGAGEMENT:
- Time on Site
- Pages Per Session
- Social Media Engagement Rate = (Likes + Comments + Shares) / Followers × 100%

CAMPAIGN PERFORMANCE:
- Click-Through Rate (CTR) = Clicks / Impressions × 100%
- Cost Per Click (CPC) = Ad Spend / Clicks
- Cost Per Acquisition (CPA) = Ad Spend / Conversions
- Return on Ad Spend (ROAS) = Revenue / Ad Spend
  * ROAS 4:1 = $4 revenue per $1 spent

EMAIL:
- Open Rate = Opens / Delivered × 100%
  * 15-25% = Average
- Click-Through Rate = Clicks / Delivered × 100%
  * 2-5% = Average
- Unsubscribe Rate = Unsubscribes / Delivered × 100%
  * <0.5% = Good

---

FINANCE:

PROFITABILITY:
- Gross Profit = Revenue - Cost of Goods Sold (COGS)
- Gross Margin = Gross Profit / Revenue × 100%
- Operating Profit = Gross Profit - Operating Expenses
- Net Profit Margin = Net Profit / Revenue × 100%

LIQUIDITY:
- Current Ratio = Current Assets / Current Liabilities
  * >1 = Solvent (can pay short-term debts)
- Quick Ratio = (Current Assets - Inventory) / Current Liabilities
  * >1 = Can pay debts without selling inventory

EFFICIENCY:
- Inventory Turnover = COGS / Average Inventory
  * Higher = Better (selling inventory faster)
- Days Sales Outstanding (DSO) = (Accounts Receivable / Revenue) × 365
  * Lower = Faster collections

GROWTH:
- Revenue Growth Rate = (Current Revenue - Prior Revenue) / Prior Revenue × 100%
- Burn Rate = Cash Decrease / # Months
  * How fast spending cash (startups)
- Runway = Cash Balance / Burn Rate
  * # Months until run out of cash
```

---

## Key Takeaways

1. **Excel mastery** - VLOOKUP, pivot tables, conditional formatting (80% of analyst work)
2. **SQL proficiency** - JOINs, window functions, CTEs (query databases directly)
3. **Visualization** - Tableau/Power BI (communicate insights, not just numbers)
4. **Business acumen** - Understand metrics (CAC, CLV, churn), tie to decisions
5. **Storytelling** - Present findings (problem → analysis → recommendation → action)

---

## References

- "Storytelling with Data" - Cole Nussbaumer Knaflic
- "Data Science for Business" - Foster Provost
- Mode Analytics SQL Tutorial

**Related**: `excel-advanced.md`, `sql-optimization.md`, `tableau-dashboards.md`
