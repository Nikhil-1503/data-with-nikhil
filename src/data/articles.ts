export interface Article {
  id: string;
  title: string;
  description: string;
  tags: string[];
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  slug?: string;
  readingTime: number;
  date: string;
  author: string;
  featured: boolean;
  content: ArticleSection[];
}

export interface ArticleSection {
  type: 'heading' | 'paragraph' | 'code' | 'list' | 'callout' | 'image';
  level?: number;
  text?: string;
  language?: string;
  items?: string[];
  calloutType?: 'takeaway' | 'usecase' | 'interview';
  src?: string;
  caption?: string;
}

export const articles: Article[] = [
  {
    id: "spark-shuffle-optimization",
    title: "Reducing Spark Shuffle Write by 42% with Custom Partitioning",
    description: "Deep dive into PySpark partitioning strategies that dramatically reduce shuffle overhead in large-scale ETL pipelines.",
    tags: ["PySpark", "Performance", "ETL"],
    difficulty: "Advanced",
    slug: "spark-shuffle-optimization",
    readingTime: 12,
    date: "2024-11-15",
    author: "Nikhil Shanbhag",
    featured: true,
    content: [
      { type: "heading", level: 2, text: "The Shuffle Problem" },
      { type: "paragraph", text: "In distributed computing, shuffle operations are the most expensive part of any Spark job. When data needs to be redistributed across partitions — for joins, aggregations, or sorts — Spark must serialize, transfer, and deserialize massive amounts of data across the network." },
      { type: "paragraph", text: "In our production pipeline processing 2TB daily, shuffle write was consuming 68% of total job time. By implementing custom partitioning, we reduced this to 26%." },
      { type: "callout", calloutType: "takeaway", text: "Shuffle operations account for up to 70% of Spark job execution time. Custom partitioning can reduce this dramatically by co-locating related data." },
      { type: "heading", level: 2, text: "Understanding Partition Skew" },
      { type: "paragraph", text: "Before optimizing, we need to diagnose. Partition skew occurs when data is unevenly distributed across partitions, causing some tasks to process significantly more data than others." },
      { type: "code", language: "python", text: "from pyspark.sql import functions as F\n\n# Diagnose partition skew\ndef analyze_skew(df, partition_col):\n    return (\n        df.groupBy(partition_col)\n        .agg(\n            F.count('*').alias('row_count'),\n            F.sum(F.length(F.col('payload'))).alias('data_size')\n        )\n        .select(\n            F.min('row_count').alias('min_rows'),\n            F.max('row_count').alias('max_rows'),\n            F.avg('row_count').alias('avg_rows'),\n            F.stddev('row_count').alias('stddev_rows')\n        )\n    )\n\nskew_stats = analyze_skew(raw_df, 'customer_id')\nskew_stats.show()" },
      { type: "heading", level: 2, text: "Custom Partitioner Implementation" },
      { type: "paragraph", text: "The default HashPartitioner often creates imbalanced partitions when key distributions are skewed. We implemented a custom range-based partitioner that accounts for data density." },
      { type: "code", language: "python", text: "from pyspark.sql import Window\n\ndef balanced_repartition(df, num_partitions, key_col):\n    \"\"\"Repartition with balanced data distribution.\"\"\"\n    # Calculate quantile boundaries\n    w = Window.orderBy(key_col)\n    df_ranked = df.withColumn(\n        'partition_id',\n        F.ntile(num_partitions).over(w)\n    )\n    \n    return df_ranked.repartition(\n        num_partitions, \n        'partition_id'\n    ).drop('partition_id')\n\n# Apply balanced repartitioning\noptimized_df = balanced_repartition(\n    raw_df, \n    num_partitions=200, \n    key_col='customer_id'\n)" },
      { type: "callout", calloutType: "usecase", text: "At a fintech company processing 50M transactions daily, this approach reduced the nightly batch job from 4.2 hours to 2.4 hours, saving $1,200/month in cluster costs." },
      { type: "heading", level: 2, text: "Measuring Results" },
      { type: "paragraph", text: "After implementing custom partitioning across our three main ETL pipelines:" },
      { type: "list", items: [
        "Shuffle write reduced from 1.8TB to 1.04TB (42% reduction)",
        "Job completion time decreased from 3.1 hours to 1.9 hours",
        "Executor memory pressure dropped by 35%",
        "Spill-to-disk events eliminated entirely"
      ]},
      { type: "callout", calloutType: "interview", text: "Q: How would you optimize a Spark job that's spending most of its time on shuffle operations?\n\nA: First, diagnose with the Spark UI — check shuffle read/write metrics and partition sizes. Then consider: (1) pre-partitioning data by join keys, (2) broadcast joins for small tables, (3) salting skewed keys, (4) custom partitioners for known distributions." },
      { type: "heading", level: 2, text: "Key Optimization Checklist" },
      { type: "list", items: [
        "Profile your shuffle metrics before optimizing",
        "Check for partition skew using stddev analysis",
        "Consider broadcast joins for tables < 10MB",
        "Use salting for heavily skewed keys",
        "Set spark.sql.shuffle.partitions based on data volume",
        "Monitor with Spark UI after changes"
      ]}
    ]
  },
  {
    id: "medallion-architecture-guide",
    title: "Building a Medallion Architecture with Azure Data Factory and Delta Lake",
    description: "A practical guide to implementing Bronze, Silver, and Gold layers using ADF pipelines and Delta Lake on Azure Databricks.",
    tags: ["Azure Data Factory", "Delta Lake", "Architecture"],
    readingTime: 18,
    date: "2024-10-28",
    author: "Alex Chen",
    featured: true,
    content: [
      { type: "heading", level: 2, text: "What is Medallion Architecture?" },
      { type: "paragraph", text: "The Medallion Architecture is a data design pattern used to logically organize data in a lakehouse. It progressively improves data quality as it flows through three distinct layers: Bronze (raw), Silver (cleaned), and Gold (business-ready)." },
      { type: "callout", calloutType: "takeaway", text: "The Medallion Architecture ensures data quality improves progressively through each layer, making debugging easier and enabling reprocessing from any point." },
      { type: "heading", level: 2, text: "Bronze Layer: Raw Ingestion" },
      { type: "paragraph", text: "The Bronze layer is the landing zone for all raw data. We preserve the original data exactly as received, adding only metadata columns for lineage tracking." },
      { type: "code", language: "python", text: "# Bronze layer ingestion with Delta Lake\nfrom delta.tables import DeltaTable\nfrom pyspark.sql import functions as F\n\ndef ingest_to_bronze(source_path, bronze_path, source_name):\n    raw_df = (\n        spark.read\n        .format('parquet')\n        .load(source_path)\n        .withColumn('_ingested_at', F.current_timestamp())\n        .withColumn('_source_file', F.input_file_name())\n        .withColumn('_source_system', F.lit(source_name))\n    )\n    \n    raw_df.write \\\n        .format('delta') \\\n        .mode('append') \\\n        .partitionBy('_ingested_date') \\\n        .save(bronze_path)" },
      { type: "heading", level: 2, text: "Silver Layer: Cleansed & Conformed" },
      { type: "paragraph", text: "The Silver layer applies schema enforcement, data type casting, deduplication, and basic business rules. This is where most data quality issues are caught and handled." },
      { type: "code", language: "sql", text: "-- Silver layer: Deduplicate and apply quality rules\nMERGE INTO silver.customers AS target\nUSING (\n    SELECT *, \n        ROW_NUMBER() OVER (\n            PARTITION BY customer_id \n            ORDER BY _ingested_at DESC\n        ) AS rn\n    FROM bronze.customers\n    WHERE _ingested_at > '{last_processed}'\n) AS source\nON target.customer_id = source.customer_id\n    AND source.rn = 1\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED AND source.rn = 1 THEN INSERT *" },
      { type: "heading", level: 2, text: "Gold Layer: Business Aggregates" },
      { type: "paragraph", text: "The Gold layer contains business-ready aggregations and metrics. These tables are optimized for specific use cases: dashboards, ML features, or API serving." },
      { type: "callout", calloutType: "usecase", text: "A retail analytics team used this architecture to reduce their report generation time from 45 minutes to 3 minutes by pre-computing Gold-layer aggregates during off-peak hours." },
      { type: "callout", calloutType: "interview", text: "Q: Explain the difference between Bronze, Silver, and Gold layers.\n\nA: Bronze stores raw, unprocessed data exactly as ingested. Silver applies cleaning, deduplication, and schema enforcement. Gold contains business-level aggregations optimized for consumption. Each layer serves as a checkpoint for data quality and enables reprocessing." }
    ]
  },
  {
    id: "sql-window-functions-mastery",
    title: "SQL Window Functions: From Basics to Advanced Analytics",
    description: "Master SQL window functions with practical examples — running totals, ranking, lead/lag analysis, and session detection.",
    tags: ["SQL", "Analytics"],
    readingTime: 15,
    date: "2024-10-10",
    author: "Alex Chen",
    featured: true,
    content: [
      { type: "heading", level: 2, text: "Why Window Functions?" },
      { type: "paragraph", text: "Window functions perform calculations across a set of rows related to the current row, without collapsing the result set like GROUP BY. They're essential for analytics, ranking, and time-series analysis." },
      { type: "callout", calloutType: "takeaway", text: "Window functions let you compute aggregates while keeping individual row detail — something GROUP BY cannot do. This makes them indispensable for analytics engineering." },
      { type: "heading", level: 2, text: "Running Totals and Moving Averages" },
      { type: "code", language: "sql", text: "-- Running total of daily revenue\nSELECT \n    order_date,\n    daily_revenue,\n    SUM(daily_revenue) OVER (\n        ORDER BY order_date\n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS running_total,\n    AVG(daily_revenue) OVER (\n        ORDER BY order_date\n        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n    ) AS moving_avg_7d\nFROM daily_sales\nORDER BY order_date;" },
      { type: "heading", level: 2, text: "Session Detection with Lead/Lag" },
      { type: "paragraph", text: "One powerful application is detecting user sessions from event streams. A new session starts when the gap between events exceeds a threshold." },
      { type: "code", language: "sql", text: "-- Detect sessions with 30-minute inactivity threshold\nWITH event_gaps AS (\n    SELECT\n        user_id,\n        event_timestamp,\n        LAG(event_timestamp) OVER (\n            PARTITION BY user_id\n            ORDER BY event_timestamp\n        ) AS prev_event,\n        DATEDIFF(\n            MINUTE,\n            LAG(event_timestamp) OVER (\n                PARTITION BY user_id\n                ORDER BY event_timestamp\n            ),\n            event_timestamp\n        ) AS gap_minutes\n    FROM user_events\n)\nSELECT\n    user_id,\n    event_timestamp,\n    SUM(CASE WHEN gap_minutes > 30 OR gap_minutes IS NULL THEN 1 ELSE 0 END)\n        OVER (PARTITION BY user_id ORDER BY event_timestamp) AS session_id\nFROM event_gaps;" },
      { type: "callout", calloutType: "interview", text: "Q: What's the difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?\n\nA: ROW_NUMBER() assigns unique sequential numbers. RANK() assigns the same rank to ties but skips numbers (1,2,2,4). DENSE_RANK() assigns the same rank to ties without gaps (1,2,2,3). Use ROW_NUMBER for deduplication, RANK/DENSE_RANK for leaderboards." }
    ]
  },
  {
    id: "airflow-best-practices",
    title: "Apache Airflow: DAG Design Patterns for Production Pipelines",
    description: "Battle-tested patterns for building reliable, maintainable Airflow DAGs including error handling, idempotency, and dynamic task generation.",
    tags: ["Airflow", "Orchestration", "Python"],
    readingTime: 14,
    date: "2024-09-20",
    author: "Alex Chen",
    featured: false,
    content: [
      { type: "heading", level: 2, text: "Idempotent DAG Design" },
      { type: "paragraph", text: "Every production DAG must be idempotent — running it multiple times with the same inputs should produce the same output. This is crucial for retry logic and backfill operations." },
      { type: "code", language: "python", text: "from airflow.decorators import dag, task\nfrom datetime import datetime\n\n@dag(\n    schedule='@daily',\n    start_date=datetime(2024, 1, 1),\n    catchup=False,\n    tags=['production', 'etl'],\n    default_args={\n        'retries': 3,\n        'retry_delay': timedelta(minutes=5),\n    }\n)\ndef daily_pipeline():\n    \n    @task\n    def extract(execution_date=None):\n        \"\"\"Idempotent extract: always reads the same date partition.\"\"\"\n        date_str = execution_date.strftime('%Y-%m-%d')\n        return read_partition(f's3://raw/{date_str}/')\n    \n    @task\n    def transform(data):\n        \"\"\"Pure function: same input always produces same output.\"\"\"\n        return apply_business_rules(data)\n    \n    @task\n    def load(data, execution_date=None):\n        \"\"\"Idempotent load: overwrites the target partition.\"\"\"\n        date_str = execution_date.strftime('%Y-%m-%d')\n        write_partition(data, f's3://processed/{date_str}/', mode='overwrite')\n\n    raw = extract()\n    cleaned = transform(raw)\n    load(cleaned)" },
      { type: "callout", calloutType: "takeaway", text: "The three pillars of production Airflow: Idempotency (safe retries), Atomicity (all-or-nothing tasks), and Observability (comprehensive logging and alerting)." },
      { type: "heading", level: 2, text: "Dynamic Task Generation" },
      { type: "paragraph", text: "When you need to process multiple tables or sources with the same logic, dynamic task generation keeps your DAGs DRY." },
      { type: "code", language: "python", text: "TABLES = ['users', 'orders', 'products', 'inventory']\n\nfor table in TABLES:\n    extract = PythonOperator(\n        task_id=f'extract_{table}',\n        python_callable=extract_table,\n        op_kwargs={'table_name': table},\n    )\n    \n    load = PythonOperator(\n        task_id=f'load_{table}',\n        python_callable=load_table,\n        op_kwargs={'table_name': table},\n    )\n    \n    extract >> load" },
      { type: "callout", calloutType: "interview", text: "Q: How do you handle failures in Airflow DAGs?\n\nA: Use retries with exponential backoff for transient errors. Implement on_failure_callback for alerting. Design tasks to be idempotent so retries are safe. Use task-level SLAs to detect slow runs. For critical pipelines, add sensor tasks that verify upstream data availability before processing." }
    ]
  },
  {
    id: "snowflake-cost-optimization",
    title: "Snowflake Cost Optimization: Warehouse Sizing and Query Tuning",
    description: "Practical strategies to reduce Snowflake costs by 40% through warehouse right-sizing, clustering keys, and query optimization.",
    tags: ["Snowflake", "SQL", "Performance"],
    readingTime: 11,
    date: "2024-09-05",
    author: "Alex Chen",
    featured: false,
    content: [
      { type: "heading", level: 2, text: "Understanding Snowflake Credits" },
      { type: "paragraph", text: "Snowflake pricing is based on compute credits and storage. The biggest cost driver is virtual warehouse usage — and most teams drastically over-provision their warehouses." },
      { type: "callout", calloutType: "takeaway", text: "70% of Snowflake cost optimization comes from right-sizing warehouses and implementing auto-suspend. Start with X-Small and scale up only when query performance requires it." },
      { type: "heading", level: 2, text: "Warehouse Right-Sizing" },
      { type: "code", language: "sql", text: "-- Analyze warehouse utilization\nSELECT\n    warehouse_name,\n    AVG(avg_running) AS avg_queries_running,\n    AVG(avg_queued_load) AS avg_queued,\n    SUM(credits_used) AS total_credits,\n    COUNT(DISTINCT DATE_TRUNC('day', start_time)) AS active_days,\n    SUM(credits_used) / COUNT(DISTINCT DATE_TRUNC('day', start_time)) \n        AS credits_per_day\nFROM snowflake.account_usage.warehouse_metering_history\nWHERE start_time > DATEADD('day', -30, CURRENT_TIMESTAMP())\nGROUP BY warehouse_name\nORDER BY total_credits DESC;" },
      { type: "heading", level: 2, text: "Clustering Keys for Large Tables" },
      { type: "paragraph", text: "For tables exceeding 1TB, clustering keys can dramatically improve query performance by reducing micro-partition scanning." },
      { type: "code", language: "sql", text: "-- Add clustering key on frequently filtered columns\nALTER TABLE analytics.fact_events\n    CLUSTER BY (event_date, event_type);\n\n-- Monitor clustering quality\nSELECT SYSTEM$CLUSTERING_INFORMATION(\n    'analytics.fact_events', \n    '(event_date, event_type)'\n);" },
      { type: "callout", calloutType: "usecase", text: "A SaaS company reduced their monthly Snowflake bill from $12,000 to $7,200 by implementing auto-suspend (60s), right-sizing warehouses, and adding clustering keys to their three largest fact tables." }
    ]
  },
  {
    id: "pyspark-testing-strategies",
    title: "Testing PySpark Applications: Unit Tests to Integration Tests",
    description: "Comprehensive guide to testing PySpark code with pytest, including DataFrame comparisons, mock data generation, and CI/CD integration.",
    tags: ["PySpark", "Testing", "Python"],
    readingTime: 13,
    date: "2024-08-22",
    author: "Alex Chen",
    featured: false,
    content: [
      { type: "heading", level: 2, text: "Why Test Spark Code?" },
      { type: "paragraph", text: "Data pipeline bugs are expensive. A malformed transformation can silently corrupt downstream analytics for days before anyone notices. Automated tests catch these issues before deployment." },
      { type: "callout", calloutType: "takeaway", text: "Test your transformations, not Spark itself. Focus on business logic validation — schema checks, null handling, edge cases in calculations, and data type casting." },
      { type: "heading", level: 2, text: "Setting Up pytest with PySpark" },
      { type: "code", language: "python", text: "import pytest\nfrom pyspark.sql import SparkSession\nfrom pyspark.sql import functions as F\n\n@pytest.fixture(scope='session')\ndef spark():\n    \"\"\"Create a SparkSession for testing.\"\"\"\n    return (\n        SparkSession.builder\n        .master('local[2]')\n        .appName('unit-tests')\n        .config('spark.sql.shuffle.partitions', '2')\n        .getOrCreate()\n    )\n\n@pytest.fixture\ndef sample_orders(spark):\n    \"\"\"Generate sample order data.\"\"\"\n    data = [\n        (1, 'A', 100.0, '2024-01-01'),\n        (2, 'B', 200.0, '2024-01-01'),\n        (3, 'A', 150.0, '2024-01-02'),\n        (4, 'A', None, '2024-01-02'),  # Edge case: null amount\n    ]\n    return spark.createDataFrame(\n        data, ['order_id', 'customer_id', 'amount', 'order_date']\n    )" },
      { type: "heading", level: 2, text: "Testing Transformations" },
      { type: "code", language: "python", text: "def test_daily_revenue_excludes_nulls(spark, sample_orders):\n    \"\"\"Verify null amounts are excluded from revenue.\"\"\"\n    result = calculate_daily_revenue(sample_orders)\n    \n    row = result.filter(F.col('order_date') == '2024-01-02').first()\n    assert row['total_revenue'] == 150.0  # Only non-null amount\n    assert row['order_count'] == 1        # Null orders excluded\n\ndef test_schema_matches_expected(spark, sample_orders):\n    \"\"\"Ensure output schema is correct.\"\"\"\n    result = calculate_daily_revenue(sample_orders)\n    expected_cols = {'order_date', 'total_revenue', 'order_count'}\n    assert set(result.columns) == expected_cols" },
      { type: "callout", calloutType: "interview", text: "Q: How do you ensure data quality in your pipelines?\n\nA: Three layers: (1) Unit tests for transformation logic using pytest + local Spark. (2) Data quality checks at runtime using Great Expectations or custom assertions. (3) Monitoring with row count trends, null rate alerts, and freshness checks on downstream tables." }
    ]
  }
];

export const allTags = [...new Set(articles.flatMap(a => a.tags))].sort();
